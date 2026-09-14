import assert from "node:assert/strict";
import test from "node:test";
import { verifyPublicPlayListing } from "./play-listing.mjs";

const url =
  "https://play.google.com/store/apps/details?id=com.billcorp.bartally";

test("publishing accepts a reachable BarTally listing and bounds the request", async () => {
  await verifyPublicPlayListing(url, async (requested, options) => {
    assert.equal(requested, url);
    assert(options.signal instanceof AbortSignal);
    return new Response(
      "<title>BarTally - Apps on Google Play</title>com.billcorp.bartally",
    );
  });
});

for (const status of [404, 429, 503]) {
  test(`publishing rejects HTTP ${status}`, async () => {
    await assert.rejects(
      verifyPublicPlayListing(
        url,
        async () => new Response("Unavailable", { status }),
      ),
      new RegExp(`HTTP ${status}`),
    );
  });
}

test("publishing rejects an unrelated successful response", async () => {
  await assert.rejects(
    verifyPublicPlayListing(
      url,
      async () => new Response("<title>Google Play</title>"),
    ),
    /did not identify/,
  );
});

test("publishing explains network failures without making local builds depend on them", async () => {
  await assert.rejects(
    verifyPublicPlayListing(url, async () => {
      throw new Error("request timed out");
    }),
    /request timed out.*local builds remain available/,
  );
});
