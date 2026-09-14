import { settings } from "./settings.mjs";
import { verifyPublicPlayListing } from "./play-listing.mjs";

const config = settings();
if (!config.ready) {
  console.log(
    "Publishing the coming-soon website with a preview privacy policy and noindex metadata. A public contact route is not configured yet.",
  );
}
if (config.playUrl) {
  await verifyPublicPlayListing(config.playUrl);
  console.log(
    "The public Google Play listing is reachable. Verify that App support offers a monitored private contact before release.",
  );
}
if (config.ready) {
  console.log("Public developer identity and contact are configured.");
}
