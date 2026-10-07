export function normalizeUsername(value, platform) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const withoutQuery = raw.split(/[?#]/)[0].replace(/\/+$/, "");
  const candidate = /^https?:\/\//i.test(withoutQuery)
    ? withoutQuery
    : `https://${withoutQuery}`;

  try {
    const url = new URL(candidate);
    const parts = url.pathname.split("/").filter(Boolean);
    const host = url.hostname.toLowerCase();
    const isKnownHost =
      platform === "github"
        ? host === "github.com" || host === "www.github.com"
        : false;

    if (isKnownHost && parts[0]) {
      return decodeURIComponent(parts[0]);
    }
  } catch {
    // Plain usernames are handled below.
  }

  return raw.replace(/^@/, "").split("/")[0].trim();
}
