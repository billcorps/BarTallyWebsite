import { href, siteConfig } from "./config";
import "./beta.css";

export function BetaPage() {
  const steps = [
    {
      title: "Join the tester group",
      description:
        "Open BarTally Testers in Google Groups and choose Join group. If approval is required, wait until your membership is confirmed before moving to step 2.",
      action: "Join the Google Group",
      url: siteConfig.beta.groupUrl,
    },
    {
      title: "Opt into the closed test",
      description:
        "Return here after joining the group. Open the testing page and choose Become a tester with the same Google account. Joining the group alone does not enroll you in the test.",
      action: "Join the closed test",
      url: siteConfig.beta.testUrl,
    },
    {
      title: "Install BarTally",
      description:
        "Once you have opted in, open the listing on your Android phone and install BarTally through Google Play. Use that same account in the Play Store.",
      action: "Install BarTally",
      url: siteConfig.beta.installUrl,
    },
  ];

  return (
    <>
      <section className="beta-hero section-shell">
        <div>
          <span className="eyebrow">
            <span className="tiny-line" /> ANDROID CLOSED TEST
          </span>
          <h1>
            Help get <br />
            <em>BarTally ready.</em>
          </h1>
          <p>
            Track drinks, spending, and habits. Try the app before its public
            release and tell me what works, what is confusing, and what breaks.
          </p>
          <a className="button" href="#join">
            Start with step 1 <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link beta-app-link" href={href("/app/")}>
            See what BarTally does <span aria-hidden="true">→</span>
          </a>
        </div>
        <aside className="beta-commitment" aria-label="What the test involves">
          <span className="eyebrow">THE COMMITMENT</span>
          <div className="beta-duration">
            14 <span>days</span>
          </div>
          <p>
            Stay opted into the closed test for at least 14 consecutive days.
            Keep the app installed, stay in the group, and try the features
            throughout the test.
          </p>
          <div className="beta-requirements">
            <span>For adults with an Android 11 or newer phone</span>
            <span>Free to test · No purchase needed</span>
            <span>A Google account is needed to join</span>
          </div>
        </aside>
      </section>

      <section
        id="join"
        className="beta-enrollment section-shell"
        aria-labelledby="beta-join-heading"
      >
        <div className="beta-section-heading">
          <span className="eyebrow">GET ACCESS</span>
          <h2 id="beta-join-heading">Join in this order.</h2>
          <p>
            Use the same Google account for all three steps. Each link opens in
            a new tab so you can come back here.
          </p>
        </div>
        <ol className="beta-steps">
          {steps.map((step, index) => (
            <li key={step.action}>
              <span className="beta-step-number" aria-hidden="true">
                0{index + 1}
              </span>
              <div className="beta-step-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <a
                className={`button ${index ? "button-secondary" : ""}`}
                href={step.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {step.action} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="small-print beta-enrollment-note">
          Enrollment is handled by Google Groups and Google Play. This website
          does not collect your email or confirm whether you have joined.
        </p>
      </section>

      <section id="feedback" className="beta-feedback">
        <div className="section-shell beta-feedback-inner">
          <div>
            <span className="eyebrow">DURING THE TEST</span>
            <h2>
              Try your usual order.
              <br />
              <em>Send honest feedback.</em>
            </h2>
            <p>
              Search for drinks you know. Save a favorite with a serving, place,
              and a couple of prices. Add a past entry, check your totals, and
              try a home-screen widget. Fictional entries are fine; you do not
              need to drink alcohol or share your real history to test the app.
            </p>
          </div>
          <div className="beta-feedback-card">
            <h3>Found something that needs fixing?</h3>
            {siteConfig.supportEmail && (
              <p>
                Email{" "}
                <a href={`mailto:${siteConfig.supportEmail}`}>
                  {siteConfig.supportEmail}
                </a>{" "}
                for bug reports or private support. Include what happened and
                your app and Android versions. You do not need to send your real
                drink history or a backup file.
              </p>
            )}
            <p>
              Open BarTally in the Play Store and use the private feedback
              option for testers. Tell me what you tried, what you expected, and
              what happened. Include your phone model, Android version, and app
              version if you can.
            </p>
            <p>
              You can also post general questions in the tester group. Leave
              personal details and real drink history out of group posts and
              screenshots.
            </p>
            <span className="beta-signature">
              William Haggerty · BarTally developer
            </span>
          </div>
        </div>
      </section>

      <section
        className="beta-help section-shell"
        aria-labelledby="beta-help-heading"
      >
        <div className="beta-section-heading">
          <span className="eyebrow">GETTING STARTED</span>
          <h2 id="beta-help-heading">Having trouble joining?</h2>
        </div>
        <div className="beta-help-items">
          <details>
            <summary>Google Play says the app is not available</summary>
            <p>
              Check that you joined the group first, then opted into the closed
              test. Make sure your browser and Play Store are signed into the
              same Google account. A newly published test or access change can
              take a few hours to become available.
            </p>
          </details>
          <details>
            <summary>I am already an internal tester</summary>
            <p>
              Leave the internal test using its opt-in page, then join this
              closed test. Google treats the two test tracks separately; being
              an internal tester does not enroll you in the closed test.
            </p>
          </details>
          <details>
            <summary>
              Do I need to buy anything or leave a public review?
            </summary>
            <p>
              No. Every feature is free, and the optional ad-removal purchase is
              not needed for testing. Send honest private feedback through
              Google Play; a public rating or review is not part of this test.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
