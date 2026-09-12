# Website verification

Verified locally September 12, 2026 after refreshing catalog, favorite-price, place-filter, and widget copy. The latest update makes the saved-price example generic: Game day. These checks cover the local production preview at `/BarTallyWebsite/`, not a hosted deployment.

## Checks

- `npm run build`: TypeScript, client bundle, and five prerendered HTML pages passed. Build smoke checks validated 122 local links/assets, metadata, canonical paths, and section anchors.
- `npm run format:check`: passed.
- Earlier full verification: `npm run test:e2e` passed all 36 desktop Chromium and emulated Pixel 7 checks in 17.2 seconds before the generic-label update.
- After the generic-label update, build and formatting checks passed again. `npm run test:e2e -- --grep "app preview|FAQ opens"` passed all four desktop/mobile checks in 6.6 seconds, covering both regional screenshot sets and FAQ interaction.
- The browser suite covers direct loads and refreshes, keyboard navigation, both regional galleries (including Save your order), spending examples, privacy links, reduced motion, and content without JavaScript. All four content pages fit 320, 390, 768, 1024, and 1440 pixel widths without horizontal scrolling.
- No serious or critical Axe findings, JavaScript/hydration errors, broken local images/fonts, or unsolicited third-party requests were reported by the suite. This is targeted automated coverage, not a full accessibility certification.
- All 16 regional screenshot files match the Android repository's regional originals byte for byte. All eight default Play screenshots match the US originals. Each regional set now has three 720 x 1600 captures (Home, Search, favorite editor) and five 1080 x 2400 captures (History and insights).
- Both repositories passed `git diff --check`. The Android About/privacy wording was also updated and `:app:compileDebugKotlin` passed.

The six newly captured Android screens show actual UI without ads. Home demonstrates manual Regular / Happy hour / Game day selection at the fictional The Corner Bar; Search shows craft beer results with unknown calories identified; the favorite editor shows the serving, saved place, and introduction to named prices. Price fields continue below that editor viewport. The other ten regional images retain the previously reviewed History and insights screens.

## Visual review

All four website pages were captured at 1440px and 390px after loading their fonts and images. Home and App were recaptured after the generic-label update, including both hero views, named-price examples, and metric favorite-editor galleries. The Game day label was visually checked in the desktop/mobile price examples, mobile metric editor, and desktop hero. Text, amounts, and controls are readable, including the complete mobile example-price note. Insights and Privacy retain their earlier reviewed captures. Examples are explicitly fictional; no automatic discount, game schedule, or complete nutrition coverage is advertised.

| Page | Desktop | Mobile |
| --- | --- | --- |
| Home | [Full page](home-desktop.png) | [Full page](home-mobile.png) |
| App overview | [Full page](app-desktop.png) | [Full page](app-mobile.png) |
| Insights | [Full page](insights-desktop.png) | [Full page](insights-mobile.png) |
| Privacy | [Full page](privacy-desktop.png) | [Full page](privacy-mobile.png) |
| Named prices | [Section](favorite-prices-desktop.png) | [Section](favorite-prices-mobile.png) |
| Metric favorite editor | [Gallery](favorite-editor-metric-desktop.png) | [Gallery](favorite-editor-metric-mobile.png) |

The [desktop hero](home-hero.png) and [mobile hero](mobile-hero.png) show the initial viewport. Review captures are not included in the published site. Chromium uses device emulation; physical phones, Safari, and Firefox were not tested.

## Publication and reproduction

This verification used the local draft configuration: William Haggerty is the developer; no direct support email or live Play listing URL was supplied to the local build. The site therefore retains its upcoming-release messaging and draft metadata. No publish, commit, push, or Play Console upload was performed. Existing repository Actions variables were not changed.

The September 11 repository move previously validated the publish configuration using the migrated public Play URL. That does not verify the current external listing or its private App support contact. Check the deployed privacy page and contact route before release; the publishing gate and configuration requirements are unchanged. See [website setup](../README.md).

To reproduce the current checks:

```powershell
npm run format:check
npm run build
npm run test:e2e
npm run preview
```

Open `http://127.0.0.1:4173/BarTallyWebsite/`. The test runner can start its own preview server. For a clean checkout, install dependencies and the Playwright Chromium browser as described in the README first.
