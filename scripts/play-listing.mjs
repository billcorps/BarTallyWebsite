export async function verifyPublicPlayListing(playUrl, request = fetch) {
  let response;
  let html;
  try {
    response = await request(playUrl, {
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "text/html" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    html = await response.text();
  } catch (error) {
    throw new Error(
      `The configured public Google Play listing could not be verified (${error.message}). Confirm it is publicly available before publishing; local builds remain available.`,
      { cause: error },
    );
  }
  if (
    !/<title[^>]*>[^<]*BarTally/i.test(html) ||
    !html.includes("com.billcorp.bartally")
  ) {
    throw new Error(
      "The Play URL responded but did not identify the public BarTally app listing. Check that the production listing is live before publishing.",
    );
  }
}
