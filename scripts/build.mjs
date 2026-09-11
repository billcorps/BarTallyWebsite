import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import { escapeHtml, settings } from "./settings.mjs";

const config = settings();
await build({ build: { outDir: "dist", emptyOutDir: true } });
await build({
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ".prerender",
    emptyOutDir: true,
  },
});

const { pages, render } = await import(
  pathToFileURL(resolve(".prerender/entry-server.js")).href
);
const template = await readFile("dist/index.html", "utf8");
for (const placeholder of ["<!--app-html-->", "<!--head-tags-->"]) {
  if (!template.includes(placeholder))
    throw new Error(`The HTML template is missing ${placeholder}.`);
}

for (const page of pages) {
  const canonical = new URL(page.path.replace(/^\//, ""), config.url).href;
  const noindex = page.id === "not-found" || !config.ready;
  const metadata = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}">`,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="BarTally">',
    '<meta property="og:locale" content="en_US">',
    `<meta property="og:title" content="${escapeHtml(page.title)}">`,
    `<meta property="og:description" content="${escapeHtml(page.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta name="twitter:card" content="${config.socialImage ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
  ];
  if (config.socialImage)
    metadata.push(
      `<meta property="og:image" content="${escapeHtml(config.socialImage)}">`,
      '<meta property="og:image:alt" content="BarTally drink tracking for Android">',
      `<meta name="twitter:image" content="${escapeHtml(config.socialImage)}">`,
    );
  const html = template
    .replace("<!--head-tags-->", metadata.join("\n    "))
    .replace("<!--app-html-->", render(page.id));
  const destination = resolve(
    "dist",
    page.path === "/404.html"
      ? "404.html"
      : `${page.path.replace(/^\//, "")}index.html`,
  );
  if (
    !destination.startsWith(`${resolve("dist")}\\`) &&
    !destination.startsWith(`${resolve("dist")}/`)
  ) {
    throw new Error(`Page path escapes the output directory: ${page.path}`);
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

const urls = pages
  .filter((page) => page.id !== "not-found")
  .map(
    (page) =>
      `  <url><loc>${escapeHtml(new URL(page.path.replace(/^\//, ""), config.url).href)}</loc></url>`,
  );
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", config.url).href}\n`,
);
await writeFile("dist/.nojekyll", "");
await mkdir("dist/licenses", { recursive: true });
for (const font of ["dm-sans", "fraunces"]) {
  await copyFile(
    `node_modules/@fontsource-variable/${font}/LICENSE`,
    `dist/licenses/${font}.txt`,
  );
}
await writeFile(
  "dist/site-build.json",
  JSON.stringify(
    {
      base: config.base,
      url: config.url.href,
      ready: config.ready,
      pages: pages.map(({ id, path, title, description }) => ({
        id,
        path,
        title,
        description,
      })),
    },
    null,
    2,
  ),
);
console.log(
  `Prerendered ${pages.length} pages${config.ready ? "" : " (draft: public developer identity or a working contact route is missing)"}.`,
);
