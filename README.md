# BarTally website

The standalone React and TypeScript marketing site for [BarTally](https://github.com/billcorps/BarTally), hosted from [BarTallyWebsite](https://github.com/billcorps/BarTallyWebsite) on GitHub Pages. The landing page, app overview, insights overview, beta signup page, and privacy policy are rendered to complete HTML at build time. Each route works as a direct link, including with JavaScript disabled; React adds the interactive controls when available.

The site uses the real app screenshots in `public/images`, with no ads in the promotional images. Fonts are bundled locally. It has no analytics SDK, ad SDK, account system, or form backend.

The voice is direct: **Track your drinks. Track your spending.** Pages explain how adults can keep track or use their logged totals while cutting back. The insights demo updates drink counts, recorded USD spending, average price, and missing-price coverage together for 7-, 30-, and 90-day examples. These are clearly labeled examples, not data collected from a visitor. A dedicated spending section explains optional prices, free drinks, and separate currencies; the app preview includes the actual spending screen in both serving-unit sets.

The app’s Backup & restore screen exports portable JSON through Android’s file picker. Restore previews and merges missing records after the user selects **Restore backup**. Current personal records with matching IDs are kept, and repeated imports do not duplicate them. Untouched built-in starter favorites can be replaced by their backup versions; edited favorites remain protected. History snapshots, custom drinks, favorites with prices and places, and saved places are included; settings, widgets, catalog data, and purchase receipts are not. The privacy policy explains that files contain readable personal data and are stored where the user chooses. No crash-reporting SDK or cloud-sync claim has been added.

## Release materials review — September 25, 2026

The app and insights pages match the pending Android release: quantity and time controls, manual JSON recovery, configurable alcohol units, calendar periods, rapid widget logging, and calculated period findings with supporting entries. Optional local AI remains a short note linked to Google's supported-device list and requires an already available model; BarTally never requests model downloads. The privacy policy already covers the included SDKs and support contact.

Both eight-image regional sets, the app icon, social preview, and favicons match the reviewed Android marketing assets. Images omit ads and use fictional entries. The existing beta enrollment route remains until the production listing is confirmed publicly available; publishing this website does not publish the Android app.

## Local development

The app overview also explains favorites with saved servings, places, and arbitrary named prices. Users select an exact amount manually; there are no automatic happy-hour schedules or stacked discounts. Home repeats the selected price and place. In Search and Favorites, **Log drink** opens quantity and time controls: one drink and **Now** are the defaults, with an earlier local date and time available. Favorites also offers **+1 now** for immediate logging. Logging overrides do not edit the saved favorite; widgets use its saved defaults. The built-in catalog contains 8,200+ entries, including the expanded High Noon, Two Robbers, Suntory -196, Surfside, and Stateside listings, and remains separate from custom drinks and recorded history. ABV and calories are not available for every entry. The privacy policy includes saved favorite details and their possible display on widgets, UTC timestamp storage, and local calendar calculations. History can backfill drinks from favorites, the catalog, or custom drinks with quantity, serving, local date/time, optional price, place, and notes. Creating a custom drink only adds its searchable definition; logging and favoriting are separate actions.

Metrics includes Today, This week, This month, 7 days, 30 days, 90 days, and All time, with Sunday or Monday week starts. Counter widgets offer Today, This week, This month, Last 24 hours, Last 7 days, and Last 30 days; each counter has its own settings. The quick-log widget accepts rapid +1 taps, shows Added 1 / Added 2 inline for three seconds, and offers a five-second Undo. It no longer displays system toasts or requests notification permission. Alcohol totals default to grams, with milliliters of pure alcohol and US standard drinks available in Units. The widget artwork on the site is labeled as illustrative, and uses compact examples of both widget types. App time labels and pickers follow the phone’s 12- or 24-hour clock setting; US and metric screenshots demonstrate independently selected clock settings. The interactive insights chart remains a clearly labeled subset of example periods.

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
| `VITE_SUPPORT_EMAIL`  | Public website support and privacy contact               | `bartallysupport@gmail.com`, from `site-defaults.json` |
| `VITE_PLAY_STORE_URL` | Live Google Play app listing URL                         | Empty; the site shows the upcoming release state         |
| `VITE_SOCIAL_IMAGE`   | Absolute HTTPS social preview image URL                  | Site URL + `images/social-card.png`                      |

The public developer is **William Haggerty**. The checked-in support and privacy email is **bartallysupport@gmail.com**; an empty `VITE_SUPPORT_EMAIL` uses that default, including in GitHub Actions. Bug reports and privacy questions can go directly to this address. Keep `VITE_PLAY_STORE_URL` blank until the listing is publicly live; a configured listing is validated for URL shape and checked by the publish command. Closed-test enrollment remains separate.

`npm run check:publish` validates the public identity and contact configuration. The default support email makes the privacy page publishable without a public Play listing. Any configured public Play link must pass its availability check. The deployment workflow only uses the Play link after `VITE_PLAY_STORE_LIVE=true`. Review the policy against the shipped Android configuration before publication.

**Historical release check, September 14, 2026:** the public Play listing returned HTTP 404 then. This is not a current availability check. Leave `VITE_PLAY_STORE_LIVE` unset until the production listing is verified; the beta enrollment links continue to work independently.

Google Play itself still requires a valid support email on the app listing, even when this website does not display one directly. Public reviews do not replace that requirement. Configure it in Play Console before the app is released. [Google Play support requirements](https://support.google.com/googleplay/android-developer/answer/113477?hl=en-EN).

For a custom domain, set `VITE_BASE_PATH=/` and `VITE_SITE_URL=https://your-domain.example/`, and configure the domain in GitHub Pages. For a different repository, update both values to its actual public URL. The build rejects a mismatch between the base path and canonical URL path.

## Publish with GitHub Pages

1. In the **BarTallyWebsite** repository, open **Settings → Pages** and choose **GitHub Actions** as the publishing source.
2. In this same repository, open **Settings → Secrets and variables → Actions → Variables** and leave `VITE_PLAY_STORE_LIVE` unset to publish the beta website; the checked-in support email is used by default. After the listing is publicly available and its App support contact works, configure `VITE_PLAY_STORE_URL` and set `VITE_PLAY_STORE_LIVE=true`. Set `VITE_SUPPORT_EMAIL` only to override `bartallysupport@gmail.com`. William Haggerty is already the default developer name. Add other variables only when overriding their defaults.
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

The app and screenshot tools remain in the [BarTally repository](https://github.com/billcorps/BarTally). Copy reviewed US screenshots from its `product_materials/regions/us/` into this repository's `public/images/us/`, and the international metric set into `public/images/metric/`. The website has no build-time dependency on the Android checkout.
The header and footer use `public/images/app-icon.png`: the shared flat navy icon with mint champagne-flute and beer-mug shapes. Browser tabs use a dedicated small-size two-drink favicon with a rounded navy tile, transparent corners, and enlarged, simplified mint shapes. The site provides `public/images/favicon.svg` plus PNG exports rendered directly at 16 and 32 pixels. Colors come from `product_materials/palette.json` in the Android repository. Edit that configuration, then run this single command from the Android repository root:

```powershell
node tools/generate-palette.mjs --assets --website ../BarTallyWebsite
```

The command regenerates app colors, icon and favicon artwork, this site's `src/palette.css` and browser theme color, then copies the generated app icon, favicon SVG and PNG exports, and social card into `public/images`. It requires the installed Playwright/Chromium and Python/Pillow tooling and works offline. No separate icon-generation or image-copy command is needed for branding. Keep app-icon geometry edits in `product_materials/icon.svg` and favicon geometry edits in `product_materials/favicon.svg`; the website uses the generated assets. The wordmark link already names BarTally, so its accompanying icon is decorative for screen readers. CSS rounds the header and footer presentation tile; the source Play icon remains a full square, while the favicon artwork has its own rounded tile and transparent corners.

## Closed beta enrollment

Share **https://billcorps.github.io/BarTallyWebsite/beta/** after deploying this change. The header, home-page action, footer, and closing actions lead to the signup page while the public Play listing is not enabled.

The three public URLs are stored together in `site-defaults.json` under `beta`: the BarTally Testers Google Group, the closed-test opt-in page, and the Android install listing. They are deliberately separate from `VITE_PLAY_STORE_URL`, which still means the public production listing. Do not set `VITE_PLAY_STORE_LIVE=true` just to recruit closed testers. No additional Actions variables are needed for the beta links.

Testers join the group first, opt in to the closed test second, then install using the same Google account. The page explains the 14-day commitment, Android 11+ requirement, private Play feedback, fictional test entries, and troubleshooting for internal testers. External steps open in new tabs; the site does not collect email addresses or claim to verify enrollment. Verify the three steps with an eligible Google account before sharing widely; automated website checks do not enroll a tester.

## AdMob app-ads.txt

`public/app-ads.txt` contains the public Google seller authorization for BarTally's AdMob publisher account. Vite includes it in `dist/app-ads.txt`. This is a public publisher ID, not an API key, app ID or ad-unit ID; no ad script is added to the website.

**The project URL alone is insufficient.** AdMob strips `/BarTallyWebsite/` from the developer website URL and requests **https://billcorps.github.io/app-ads.txt**. That root file is hosted separately by the free public user-site repository [billcorps.github.io](https://github.com/billcorps/billcorps.github.io), using Pages from `main` and `/ (root)`. Its homepage points visitors to the existing BarTally website. Deploying this project's workflow cannot update the user-site root.

Keep `public/app-ads.txt` and that repository's root `app-ads.txt` identical when the authorized publisher or ad sellers change. Keep `https://billcorps.github.io/BarTallyWebsite/` as the app's developer Website URL in Google Play; the privacy URL remains unchanged. A root-hosted custom domain could serve this project's `dist/app-ads.txt` directly.

After publication, open https://billcorps.github.io/app-ads.txt and verify that it returns plain text with the publisher snippet shown in AdMob. Then use **AdMob > Apps > View all apps > app-ads.txt > expand BarTally > Check for updates**. Google says verification can take up to 24 hours; the public file being reachable does not itself prove the account's verification is complete.

References: [Google's file and crawler setup](https://support.google.com/admob/answer/9363762?hl=en), [GitHub Pages user-site setup](https://docs.github.com/en/pages/quickstart).
