import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ShareButton from "../ShareButton";

function GhProfileSlide({ data, username, avatar }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const publicRepos = data.profile?.publicRepos || 0;
  const followers = data.profile?.followers || 0;
  const createdAt = data.profile?.createdAt
    ? new Date(data.profile.createdAt)
    : null;
  const accountAgeDays =
    data.profile?.accountAgeDays ??
    (createdAt
      ? Math.floor((Date.now() - createdAt.getTime()) / 86400000)
      : null);
  const accountAgeYears =
    accountAgeDays != null ? Math.floor(accountAgeDays / 365.25) : null;

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = publicRepos / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= publicRepos) {
        setDisplayNumber(publicRepos);
        clearInterval(timer);
      } else {
        setDisplayNumber(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [publicRepos]);

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
          You've been shipping
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
          public repositories
        </motion.div>

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
              Followers
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "white",
                marginTop: "0.5rem",
              }}
            >
              {followers.toLocaleString()}
            </div>
          </div>
          {accountAgeDays != null && (
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
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                Time on GitHub
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "white",
                  marginTop: "0.5rem",
                }}
              >
                {accountAgeYears}y · {accountAgeDays.toLocaleString()}d
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "0.35rem",
                }}
              >
                {data.calendar?.activeDays ?? 0} active days this year
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <ShareButton username={username} avatar={avatar} platform="github" />
    </motion.div>
  );
}

export default GhProfileSlide;
