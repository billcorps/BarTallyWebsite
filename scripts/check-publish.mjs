import { settings } from "./settings.mjs";
import { verifyPublicPlayListing } from "./play-listing.mjs";

const config = settings();
if (!config.ready) {
  throw new Error(
    "Before publishing, configure a public developer identity and either VITE_SUPPORT_EMAIL or VITE_PLAY_STORE_URL. For the Play route, verify that the listing is live and App support offers a monitored private contact for privacy questions. Local preview builds remain available without a contact route.",
  );
}
if (config.playUrl) {
  await verifyPublicPlayListing(config.playUrl);
  console.log(
    "The public Google Play listing is reachable. Verify that App support offers a monitored private contact before release.",
  );
}
console.log("Public developer identity and contact are configured.");
