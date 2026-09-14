# BarTally website

The standalone React and TypeScript marketing site for [BarTally](https://github.com/billcorps/BarTally), hosted from [BarTallyWebsite](https://github.com/billcorps/BarTallyWebsite) on GitHub Pages. The landing page, app overview, insights overview, and privacy policy are rendered to complete HTML at build time. Each route works as a direct link, including with JavaScript disabled; React adds the interactive controls when available.

The site uses the real app screenshots in `public/images`, with no ads in the promotional images. Fonts are bundled locally. It has no analytics SDK, ad SDK, account system, or form backend.

The voice is direct: **Track your drinks. Track your spending.** Pages explain how adults can keep track or use their logged totals while cutting back. The insights demo updates drink counts, recorded USD spending, average price, and missing-price coverage together for 7-, 30-, and 90-day examples. These are clearly labeled examples, not data collected from a visitor. A dedicated spending section explains optional prices, free drinks, and separate currencies; the app preview includes the actual spending screen in both serving-unit sets.

## Local development

The app overview also explains favorites with saved servings, places, and arbitrary named prices. Users select an exact amount manually; there are no automatic happy-hour schedules or stacked discounts. Home repeats the selected price and place, while widgets use the saved default. The built-in catalog contains 8,200+ entries and remains separate from custom drinks and recorded history. ABV and calories are not available for every entry. The privacy policy includes saved favorite details and their possible display on widgets, UTC timestamp storage, and local calendar calculations. History can backfill drinks from favorites, the catalog, or custom drinks with quantity, serving, local date/time, optional price, place, and notes. Creating a custom drink only adds its searchable definition; logging and favoriting are separate actions.

Metrics includes Today, This week, This month, 7 days, 30 days, 90 days, and All time, with Sunday or Monday week starts. Counter widgets offer Today, This week, This month, Last 24 hours, Last 7 days, and Last 30 days; each counter has its own settings. The quick-log widget offers a five-second Undo. The widget artwork on the site is labeled as illustrative, and uses compact examples of both widget types. The interactive insights chart remains a clearly labeled subset of example periods.

Use Node.js 24 LTS (Node 22.12 or later is also supported).

```powershell
cd BarTallyWebsite
npm ci
npm run dev
```

Open the address printed by Vite, including the default `/BarTallyWebsite/` path. For the production version:

```powershell
npm run build
npm run preview
```

`npm run build` checks TypeScript, creates the browser bundle, prerenders all pages, and validates route HTML, metadata, canonical URLs, internal links, anchors, and asset paths. Output is in `dist/`. `npm run format:check` checks source formatting; `npm run format` applies it.

After building, `npm run test:e2e` runs the desktop and mobile browser tests against the production preview. Install the browser first with `npx playwright install chromium` (on Linux, use `npx playwright install --with-deps chromium`). Playwright starts the preview server when needed. The tests exercise direct links and refreshes, navigation, keyboard controls, regional screenshots, spending examples and coverage, local fonts and images, privacy anchors, layouts from 320 to 1440 pixels, reduced motion, pages with JavaScript disabled, and serious or critical accessibility violations. The preview and tests use the configured `VITE_BASE_PATH`.

## Public configuration

Copy `.env.example` to `.env.local` for local values. Values prefixed with `VITE_` become **public content**; never put secrets in them.

| Variable              | Purpose                                                  | Default                                                  |
| --------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `VITE_BASE_PATH`      | Site path, with leading and trailing slash               | `/BarTallyWebsite/`                                      |
| `VITE_SITE_URL`       | Complete public HTTPS URL, including that same path      | `https://billcorps.github.io/BarTallyWebsite/`           |
| `VITE_DEVELOPER_NAME` | Public developer or legal entity responsible for the app | William Haggerty, from `site-defaults.json`              |
| `VITE_SUPPORT_EMAIL`  | Optional direct website support and privacy contact      | Empty; the live Play listing can provide contact instead |
| `VITE_PLAY_STORE_URL` | Live Google Play app listing URL                         | Empty; the site shows the upcoming release state         |
| `VITE_SOCIAL_IMAGE`   | Absolute HTTPS social preview image URL                  | Site URL + `images/social-card.png`                      |

The public developer is **William Haggerty**. A direct website email is optional. The planned feedback route is the live Google Play listing: public reviews for general feedback and **App support** for private privacy questions. Keep `VITE_PLAY_STORE_URL` blank until that listing is actually live and its App support contact works; local builds validate the URL format and package name; the separate publishing check also verifies that the public listing responds successfully and identifies BarTally. The site truthfully shows the upcoming release state in the meantime.

Builds remain available while the contact route is pending. Those draft builds contain `noindex` metadata. `npm run check:publish` requires the public developer identity and either a valid `VITE_SUPPORT_EMAIL` or the configured live `VITE_PLAY_STORE_URL`. Any configured Play link must pass a public HTTP check with a ten-second timeout; the deployment workflow runs it before uploading a publishable artifact. Before using the Play route, verify that App support provides a monitored private contact for privacy questions. Review the policy against the shipped Android configuration too.

**Release check, September 14, 2026:** the public BarTally listing currently returns HTTP 404. The privacy page is reachable, but its Play App support route cannot yet be used publicly. The publishing check will reject that unavailable listing. Local builds and previews continue to work; release the public listing with a working private contact, or configure a direct support email and remove the unavailable Play URL before publishing.

Google Play itself still requires a valid support email on the app listing, even when this website does not display one directly. Public reviews do not replace that requirement. Configure it in Play Console before the app is released. [Google Play support requirements](https://support.google.com/googleplay/android-developer/answer/113477?hl=en-EN).

For a custom domain, set `VITE_BASE_PATH=/` and `VITE_SITE_URL=https://your-domain.example/`, and configure the domain in GitHub Pages. For a different repository, update both values to its actual public URL. The build rejects a mismatch between the base path and canonical URL path.

## Publish with GitHub Pages

1. In the **BarTallyWebsite** repository, open **Settings → Pages** and choose **GitHub Actions** as the publishing source.
2. In this same repository, open **Settings → Secrets and variables → Actions → Variables** and configure `VITE_PLAY_STORE_URL` after verifying the live listing and its App support contact, or set `VITE_SUPPORT_EMAIL` if a direct website contact is desired. William Haggerty is already the default developer name. Add other variables only when overriding their defaults.
3. Merge the website changes into `main`, or run the **Website** workflow manually from the repository's default branch. Pull requests build and validate the site without deploying it.

The default Pages URL and path already match this repository; do not copy an old `/BarTally/` override. Repository settings do not transfer automatically. During the September 11, 2026 move, the existing public `VITE_PLAY_STORE_URL` value was copied into **BarTallyWebsite**. Pages must use **GitHub Actions** as its source in this repository.

The workflow checks formatting, builds and validates the static pages, then installs Chromium and runs the browser suite before deployment. Failed browser reports, screenshots, and traces are retained as a `website-browser-failure` Actions artifact for seven days. The Pages artifact contains only `dist`; reports are never included in the published site.

Deployment uses the `github-pages` environment, and its write permission is limited to the deploy job. No website has been uploaded as part of local implementation. If the default branch is renamed, update the workflow's `push.branches` entry too; the deployment condition always checks the repository's actual default branch.

After publication, the policy URL is `https://billcorps.github.io/BarTallyWebsite/privacy/` with the default configuration. Check the actual published page before entering it in Play Console.

## Structure

- `src/App.tsx` and `src/styles.css`: page content, components, and responsive visual design.
- `src/routes.ts`: page identities, paths, titles, and descriptions.
- `src/config.ts`: public app/developer configuration.
- `scripts/build.mjs`: static HTML, sharing metadata, sitemap, robots file, and 404 generation.
- `scripts/check-build.mjs`: local build smoke checks without network access.
- `.github/workflows/website.yml` (repository root): validation and GitHub Pages deployment.

The prerender server bundle stays in `.prerender/`; it is neither published nor required at runtime. Pages serves ordinary HTML, CSS, JavaScript, images, and fonts.

Implementation follows the official [Vite static deployment guide](https://vite.dev/guide/static-deploy.html), [Vite SSR build guide](https://vite.dev/guide/ssr), and [GitHub Pages custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Refreshing app screenshots

The app and screenshot tools remain in the [BarTally repository](https://github.com/billcorps/BarTally). Copy reviewed US screenshots from its `product_materials/regions/us/` into this repository's `public/images/us/`, and the international metric set into `public/images/metric/`. Copy updated social artwork to `public/images/social-card.png`. The website has no build-time dependency on the Android checkout.
