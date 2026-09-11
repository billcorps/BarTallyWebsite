# Website verification

Verified locally on September 11, 2026 after moving the website into the standalone public BarTallyWebsite repository. The website source, images, tests, and Pages workflow are independent of the Android checkout. The checks below were performed locally before the move was committed or pushed; they do not verify a hosted deployment.

## Checks

- Production build: TypeScript and prerendering passed. Five HTML documents are generated: home, app, insights, privacy, and 404.
- Build smoke checks: 121 local links and assets passed for the default draft configuration; 113 passed with the migrated Play Store URL, including page metadata, canonical URLs, section anchors, and bundled fonts.
- Playwright: 36 checks passed in 20.9 seconds at `/BarTallyWebsite/` with the migrated Play Store URL across desktop Chromium and an emulated Pixel 7 viewport. These cover page loading and refresh, `index.html` aliases, screenshot loading, navigation, keyboard controls, unit switches, the actual spending screen in both regional sets, period-based drink/spending examples and price coverage, FAQ expansion, and privacy contents links.
- Responsive checks: all four content pages fit 320, 390, 768, 1024, and 1440 pixel widths without horizontal scrolling.
- Accessibility: no serious or critical Axe findings on any content page at either browser profile. Keyboard focus, Escape behavior, the skip link, reduced motion, and readable navigation/content with JavaScript disabled were checked separately. This is an automated check and targeted review, not a full accessibility certification.
- Browser checks reported no JavaScript/hydration errors or unsolicited third-party network requests. Fonts, scripts, and images are served with the site.
- Prettier formatting passed. The root `.gitattributes` keeps text files at LF across Windows and Linux.
- `npm run check:publish` passed using the existing public `VITE_PLAY_STORE_URL` copied from BarTally into BarTallyWebsite. The new build metadata and canonical links point to `https://billcorps.github.io/BarTallyWebsite/`. This validates the configured URL format, not availability of the external Play listing or its support contact.
- All 16 regional screenshot files match the website copies byte for byte; all 8 default store screenshots match the US originals. Each set contains a 720 × 1600 home image and seven 1080 × 2400 images. The eighth image is now `08-spending.png`.

The browser tests use Chromium with device emulation; they do not claim coverage of physical phones, Safari, or Firefox. GitHub's hosted deployment still needs a check after publication.

## Visual review

Full-page captures include all lazy-loaded app images. Desktop captures use 1440 pixels; mobile captures use 390 pixels. All four pages were visually reviewed at both sizes after the app screenshot refresh. The captures were refreshed again from the standalone repository after extraction, with the configured Play Store links. The desktop and mobile home captures were reviewed again; all capture runs confirmed images loaded and pages fit their viewports. The direct headlines, updated app gallery, interactive spending summary, receipt-style cost breakdown, and privacy text remain readable without overlapping content. The shared feature graphic and website social card were also regenerated from the editable SVG and visually checked.

| Page           | Desktop                           | Mobile                           |
| -------------- | --------------------------------- | -------------------------------- |
| Home           | [Full page](home-desktop.png)     | [Full page](home-mobile.png)     |
| App overview   | [Full page](app-desktop.png)      | [Full page](app-mobile.png)      |
| Insights       | [Full page](insights-desktop.png) | [Full page](insights-mobile.png) |
| Privacy policy | [Full page](privacy-desktop.png)  | [Full page](privacy-mobile.png)  |

The [desktop hero](home-hero.png) and [mobile hero](mobile-hero.png) show the initial viewport. These images document the local preview; they are not included in the published website.

## Reproduce

From the root of the `BarTallyWebsite` repository:

```powershell
npm ci
npm run format:check
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

Open `http://127.0.0.1:4173/BarTallyWebsite/` for the default configuration. The test runner starts a preview server automatically when one is not already running.

## Publication inputs

The public developer name is William Haggerty. No direct website email is configured. The existing `VITE_PLAY_STORE_URL` repository variable was copied from **BarTally** to **BarTallyWebsite**, so Actions builds use the same Play listing/contact route. The local default remains a draft unless the variable is supplied in the environment or an ignored `.env.local` file. For this verification, the migrated public value was supplied to the build and publish check. The website directs general feedback to Google Play reviews and private privacy questions to the listing's App support; verify the actual listing and contact before publishing. No live Play service check was performed by this migration.

Google Play itself still requires a valid support email before app publication. Verify the private contact under App support before relying on the listing as the website's privacy contact route. [Google Play support requirements](https://support.google.com/googleplay/android-developer/answer/113477?hl=en-EN).

See [website setup](../README.md) for repository variables and the GitHub Pages workflow.
