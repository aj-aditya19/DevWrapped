import { Router } from "express";
import {
  fetchGithubProfile,
  fetchGithubRepos,
  summarizeRepos,
  fetchContributionCalendar,
  summarizeCalendar,
} from "../utils/githubClient.js";

const router = Router();

router.get("/user/:username", async (req, res) => {
  try {
    const profile = await fetchGithubProfile(req.params.username);
    res.json(profile);
  } catch (err) {
    const status = err.response?.status === 404 ? 404 : 500;
    res
      .status(status)
      .json({ error: status === 404 ? "User not found" : err.message });
  }
});

router.get("/user/:username/repos", async (req, res) => {
  try {
    const repos = await fetchGithubRepos(req.params.username);
    res.json(summarizeRepos(repos));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:username/calendar", async (req, res) => {
  try {
    const year = parseInt(
      req.query.year || String(new Date().getFullYear()),
      10,
    );
    const days = await fetchContributionCalendar(req.params.username, year);
    res.json({ year, days, ...summarizeCalendar(days) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
