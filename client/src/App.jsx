import { useState } from "react";
import { useAnalytics } from "./hooks/useAnalytics";
import { AnimatePresence } from "framer-motion";
import Landing from "./components/Landing";
import Loading from "./components/Loading";
import GithubWrapped from "./components/GithubWrapped";
import { fetchAllGithubData } from "./api/github";
import { saveUserSearch } from "./api/log";
import { normalizeUsername } from "./utils/username";

function App() {
  const [stage, setStage] = useState("landing");
  const [githubData, setGithubData] = useState(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [error, setError] = useState("");
  const posthog = useAnalytics();

  const handleSubmit = async ({ githubUsername: ghUser }) => {
    setError("");
    const normalizedGhUser = normalizeUsername(ghUser, "github");
    setGithubUsername(normalizedGhUser);
    setStage("loading");

    try {
      const ghResult = normalizedGhUser
        ? await fetchAllGithubData(normalizedGhUser)
        : null;

      const ghData = ghResult;
      const ghValid = ghData?.profile && !ghData.profile.error;

      if (!ghValid) {
        throw new Error("Could not find that GitHub username. Double-check and try again.");
      }

      setGithubData(ghData);
      saveUserSearch("github", normalizedGhUser);
      posthog.capture("wrapped_generated", {
        githubUsername: normalizedGhUser,
      });

      setStage("github");
    } catch (err) {
      setError(err.message || "Failed to fetch GitHub data");
      setStage("landing");
    }
  };

  const handleRestart = () => {
    setStage("landing");
    setGithubData(null);
    setGithubUsername("");
    setError("");
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <Landing key="landing" onSubmit={handleSubmit} error={error} />
        )}
        {stage === "loading" && (
          <Loading key="loading" username={githubUsername} />
        )}
        {stage === "github" && githubData && (
          <GithubWrapped
            key="github"
            data={githubData}
            username={githubUsername}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
