const BASE_URL = `${import.meta.env.VITE_API_URL || ""}/api/log`;

/**
 * Logs a wrapped search against the Express/MongoDB backend.
 * @param {'leetcode'|'github'} platform
 * @param {string} username
 */
export async function saveUserSearch(platform, username) {
  if (!username) return;
  try {
    await fetch(`${BASE_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, username }),
    });
  } catch (error) {
    console.error("Error saving user search:", error);
    // Don't throw — analytics failures shouldn't break the app flow.
  }
}
