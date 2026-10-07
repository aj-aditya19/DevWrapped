import { motion } from "framer-motion";
import { useMemo } from "react";
import ShareButton from "../ShareButton";

const YEAR = new Date().getFullYear();
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const FULL_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const languageIcons = {
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  python3:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  javascript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  typescript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
};

function FinalSlide({ data, username, avatar }) {
  const easy = data.solved?.easySolved || 0;
  const medium = data.solved?.mediumSolved || 0;
  const hard = data.solved?.hardSolved || 0;
  const total = easy + medium + hard;

  const dominantDifficulty = useMemo(() => {
    if (hard >= medium && hard >= easy)
      return { name: "Hard", color: "#FF375F" };
    if (medium >= easy) return { name: "Medium", color: "#FFC01E" };
    return { name: "Easy", color: "#00B8A3" };
  }, [easy, medium, hard]);

  const stats = useMemo(() => {
    const calendarData = data.calendar?.submissionCalendar || "{}";
    let submissionMap = {};
    try {
      submissionMap = JSON.parse(calendarData);
    } catch (e) {
      return {};
    }

    const monthCounts = {};
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = {};
    let totalSubmissions = 0;
    let activeDays = 0;
    let longestStreak = 0;
    const sortedDates = [];

    Object.entries(submissionMap).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date.getUTCFullYear() === YEAR && count > 0) {
        activeDays++;
        totalSubmissions += count;
        const month = date.getUTCMonth();
        monthCounts[month] = (monthCounts[month] || 0) + count;
        weekdayCounts[date.getUTCDay()] += count;
        const dayKey = `${MONTH_NAMES[month]} ${date.getUTCDate()}`;
        dayCounts[dayKey] = (dayCounts[dayKey] || 0) + count;
        sortedDates.push(
          `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`,
        );
      }
    });

    sortedDates.sort();
    let tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1] + "T00:00:00Z");
      const curr = new Date(sortedDates[i] + "T00:00:00Z");
      if ((curr - prev) / (1000 * 60 * 60 * 24) === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    let bestMonth = null,
      maxMonthCount = 0;
    Object.entries(monthCounts).forEach(([m, c]) => {
      if (c > maxMonthCount) {
        maxMonthCount = c;
        bestMonth = MONTH_NAMES[parseInt(m)];
      }
    });

    let bestWeekdayIdx = 0,
      maxWeekday = 0;
    weekdayCounts.forEach((c, i) => {
      if (c > maxWeekday) {
        maxWeekday = c;
        bestWeekdayIdx = i;
      }
    });

    let bestDay = null,
      maxDayCount = 0;
    Object.entries(dayCounts).forEach(([d, c]) => {
      if (c > maxDayCount) {
        maxDayCount = c;
        bestDay = d;
      }
    });

    const langs = data.languageStats?.languageProblemCount || [];
    const mergedLangs = {};
    langs.forEach((l) => {
      let name = l.languageName;
      if (name.toLowerCase() === "python3" || name.toLowerCase() === "python")
        name = "Python";
      mergedLangs[name] = (mergedLangs[name] || 0) + l.problemsSolved;
    });
    const topLang =
      Object.entries(mergedLangs).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const skillStats = data.skillStats;
    let topTopic = null;
    let maxTag = 0;
    if (skillStats) {
      const allTags = {};
      ["fundamental", "intermediate", "advanced"].forEach((level) => {
        if (skillStats[level]) {
          skillStats[level].forEach((tag) => {
            allTags[tag.tagName] =
              (allTags[tag.tagName] || 0) + tag.problemsSolved;
          });
        }
      });

      Object.entries(allTags).forEach(([n, c]) => {
        if (c > maxTag) {
          maxTag = c;
          topTopic = n;
        }
      });
    }

    return {
      totalSubmissions,
      activeDays,
      longestStreak,
      bestMonth,
      bestMonthCount: maxMonthCount,
      bestWeekday: FULL_DAY_NAMES[bestWeekdayIdx],
      bestWeekdayCount: maxWeekday,
      bestDay,
      bestDayCount: maxDayCount,
      topLanguage: topLang,
      topLanguageCount: mergedLangs[topLang] || 0,
      topTopic,
      topTopicCount: maxTag,
      dominantDifficulty: dominantDifficulty.name,
      dominantDifficultyCount:
        dominantDifficulty.name === "Easy"
          ? easy
          : dominantDifficulty.name === "Medium"
            ? medium
            : hard,
      badgesCount: data.badges?.length || 0,
      badges: data.badges || [],
    };
  }, [data]);

  const langIcon = stats.topLanguage
    ? languageIcons[stats.topLanguage.toLowerCase()]
    : null;

  /*
  const gridItems = [
    { label: 'Problems', value: total, color: '#FFA116' },
    { label: 'Difficulty', value: `Mostly ${dominantDifficulty.name}`, color: dominantDifficulty.color },
    { label: 'Day Streak', value: stats.longestStreak, color: '#fa709a' },
    { label: 'Active Days', value: stats.activeDays, color: '#4facfe' },
    { label: 'Submissions', value: stats.totalSubmissions, color: '#a78bfa' },
    { label: 'Best Month', value: stats.bestMonth, color: '#40C4A9' },
    { label: 'Top Weekday', value: stats.bestWeekday?.slice(0,3), color: '#f59e0b' },
    { label: 'Peak Day', value: stats.bestDay, color: '#FFD700' },
  ];
  */

  return (
    <motion.div
      className="slide final-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      style={{
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "180px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1.5rem",
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <motion.h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
            marginBottom: "1rem",
            textAlign: "center",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {username}'s{" "}
          <span style={{ color: "#FFA116" }}>{YEAR} WrappedCard</span>
        </motion.h1>
        <motion.div
          className="wrapped-summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            width: "100%",
            padding: "1.25rem",
            borderRadius: "24px",
            border: "1px solid rgba(255, 161, 22, 0.35)",
            background:
              "linear-gradient(145deg, rgba(255,161,22,0.18), rgba(255,255,255,0.04))",
            boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              marginBottom: "1rem",
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt=""
                crossOrigin="anonymous"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #FFA116",
                }}
              />
            ) : (
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#FFA116",
                  display: "grid",
                  placeItems: "center",
                  color: "#111",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                }}
              >
                {username[0]?.toUpperCase()}
              </div>
            )}
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  color: "#FFA116",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                }}
              >
                leetcode wrapped
              </div>
              <div
                style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}
              >
                u/{username}
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}
              >
                {data.profile?.realName || "Developer profile"}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0.55rem",
            }}
          >
            {[
              ["Questions solved", total.toLocaleString(), "#FFA116"],
              [
                "Better rank",
                data.profile?.ranking
                  ? `#${Number(data.profile.ranking).toLocaleString()}`
                  : "N/A",
                "#56d364",
              ],
              ["Main language", stats.topLanguage || "N/A", "#4facfe"],
              ["Active days", stats.activeDays.toLocaleString(), "#f093fb"],
              [
                "Best language",
                stats.topLanguage
                  ? `${stats.topLanguage} · ${stats.topLanguageCount}`
                  : "N/A",
                "#FFD166",
              ],
              ["Best topic", stats.topTopic || "N/A", "#FF6B6B"],
            ].map(([label, value, color]) => (
              <div
                key={label}
                style={{
                  padding: "0.75rem",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.2)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color,
                    fontWeight: 800,
                    fontSize: "clamp(0.9rem, 3vw, 1.15rem)",
                    overflowWrap: "anywhere",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.68rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Share button inline */}
        <motion.div
          style={{ marginTop: "1.5rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <ShareButton username={username} avatar={avatar} inline={true} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default FinalSlide;
