import axios from "axios";
import * as cheerio from "cheerio";

const GITHUB_API = "https://api.github.com";

function authHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "devwrapped-app",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

export async function fetchGithubProfile(username) {
  const { data } = await axios.get(`${GITHUB_API}/users/${username}`, {
    headers: authHeaders(),
  });
  return {
    username: data.login,
    name: data.name,
    avatar: data.avatar_url,
    bio: data.bio,
    company: data.company,
    location: data.location,
    blog: data.blog,
    followers: data.followers,
    following: data.following,
    publicRepos: data.public_repos,
    createdAt: data.created_at,
    accountAgeDays: Math.max(
      0,
      Math.floor((Date.now() - new Date(data.created_at).getTime()) / 86400000),
    ),
    profileUrl: data.html_url,
  };
}

// Pulls up to 300 owned repos (3 pages) — enough for a stats summary without hammering the API.
export async function fetchGithubRepos(username) {
  let repos = [];
  for (let page = 1; page <= 3; page++) {
    const { data } = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
      headers: authHeaders(),
      params: { per_page: 100, page, type: "owner", sort: "pushed" },
    });
    repos = repos.concat(data);
    if (data.length < 100) break;
  }
  const trackedRepos = repos
    .filter((repo) => repo.full_name)
    .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0))
    .slice(0, 20);
  const commitCounts = await Promise.all(
    trackedRepos.map(async (repo) => {
      try {
        const response = await axios.get(
          `${GITHUB_API}/repos/${repo.full_name}/commits`,
          {
            headers: authHeaders(),
            params: { author: username, per_page: 100 },
          },
        );
        return [repo.id, response.data.length];
      } catch {
        return [repo.id, 0];
      }
    }),
  );
  const counts = Object.fromEntries(commitCounts);
  let totalCommits = 0;
  try {
    const { data } = await axios.get(`${GITHUB_API}/search/commits`, {
      headers: authHeaders(),
      params: { q: `author:${username}`, per_page: 1 },
    });
    totalCommits = data.total_count || 0;
  } catch {
    totalCommits = Object.values(counts).reduce((sum, count) => sum + count, 0);
  }
  return { repos, commitCounts: counts, totalCommits };
}

export function summarizeRepos(repoResult) {
  const repos = Array.isArray(repoResult) ? repoResult : repoResult.repos;
  const commitCounts = Array.isArray(repoResult) ? {} : repoResult.commitCounts;
  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count || 0),
    0,
  );
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

  const languageCounts = {};
  repos.forEach((r) => {
    if (r.language)
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
  });
  const languages = Object.entries(languageCounts)
    .map(([languageName, reposCount]) => ({ languageName, reposCount }))
    .sort((a, b) => b.reposCount - a.reposCount);

  const topRepo =
    [...repos].sort(
      (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0),
    )[0] || null;
  const mostWorkedRepo =
    [...repos].sort(
      (a, b) => (commitCounts[b.id] || 0) - (commitCounts[a.id] || 0),
    )[0] || null;

  return {
    repoCount: repos.length,
    totalStars,
    totalForks,
    languages,
    topRepo: topRepo && {
      name: topRepo.name,
      description: topRepo.description,
      stars: topRepo.stargazers_count,
      forks: topRepo.forks_count,
      language: topRepo.language,
      url: topRepo.html_url,
    },
    totalCommits: Array.isArray(repoResult)
      ? Object.values(commitCounts).reduce((sum, count) => sum + count, 0)
      : repoResult.totalCommits,
    mostWorkedRepo: mostWorkedRepo && {
      name: mostWorkedRepo.name,
      description: mostWorkedRepo.description,
      commits: commitCounts[mostWorkedRepo.id] || 0,
      language: mostWorkedRepo.language,
      url: mostWorkedRepo.html_url,
    },
  };
}

// Scrapes GitHub's public contribution graph (no auth/token needed) for a given calendar year.
export async function fetchContributionCalendar(username, year) {
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;
  const url = `https://github.com/users/${username}/contributions?from=${from}&to=${to}`;
  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DevWrappedBot/1.0)" },
  });
  const $ = cheerio.load(html);
  const days = [];

  // Older markup: <rect data-date="" data-count="">
  $("rect[data-date]").each((_, el) => {
    const date = $(el).attr("data-date");
    const count = parseInt($(el).attr("data-count") || "0", 10);
    if (date) days.push({ date, count });
  });

  // Current markup: <td data-date> whose count lives in a matching <tool-tip for="id">
  if (days.length === 0) {
    const tooltipTextById = {};
    $("tool-tip").each((_, el) => {
      const forId = $(el).attr("for");
      if (forId) tooltipTextById[forId] = $(el).text().trim();
    });
    $("td[data-date]").each((_, el) => {
      const date = $(el).attr("data-date");
      const id = $(el).attr("id");
      const tooltip = id ? tooltipTextById[id] : null;
      let count = 0;
      if (tooltip) {
        const match = tooltip.match(/^(No|\d+)\s+contribution/i);
        if (match)
          count = match[1].toLowerCase() === "no" ? 0 : parseInt(match[1], 10);
      }
      if (date) days.push({ date, count });
    });
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export function summarizeCalendar(days) {
  const totalContributions = days.reduce((sum, d) => sum + d.count, 0);

  let longestStreak = 0;
  let currentRun = 0;
  let currentStreak = 0;
  days.forEach((d, i) => {
    if (d.count > 0) {
      currentRun += 1;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 0;
    }
  });
  // current streak = trailing run of active days up to the last active day
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) currentStreak += 1;
    else if (currentStreak > 0) break;
  }

  const bestDay = days.reduce(
    (best, d) => (d.count > (best?.count || 0) ? d : best),
    null,
  );

  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun..Sat
  days.forEach((d) => {
    const dow = new Date(d.date + "T00:00:00Z").getUTCDay();
    weekdayTotals[dow] += d.count;
  });
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const favoriteWeekdayIndex = weekdayTotals.indexOf(
    Math.max(...weekdayTotals),
  );

  const activeDays = days.filter((d) => d.count > 0).length;
  const firstActiveDay = days.find((d) => d.count > 0)?.date || null;
  const lastActiveDay =
    [...days].reverse().find((d) => d.count > 0)?.date || null;

  return {
    totalContributions,
    activeDays,
    firstActiveDay,
    lastActiveDay,
    longestStreak,
    currentStreak,
    bestDay,
    weekdayTotals: weekdayNames.map((name, i) => ({
      name,
      count: weekdayTotals[i],
    })),
    favoriteWeekday: weekdayNames[favoriteWeekdayIndex],
  };
}
