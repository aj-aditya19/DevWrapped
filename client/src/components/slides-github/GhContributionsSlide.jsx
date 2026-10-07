import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ShareButton from "../ShareButton";

function GhContributionsSlide({ data, username, avatar }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const calendar = data.calendar || {};
  const total = calendar.totalContributions || 0;
  const longestStreak = calendar.longestStreak || 0;
  const currentStreak = calendar.currentStreak || 0;
  const days = calendar.days || [];
  const maxCount = Math.max(1, ...days.map((day) => day.count || 0));

  useEffect(() => {
    const duration = 1800;
    const steps = 50;
    const increment = total / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= total) {
        setDisplayNumber(total);
        clearInterval(timer);
      } else {
        setDisplayNumber(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <motion.div
      className="slide stats-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="slide-content"
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          You made
        </motion.div>

        <motion.div
          className="stat-number"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
          style={{
            background: "linear-gradient(135deg, #2ea043 0%, #56d364 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {displayNumber.toLocaleString()}
        </motion.div>

        <motion.div
          className="stat-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center" }}
        >
          contributions this year
        </motion.div>

        <motion.div
          className="github-heatmap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          aria-label="Contribution activity graph"
        >
          {days.map((day) => (
            <span
              key={day.date}
              title={`${day.date}: ${day.count} contributions`}
              className={`heatmap-cell level-${Math.min(4, Math.ceil((day.count / maxCount) * 4))}`}
            />
          ))}
        </motion.div>
        <div
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.85rem",
            marginTop: "0.6rem",
          }}
        >
          {calendar.activeDays || 0} active days this year
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: "3rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "1.5rem 2rem",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.5)" }}
            >
              Longest Streak
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
                marginTop: "0.5rem",
              }}
            >
              {longestStreak} days
            </div>
          </div>
          <div
            style={{
              padding: "1.5rem 2rem",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.5)" }}
            >
              Current Streak
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
                marginTop: "0.5rem",
              }}
            >
              {currentStreak} days
            </div>
          </div>
        </motion.div>
      </div>
      <ShareButton username={username} avatar={avatar} platform="github" />
    </motion.div>
  );
}

export default GhContributionsSlide;
