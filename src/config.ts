import defaults from "../site-defaults.json";

export const siteConfig = {
  developerName:
    (import.meta.env.VITE_DEVELOPER_NAME ?? "").trim() ||
    defaults.developerName,
  supportEmail: (import.meta.env.VITE_SUPPORT_EMAIL ?? "").trim(),
  playStoreUrl: (import.meta.env.VITE_PLAY_STORE_URL ?? "").trim(),
};

export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}images/${path}`;
export const href = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
