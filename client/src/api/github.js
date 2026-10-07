const BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api/github/user`;

export async function fetchGithubProfile(username) {
  const response = await fetch(`${BASE_URL}/${username}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

export async function fetchGithubRepoStats(username) {
  const response = await fetch(`${BASE_URL}/${username}/repos`);
  if (!response.ok) throw new Error('Failed to fetch repo stats');
  return response.json();
}

export async function fetchGithubCalendar(username, year = new Date().getFullYear()) {
  const response = await fetch(`${BASE_URL}/${username}/calendar?year=${year}`);
  if (!response.ok) throw new Error('Failed to fetch contribution calendar');
  return response.json();
}

// Fetch all data in parallel, mirrors fetchAllUserData in api/leetcode.js
export async function fetchAllGithubData(username) {
  const promises = [
    fetchGithubProfile(username),
    fetchGithubRepoStats(username),
    fetchGithubCalendar(username),
  ];

  const [profile, repos, calendar] = await Promise.allSettled(promises);

  return {
    profile: profile.status === 'fulfilled' ? profile.value : null,
    repos: repos.status === 'fulfilled' ? repos.value : null,
    calendar: calendar.status === 'fulfilled' ? calendar.value : null,
  };
}
