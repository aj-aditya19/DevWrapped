import { motion } from "framer-motion";
import ShareButton from "../ShareButton";

function GhFinalSlide({ data, username, avatar }) {
  const accountAgeDays = data.profile?.accountAgeDays || 0;
  const accountAgeYears = Math.floor(accountAgeDays / 365.25);
  const summary = [
    { label: "Repos", value: data.profile?.publicRepos ?? "N/A" },
    { label: "Stars", value: data.repos?.totalStars ?? "N/A" },
    { label: "Total commits", value: data.repos?.totalCommits ?? "N/A" },
    { label: "Active days", value: data.calendar?.activeDays ?? "N/A" },
    {
      label: "Time on GitHub",
      value: accountAgeDays
        ? `${accountAgeYears}y · ${accountAgeDays}d`
        : "N/A",
    },
    {
      label: "Best language",
      value: data.repos?.languages?.[0]?.languageName || "N/A",
    },
  ];

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
          width: "100%",
        }}
      >
        <motion.div
          className="wrapped-summary-card"
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "1.25rem",
            borderRadius: "24px",
            border: "1px solid rgba(46,160,67,0.4)",
            background:
              "linear-gradient(145deg, rgba(46,160,67,0.18), rgba(255,255,255,0.04))",
            boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
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
                  border: "3px solid #56d364",
                }}
              />
            ) : (
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#2ea043",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
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
                  color: "#56d364",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                }}
              >
                github wrapped
              </div>
              <div
                style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}
              >
                @{username}
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}
              >
                {data.profile?.name || "Developer profile"}
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
            {summary.map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "0.75rem",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.2)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "#56d364",
                    fontWeight: 800,
                    fontSize: "clamp(0.9rem, 3vw, 1.15rem)",
                    overflowWrap: "anywhere",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.68rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0.6rem",
              marginTop: "0.6rem",
            }}
          >
            {[
              [
                "Best repo",
                data.repos?.topRepo?.name,
                data.repos?.topRepo
                  ? `${data.repos.topRepo.stars} stars`
                  : "N/A",
              ],
              [
                "Most worked repo",
                data.repos?.mostWorkedRepo?.name,
                data.repos?.mostWorkedRepo
                  ? `${data.repos.mostWorkedRepo.commits} commits`
                  : "N/A",
              ],
            ].map(([label, name, detail]) => (
              <div
                key={label}
                style={{
                  padding: "0.8rem",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.2)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.68rem",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    color: "white",
                    fontWeight: 800,
                    marginTop: "0.3rem",
                    overflowWrap: "anywhere",
                  }}
                >
                  {name || "N/A"}
                </div>
                <div
                  style={{
                    color: "#56d364",
                    fontSize: "0.72rem",
                    marginTop: "0.2rem",
                  }}
                >
                  {detail}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          <span style={{ color: "white" }}>{username}'s </span>
          <span
            style={{
              background: "linear-gradient(135deg, #2ea043, #56d364)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {new Date().getFullYear()} Recap
          </span>
        </motion.div>

        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.6rem",
            width: "100%",
            maxWidth: "400px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {summary.map((item, i) => (
            <motion.div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "0.75rem",
                textAlign: "center",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <div
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.4rem)",
                  fontWeight: 700,
                  color: "#56d364",
                }}
              >
                {item.value}
              </div>
              <div
                style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}
              >
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ marginTop: "1rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <ShareButton
            username={username}
            avatar={avatar}
            inline={true}
            platform="github"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GhFinalSlide;
