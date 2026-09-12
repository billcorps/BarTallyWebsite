export const pages = [
  {
    id: "home",
    path: "/",
    title: "BarTally — Track your drinks and spending",
    description:
      "Track drinks, calories, alcohol, and spending with BarTally for Android. See how much you drink, what you spend, and when it adds up. All features free.",
  },
  {
    id: "app",
    path: "/app/",
    title: "Meet the app — BarTally",
    description:
      "Search 7,900+ drinks offline. Save favorite servings, pubs, and named prices. Log with one tap, track spending, and use free home-screen widgets.",
  },
  {
    id: "insights",
    path: "/insights/",
    title: "Drinks, costs, and habits — BarTally insights",
    description:
      "See drink and spending totals, daily trends, average costs, nutrition, and place comparisons. Missing prices stay visible and currencies stay separate.",
  },
  {
    id: "privacy",
    path: "/privacy/",
    title: "Privacy policy — BarTally",
    description:
      "How BarTally handles your drink history, recorded prices, optional locations, Google services, purchases, widgets, and this website.",
  },
  {
    id: "not-found",
    path: "/404.html",
    title: "Page not found — BarTally",
    description:
      "This page could not be found. Open the BarTally home page to continue.",
  },
] as const;

export type PageId = (typeof pages)[number]["id"];

export function getPage(pathname: string, base = "/") {
  const normalizedBase = `/${base.replace(/^\/+|\/+$/g, "")}`;
  let path = pathname;
  if (
    normalizedBase !== "/" &&
    (path === normalizedBase || path.startsWith(`${normalizedBase}/`))
  ) {
    path = path.slice(normalizedBase.length) || "/";
  }
  path = path.replace(/\/index\.html$/, "/").replace(/\/+$/, "") || "/";
  return (
    pages.find((page) => (page.path.replace(/\/+$/, "") || "/") === path) ??
    pages[4]
  );
}
