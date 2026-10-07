import { Router } from "express";
import mongoose from "mongoose";
import SearchLog from "../models/SearchLog.js";

const router = Router();

function dbReady() {
  return mongoose.connection.readyState === 1;
}

router.post("/search", async (req, res) => {
  const { platform, username } = req.body || {};
  if (!platform || !username)
    return res
      .status(400)
      .json({ error: "platform and username are required" });
  if (!dbReady()) return res.json({ skipped: true });

  try {
    await SearchLog.findOneAndUpdate(
      { platform, username: username.toLowerCase() },
      {
        $set: { originalUsername: username, lastSearchedAt: new Date() },
        $inc: { searchCount: 1 },
        $setOnInsert: { platform, username: username.toLowerCase() },
      },
      { upsert: true },
    );
    res.json({ ok: true });
  } catch (err) {
    // Analytics failures should never break the user's flow.
    console.error("search log error:", err.message);
    res.json({ ok: false });
  }
});

export default router;
