# Website verification

Verified locally September 14, 2026 against the current BarTally app and refreshed English US and international metric promotional sets. These checks cover the local production preview at `/BarTallyWebsite/`; this work did not deploy the site or upload a Play listing.

## Current content

The site now describes the 8,200+ drink catalog, optional nutrition with visible gaps, favorites with saved servings/places/named prices, and History’s **Add past drinks** flow for favorites, catalog drinks, and custom drinks. Creating a custom drink adds a searchable definition without logging it. Prices remain optional, unknown amounts are separate from zero, and currencies are not converted.

Metrics descriptions include Today, This week, This month, 7 days, 30 days, 90 days, and All time, with Sunday or Monday week starts and device-local calendar dates. Counter widgets include the three calendar periods and rolling 24-hour, 7-day, and 30-day periods. Quick-log copy now describes the five-second Undo. Compact examples of both widget types are explicitly labeled as illustrations. The privacy policy documents UTC timestamp storage, local display, calendar preferences, and offline named places.

## Checks

- `npm run format:check`: passed.
- `npm run build`: passed TypeScript, browser and server bundles, five prerendered HTML pages, and validation of 122 local links/assets, metadata, canonical paths, and section anchors.
- Six publishing-check tests passed: reachable BarTally listing, HTTP 404/429/503, unrelated successful response, and network failure. The request has a ten-second timeout. These tests run without network access as part of the build.
- `npm run test:e2e`: all 36 desktop Chromium and emulated Pixel 7 checks passed in 17.7 seconds with the final content and refreshed screenshot pixels. The last PNG encoding normalization preserved every decoded pixel; the production build and asset parity were checked again afterward.
- Browser coverage includes direct routes and refreshes, keyboard navigation, both regional galleries, spending examples and missing-price coverage, privacy anchors, reduced motion, and pages without JavaScript. All four content pages fit 320, 390, 768, 1024, and 1440 pixel viewports without horizontal scrolling.
- No serious or critical Axe findings, JavaScript/hydration errors, broken local images/fonts, or unsolicited third-party requests were reported. This is targeted automated coverage, not a full accessibility certification.
- All 16 website screenshots match the current Android regional originals byte for byte. They are 1080 × 2400, 24-bit RGB PNGs. Home, Search, favorite editor, and nutrition have distinct US/metric versions. History, calendar overview, places, and spending use the same frames in both sets because no serving-volume text is visible in those frames.
- `public/images/social-card.png` matches the current 1024 × 500 feature graphic with the **Know your totals.** badge. Promotional app images contain no ads.
- `git diff --check`: passed.

The actual app screenshots use fictional history and places. Home shows a saved pub filter, serving selector, selected Happy hour price, and quick logging. Search shows the current offline catalog and common beers. The favorite editor shows saved serving/place details and the introduction to named prices; price fields continue below that viewport. History exposes Add past drinks, while the metrics overview shows calendar choices and Sunday/Monday week starts.

## Visual review

All four website pages were recaptured at 1440px and 390px after loading their fonts and images. The refreshed desktop/mobile hero, metric favorite editor, compact widget examples, and calendar explanation were visually checked for readable content, coherent framing, and clipping. The focused section captures suppress the sticky site header and unfocused skip link so they do not cover the section being reviewed; full-page and hero captures retain the actual site navigation.

| Page or section | Desktop | Mobile |
| --- | --- | --- |
| Home | [Full page](home-desktop.png) | [Full page](home-mobile.png) |
| App overview | [Full page](app-desktop.png) | [Full page](app-mobile.png) |
| Insights | [Full page](insights-desktop.png) | [Full page](insights-mobile.png) |
| Privacy | [Full page](privacy-desktop.png) | [Full page](privacy-mobile.png) |
| Named prices | [Section](favorite-prices-desktop.png) | [Section](favorite-prices-mobile.png) |
| Metric favorite editor | [Gallery](favorite-editor-metric-desktop.png) | [Gallery](favorite-editor-metric-mobile.png) |
| Widgets | [Section](widgets-desktop.png) | [Section](widgets-mobile.png) |
| Calendar periods | [Section](calendar-periods-desktop.png) | [Section](calendar-periods-mobile.png) |

The [desktop hero](home-hero.png) and [mobile hero](mobile-hero.png) show the initial viewport. Review captures are not included in the published site. Chromium uses device emulation; physical phones, Safari, and Firefox were not tested.

## Publication and reproduction

Local builds use William Haggerty as the developer, without a direct support email or configured live listing. They therefore show the upcoming-release state and draft metadata. No repository Actions variables were changed, and no commit, push, website deployment, or Play Console upload was performed.

The public website and privacy page respond successfully. The public Play listing currently responds **HTTP 404**, so the existing live policy’s Play App support link cannot provide a public private-contact route yet. Running `npm run check:publish` with that Play URL correctly fails with the specific HTTP 404 reason. A configured URL alone no longer passes the publication check. Local builds remain available. Before publication, make the production listing and its private App support contact available, or configure a direct support email and remove the unavailable Play URL. No support email was invented.

```powershell
npm run format:check
npm run build
npm run test:e2e
npm run preview
```

Open `http://127.0.0.1:4173/BarTallyWebsite/`. The test runner can start its own preview server. For a clean checkout, install dependencies and Playwright Chromium as described in the [website README](../README.md).
