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
      "Search 8,200+ drinks offline. Save servings, places, and prices. Log now or add past drinks, track spending, and use free home-screen widgets.",
  },
  {
    id: "insights",
    path: "/insights/",
    title: "Drinks, costs, and habits — BarTally insights",
    description:
      "Track drinks and spending by calendar day, week, or month. Compare habits, nutrition, and places, with missing details and separate currencies clearly shown.",
  },
  {
    id: "beta",
    path: "/beta/",
    title: "Join the Android beta — BarTally",
    description:
      "Help test BarTally for Android. Join the tester group, opt into the closed test, and install the app. Free to test, with honest feedback over 14 days.",
  },
  {
    id: "privacy",
    path: "/privacy/",
    title: "Privacy policy — BarTally",
    description:
      "How BarTally handles your drink history, recorded prices, optional saved places, Google services, purchases, widgets, and this website.",
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
    pages.find((page) => page.id === "not-found")!
  );
}
