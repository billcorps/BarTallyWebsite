import { loadEnv } from "vite";
import defaults from "../site-defaults.json" with { type: "json" };

export function settings() {
  const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
  const base = env.VITE_BASE_PATH || "/BarTallyWebsite/";
  const origin =
    env.VITE_SITE_URL || "https://billcorps.github.io/BarTallyWebsite/";
  const url = new URL(origin.endsWith("/") ? origin : `${origin}/`);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "VITE_SITE_URL must be the public HTTPS site URL, without credentials, query, or fragment.",
    );
  }
  if (url.pathname !== base) {
    throw new Error(
      `VITE_SITE_URL path (${url.pathname}) must match VITE_BASE_PATH (${base}).`,
    );
  }
  const developer =
    (env.VITE_DEVELOPER_NAME || "").trim() || defaults.developerName;
  const email = (env.VITE_SUPPORT_EMAIL || "").trim();
  if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    throw new Error(
      "VITE_SUPPORT_EMAIL must be a valid email address when provided.",
    );
  }
  const socialImage = (
    env.VITE_SOCIAL_IMAGE || new URL("images/social-card.png", url).href
  ).trim();
  if (socialImage && new URL(socialImage).protocol !== "https:") {
    throw new Error("VITE_SOCIAL_IMAGE must be a public HTTPS URL.");
  }
  const playUrl = (env.VITE_PLAY_STORE_URL || "").trim();
  if (playUrl) {
    const parsed = new URL(playUrl);
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "play.google.com" ||
      parsed.username ||
      parsed.password ||
      parsed.pathname !== "/store/apps/details" ||
      parsed.searchParams.get("id") !== "com.billcorp.bartally"
    ) {
      throw new Error(
        "VITE_PLAY_STORE_URL must be the HTTPS Google Play listing URL for com.billcorp.bartally. Configure it only after the listing is live and its App support contact is available.",
      );
    }
  }
  const ready = Boolean(developer && (email || playUrl));
  return { base, url, developer, email, playUrl, ready, socialImage };
}

export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}
