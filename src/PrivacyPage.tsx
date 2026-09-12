type PrivacyPageProps = {
  developerName: string;
  supportEmail: string;
  playStoreUrl: string;
};

const sections = [
  ["privacy-data", "Your app data"],
  ["privacy-developer", "What the developer receives"],
  ["privacy-location", "Optional locations"],
  ["privacy-advertising", "Ads and your choices"],
  ["privacy-purchases", "Ad-removal purchases"],
  ["privacy-widgets", "Home-screen widgets"],
  ["privacy-backup", "Backup and transfer"],
  ["privacy-deletion", "Keeping and deleting data"],
  ["privacy-website", "This website"],
  ["privacy-audience", "Audience and estimates"],
  ["privacy-contact", "Updates and contact"],
] as const;

export function PrivacyPage({
  developerName,
  supportEmail,
  playStoreUrl,
}: PrivacyPageProps) {
  const name = developerName.trim();
  const email = supportEmail.trim();
  const listing = playStoreUrl.trim();
  const contactReady = Boolean(name && (email || listing));

  return (
    <div className="policy-page section-shell">
      <header className="page-intro">
        <p className="eyebrow">Your information, explained</p>
        <h1>Privacy policy.</h1>
        <p>
          Your drink journal is stored on your device. Maps, advertising,
          purchases, and website hosting involve other services. Here is what
          each part uses, and the choices you have.
        </p>
        <p className="policy-date">
          Last updated <time dateTime="2026-09-12">September 12, 2026</time>
          {name ? <> · {name}</> : null}
        </p>
        {!contactReady && (
          <p className="policy-note">
            Preview policy: a private contact route will be available before the
            app launches.
          </p>
        )}
      </header>

      <div className="policy-layout">
        <nav className="policy-toc" aria-label="Privacy policy contents">
          <p className="eyebrow">On this page</p>
          <ol>
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="policy-content">
          <section
            className="policy-section"
            id="privacy-data"
            aria-labelledby="privacy-data-title"
          >
            <h2 id="privacy-data-title">01. Your app data</h2>
            <p>
              BarTally keeps logged drinks, times, counts, serving sizes,
              nutrition values, optional prices and currencies, notes, custom
              drinks, favorites with named prices and a saved default, and
              optional locations in a private database on your device. Locations
              can include a name you enter, a selected map pin, a device
              position you request, and a saved place identifier. History may
              also contain location fields from older app versions.
            </p>
            <p>
              Preferences, including your choice of US fluid ounces or
              milliliters, are stored locally. Catalog search, spending totals,
              and habit calculations run on your device; none requires a
              BarTally account.
            </p>
            <p>
              Prices are amounts you enter for drinks. BarTally does not connect
              to financial accounts, import bank transactions, or collect
              payment-card details for spending tracking. A missing price is
              kept separate from a recorded zero price.
            </p>
            <p>
              Favorites can save a serving, a place, and multiple named prices.
              Each log keeps the selected details. Editing a favorite or
              updating the separate built-in catalog does not rewrite previous
              entries.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-developer"
            aria-labelledby="privacy-developer-title"
          >
            <h2 id="privacy-developer-title">
              02. What the developer receives
            </h2>
            <p>
              BarTally has no account registration or developer analytics
              backend. The app does not send your drink entries, notes, or named
              places to the developer or attach them to advertising requests.
              Recorded drink prices and currencies are also kept out of
              developer analytics and advertising requests. Google services can
              receive information as described in the sections below.
            </p>
            <p>
              If you contact the developer using the details in Google Play's
              App support section, the developer receives the information you
              include in that message.
            </p>
            <p>
              Public Google Play reviews can be read by the developer and other
              users, along with the public profile information Google displays.
              Keep drink history, locations, purchase details, and other private
              information out of public reviews.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-location"
            aria-labelledby="privacy-location-title"
          >
            <h2 id="privacy-location-title">03. Optional locations</h2>
            <p>
              Adding a place is optional. You can enter a place name without
              granting location permission. BarTally requests foreground
              location access when you choose <strong>Use my position</strong>;
              approximate access is supported. It does not track your location
              in the background.
            </p>
            <p>
              Your requested position helps center the map and sort your own
              saved places by distance. Nearby suggestions come from those saved
              places. You can attach a place when confirming a drink or editing
              history, or save it with a favorite. Quick logs from that favorite
              reuse the saved place without requesting a new device position.
            </p>
            <p>
              Google Maps supplies map content when you open an available map.
              Google receives service requests and technical information, which
              can include the area viewed and device or service diagnostics. Map
              use is covered by the{" "}
              <a href="https://maps.google.com/help/terms_maps/">
                Google Maps and Google Earth Additional Terms
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/privacy">
                Google’s Privacy Policy
              </a>
              .
            </p>
            <p>
              Revoke location access in Android Settings. To remove a location
              from history, edit its drink entry. To stop a favorite reusing a
              place, clear it in Edit favorite. Forgetting a saved place removes
              its shortcut but keeps locations attached to favorites and
              historical entries.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-advertising"
            aria-labelledby="privacy-advertising-title"
          >
            <h2 id="privacy-advertising-title">04. Ads and your choices</h2>
            <p>
              Google AdMob supplies in-app banner ads. Its SDK may collect and
              share IP addresses, device or advertising identifiers,
              interactions, and diagnostic information for advertising,
              measurement, and fraud prevention. An IP address can indicate
              approximate location. BarTally requests non-personalized ads;
              these still involve data processing. Read{" "}
              <a href="https://policies.google.com/privacy">
                Google’s Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/technologies/partner-sites">
                how Google uses information from apps
              </a>
              .
            </p>
            <p>
              Where required, Google’s consent form presents choices before ads
              are requested. Required privacy options remain available under{" "}
              <strong>More options → Ad privacy choices</strong>. The SDK may
              use a previously valid consent state if refreshing it fails. You
              can keep logging when ads or consent services are unavailable.
            </p>
            <p>
              An optional one-time purchase removes banner ads. All app features
              remain available without purchasing. BarTally checks locally
              stored purchase ownership before requesting ads. While verified
              ownership is active, it does not request ads or automatically
              display ad consent prompts. It may refresh Google’s privacy-choice
              status so previously required choices remain available when you
              select them.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-purchases"
            aria-labelledby="privacy-purchases-title"
          >
            <h2 id="privacy-purchases-title">05. Ad-removal purchases</h2>
            <p>
              Google Play processes payment using your Play account and payment
              settings. BarTally does not receive or store your card details. It
              asks Google Play for purchase ownership and stores a signed
              purchase receipt in private device storage excluded from backup.
              This lets previously verified ad removal work offline. A later
              ownership check can update that status, including after a refund.
            </p>
            <p>
              After reinstalling or changing devices, use the same Play account
              and choose{" "}
              <strong>More options → Remove ads → Restore purchase</strong>.
              Google’s payment records are governed by its policies and are not
              deleted when you clear BarTally’s storage.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-widgets"
            aria-labelledby="privacy-widgets-title"
          >
            <h2 id="privacy-widgets-title">06. Home-screen widgets</h2>
            <p>
              Widgets are optional and free. A widget displays its selected
              favorite and can display its serving, saved default price, saved
              place, logged count, and brief logging or undo status, depending
              on its size. Anyone who can view your home screen can see that
              information. Widget configuration and pending action state stay in
              private app storage and are excluded from app backup.
            </p>
            <p>
              Tapping <strong>+1</strong> records the selected favorite at the
              current time with its saved default price and place, when present.
              This does not request your current location or open the full app.
              A temporary price choice on Home does not change the widget
              default. You can edit the recorded details later in History.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-backup"
            aria-labelledby="privacy-backup-title"
          >
            <h2 id="privacy-backup-title">07. Backup and transfer</h2>
            <p>
              Android may back up or transfer BarTally’s database according to
              your device, operating system, and account settings. This can
              include drink history, recorded prices and currencies, custom
              drinks, favorites with named prices and saved places, and legacy
              location fields. The replaceable built-in catalog is excluded. The
              operating system and its backup provider handle these copies; the
              BarTally developer does not receive them.
            </p>
            <p>
              Manage backup preferences and retained backups through Android and
              your backup provider. App preferences, widget state, and the local
              ad-removal receipt are excluded from BarTally’s configured backup.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-deletion"
            aria-labelledby="privacy-deletion-title"
          >
            <h2 id="privacy-deletion-title">08. Keeping and deleting data</h2>
            <p>
              Local data remains until you delete it, clear app storage, or
              uninstall BarTally. Delete individual drink entries from History.
              To erase all local BarTally data, open BarTally’s app information
              in Android Settings and clear its storage.
            </p>
            <p>
              System backups may remain separately and may restore data on a
              later installation. Manage or delete those copies through Android
              or your backup provider. Clearing app storage does not erase
              records held separately by Google for ads, maps, or payments.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-website"
            aria-labelledby="privacy-website-title"
          >
            <h2 id="privacy-website-title">09. This website</h2>
            <p>
              This is a static website hosted on GitHub Pages. We do not add
              analytics scripts, advertising, sign-up forms, or account features
              to it. Images and fonts are served with the site. The website does
              not access your BarTally drink journal or request your location.
            </p>
            <p>
              GitHub receives requests needed to deliver these pages. GitHub’s{" "}
              <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection">
                Pages documentation
              </a>{" "}
              states that visitors’ IP addresses are logged and stored for
              security purposes, including when visitors are not signed in.
              Hosting data is handled under the{" "}
              <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
                GitHub Privacy Statement
              </a>
              .
            </p>
            <p>
              Links to Google Play and other external sites take you to services
              with their own privacy policies when you choose to follow them.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-audience"
            aria-labelledby="privacy-audience-title"
          >
            <h2 id="privacy-audience-title">10. Audience and estimates</h2>
            <p>
              BarTally is intended for adults tracking their own drinks.
              Nutrition and alcohol figures may be estimates; they are not
              measurements of the drink served to you.
            </p>
          </section>

          <section
            className="policy-section"
            id="privacy-contact"
            aria-labelledby="privacy-contact-title"
          >
            <h2 id="privacy-contact-title">11. Updates and contact</h2>
            <p>
              This policy will be updated if the app’s or website’s data
              practices change. The date above shows the most recent update.
            </p>
            {name && (
              <p>
                Developer: <strong>{name}</strong>
              </p>
            )}
            <p>
              Found a bug?{" "}
              {listing ? (
                <>
                  Open <a href={listing}>BarTally on Google Play</a> and leave a
                  review describing what happened. Include your app version and
                  Android version to help reproduce the problem.
                </>
              ) : (
                <>
                  Once BarTally launches, you can leave feedback in a review on
                  its Google Play listing. The link will be added here when the
                  listing is available.
                </>
              )}{" "}
              Reviews are public, so please leave out personal information.
            </p>
            {email ? (
              <p>
                For privacy questions or support, email{" "}
                <a href={`mailto:${email}`}>{email}</a>.
              </p>
            ) : listing ? (
              <p>
                For privacy questions or requests, open the{" "}
                <a href={listing}>BarTally listing</a> in the Google Play Store
                and select <strong>App support</strong> to find the developer's
                contact details. Please use that private contact route for
                personal information.
              </p>
            ) : (
              <p>
                A private contact route for privacy questions is not available
                yet. It will be listed under <strong>App support</strong> on
                Google Play before the app launches.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
