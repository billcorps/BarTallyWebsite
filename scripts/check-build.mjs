import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = resolve("dist");
const report = JSON.parse(
  await readFile(resolve(root, "site-build.json"), "utf8"),
);
const expectedPaths = [
  "/",
  "/app/",
  "/insights/",
  "/beta/",
  "/privacy/",
  "/404.html",
];
assert.deepEqual(
  report.pages.map((page) => page.path).sort(),
  expectedPaths.sort(),
  "All pages, including the real 404 document, must be generated.",
);

function outputPath(pathname) {
  assert(
    pathname.startsWith(report.base),
    `URL escapes the configured site base: ${pathname}`,
  );
  const relative = decodeURIComponent(pathname.slice(report.base.length));
  const filename = resolve(
    root,
    relative.endsWith("/") || !relative ? `${relative}index.html` : relative,
  );
  assert(filename.startsWith(`${root}${sep}`), `URL escapes dist: ${pathname}`);
  return filename;
}

let checkedLinks = 0;
const titles = new Set();
const stylesheets = new Set();
for (const page of report.pages) {
  const url = new URL(page.path.replace(/^\//, ""), report.url);
  const filename = outputPath(url.pathname);
  const html = await readFile(filename, "utf8");
  assert(
    !/<!--(?:app-html|head-tags)-->|\/src\/main\.tsx/.test(html),
    `${page.path} still contains a development placeholder.`,
  );
  assert.match(
    html,
    /<main(?:\s|>)/,
    `${page.path} must contain prerendered main content.`,
  );
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${page.path} must have one primary heading.`,
  );
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title && !titles.has(title), `${page.path} needs a unique title.`);
  titles.add(title);
  assert.match(
    html,
    /<meta name="description" content="[^\"]+">/,
    `${page.path} needs a description.`,
  );
  assert(
    html.includes(`<link rel="canonical" href="${url.href}">`),
    `${page.path} has an incorrect canonical URL.`,
  );
  if (page.id === "not-found" || !report.ready)
    assert(
      html.includes('content="noindex, follow"'),
      "404 and drafts should not be indexed.",
    );

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replace(/&amp;/g, "&");
    if (!value || /^(?:data:|mailto:|tel:)/.test(value)) continue;
    const target = new URL(value, url);
    if (target.origin !== url.origin) continue;
    const targetFile = outputPath(target.pathname);
    await access(targetFile).catch(() => {
      throw new Error(`${page.path} references a missing file: ${value}`);
    });
    checkedLinks++;
    if (targetFile.endsWith(".css")) stylesheets.add(target.href);
    if (target.hash && targetFile.endsWith(".html")) {
      const targetHtml =
        targetFile === filename ? html : await readFile(targetFile, "utf8");
      assert(
        targetHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),
        `${page.path} references a missing anchor: ${value}`,
      );
    }
  }
}
for (const stylesheet of stylesheets) {
  const css = await readFile(outputPath(new URL(stylesheet).pathname), "utf8");
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
    if (/^(?:data:|#)/.test(match[2])) continue;
    const target = new URL(match[2], stylesheet);
    assert.equal(
      target.origin,
      new URL(report.url).origin,
      "Styles and fonts should be self-hosted.",
    );
    await access(outputPath(target.pathname)).catch(() => {
      throw new Error(`A stylesheet references a missing asset: ${match[2]}`);
    });
    checkedLinks++;
  }
}
for (const filename of [
  "robots.txt",
  "sitemap.xml",
  ".nojekyll",
  "licenses/dm-sans.txt",
  "licenses/fraunces.txt",
])
  await access(resolve(root, filename));
console.log(
  `Build smoke checks passed: ${report.pages.length} prerendered pages and ${checkedLinks} local links/assets.`,
);
