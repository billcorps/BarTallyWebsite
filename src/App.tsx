import { useEffect, useRef, useState, type ReactNode } from "react";
import { asset, href, siteConfig } from "./config";
import { PrivacyPage } from "./PrivacyPage";
import { BetaPage } from "./BetaPage";
import type { PageId } from "./routes";

type IconName =
  | "arrow"
  | "diagonal"
  | "plus"
  | "check"
  | "menu"
  | "close"
  | "glass"
  | "chart"
  | "pin"
  | "shield"
  | "grid"
  | "offline"
  | "android"
  | "book"
  | "clock"
  | "wallet";
function Icon({
  name,
  size = 22,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    diagonal: <path d="M6 18 18 6M6 6h12v12" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 17h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    glass: (
      <>
        <path d="m7 3-1 6a6 6 0 0 0 12 0l-1-6ZM12 15v6M8 21h8M6.5 8h11" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M8 15v-4m5 4V7m5 8v-5" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 8 3v6c0 6-8 11-8 11S4 17 4 11V5Z" />
        <path d="m8 11 3 3 5-6" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <path d="M17.5 14v7M14 17.5h7" />
      </>
    ),
    offline: (
      <>
        <path d="m3 3 18 18M8.5 8.5a11 11 0 0 1 11 2M4 11a11 11 0 0 1 2-1.5M8 15a6 6 0 0 1 7-1M12 19h.01M9 4a17 17 0 0 1 13 3M2 7l3-1.5" />
      </>
    ),
    android: (
      <>
        <path d="M5 17V11a7 7 0 0 1 14 0v6ZM7 5 5 2m12 3 2-3M8 17v4m8-4v4M2 11v6m20-6v6" />
        <path d="M9 9h.01M15 9h.01" />
      </>
    ),
    book: (
      <>
        <path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1Zm0 0v15" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 8V5H6a3 3 0 0 0 0 6h15v9H6a3 3 0 0 1-3-3V8m18 6h-5v3h5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href={href("/")}
      aria-label="BarTally home"
    >
      <img
        className="brand-icon"
        src={asset("app-icon.png")}
        width="40"
        height="40"
        alt=""
        aria-hidden="true"
      />
      <span>
        BarTally<span className="brand-dot">.</span>
      </span>
    </a>
  );
}

function Header({ page }: { page: PageId }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
        <nav
          id="site-navigation"
          className={`site-nav ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {(
            [
              ["app", "The app"],
              ["insights", "The insights"],
              ["privacy", "Your privacy"],
            ] as const
          ).map(([id, label]) => (
            <a
              key={id}
              href={href(`/${id}/`)}
              aria-current={page === id ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-cta"
            href={siteConfig.playStoreUrl || href("/beta/")}
            aria-current={
              page === "beta" && !siteConfig.playStoreUrl ? "page" : undefined
            }
          >
            {siteConfig.playStoreUrl ? "Get BarTally" : "Join the beta"}
            <Icon name="diagonal" size={17} />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main section-shell">
        <div>
          <Brand footer />
          <p>
            Track your drinks.
            <br />
            Track your spending.
          </p>
        </div>
        <div className="footer-links">
          <span className="eyebrow">EXPLORE BARTALLY</span>
          <a href={href("/app/")}>Meet the app</a>
          <a href={href("/insights/")}>Explore the insights</a>
          <a href={href("/beta/")}>Join the beta</a>
          <a href={href("/privacy/")}>Privacy policy</a>
        </div>
        <div className="footer-note">
          <span className="eyebrow">EVERY FEATURE INCLUDED</span>
          <p>
            All features free.
            <br />
            No subscription.
            <br />
            Optional one-time ad removal.
          </p>
          {siteConfig.supportEmail && (
            <a className="text-link" href={`mailto:${siteConfig.supportEmail}`}>
              Get in touch <Icon name="diagonal" size={16} />
            </a>
          )}
          <a
            className="text-link"
            href={
              siteConfig.supportEmail || siteConfig.playStoreUrl
                ? href("/privacy/#privacy-contact")
                : href("/beta/#feedback")
            }
          >
            Report a bug
          </a>
        </div>
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 {siteConfig.developerName || "BarTally"}</span>
        <span>Drink and spending tracking for adults.</span>
        <a href={href("/privacy/#privacy-website")}>About this website</a>
      </div>
    </footer>
  );
}

function ButtonLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <a href={to} className={`button ${secondary ? "button-secondary" : ""}`}>
      {children}
      <Icon name="arrow" size={20} />
    </a>
  );
}

function Availability({ light = false }: { light?: boolean }) {
  return siteConfig.playStoreUrl ? (
    <a
      className={`availability ${light ? "availability-light" : ""}`}
      href={siteConfig.playStoreUrl}
    >
      <Icon name="android" size={18} /> View on Google Play{" "}
      <Icon name="diagonal" size={15} />
    </a>
  ) : (
    <span className={`availability ${light ? "availability-light" : ""}`}>
      <span className="status-dot" /> Android beta · Android 11+
    </span>
  );
}

function Phone({
  image,
  alt,
  className = "",
  eager = false,
}: {
  image: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`phone ${className}`}>
      <img
        src={asset(image)}
        alt={alt}
        width={1080}
        height={2400}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </div>
  );
}

function SectionHeading({
  number,
  eyebrow,
  children,
  text,
}: {
  number: string;
  eyebrow: string;
  children: ReactNode;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          <span className="section-number">{number}</span>
          {eyebrow}
        </span>
        <h2>{children}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}

function ClosingNote() {
  return (
    <section className="closing-section">
      <div className="section-shell closing-inner">
        <div>
          <span className="eyebrow">DRINKS. CALORIES. SPENDING.</span>
          <h2>
            Know your
            <br />
            <em>totals.</em>
          </h2>
          <p>Cutting back or keeping track. Start with the numbers.</p>
        </div>
        <div className="closing-actions">
          <ButtonLink to={siteConfig.playStoreUrl || href("/beta/")}>
            {siteConfig.playStoreUrl ? "Get BarTally" : "Join the beta"}
          </ButtonLink>
          <Availability />
          <span className="small-print">
            All features free. No subscription. Optional ad removal.
          </span>
        </div>
        <svg className="closing-lines" viewBox="0 0 280 260" aria-hidden="true">
          <path d="M35 35v190M100 35v190M165 35v190M230 35v190M10 215 265 60" />
        </svg>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="home-hero section-shell">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="tiny-line" /> DRINK & SPENDING TRACKER
          </span>
          <h1>
            Your drinks.
            <br />
            Your tab.
            <br />
            <em>Tracked.</em>
          </h1>
          <p>
            See how much you drink, what you spend, and when it adds up. Whether
            you’re cutting back or just keeping track, BarTally puts the numbers
            in one place.
          </p>
          <div className="hero-actions">
            <ButtonLink to={siteConfig.playStoreUrl || href("/beta/")}>
              {siteConfig.playStoreUrl ? "Get BarTally" : "Join the beta"}
            </ButtonLink>
            <Availability />
          </div>
          <a href="#overview" className="scroll-cue">
            <span>↓</span> See what BarTally tracks
          </a>
        </div>
        <div className="hero-stage">
          <div className="hero-orbit" aria-hidden="true" />
          <span className="stage-caption">YOUR TOTALS. YOUR DATA.</span>
          <Phone
            image="us/05-metrics.png"
            alt="BarTally metrics showing calendar period choices, a Sunday or Monday week start, drink totals, and recorded spending."
            className="hero-phone-back"
          />
          <Phone
            image="us/01-home.png"
            alt="BarTally favorites filtered by pub, with US fluid-ounce servings, named prices, and quick logging."
            className="hero-phone-front"
            eager
          />
          <div className="hero-sticker">
            <Icon name="check" size={17} />
            <span>
              Drinks & spending.
              <br />
              <strong>All features free.</strong>
            </span>
          </div>
          <span className="demo-caption">
            Actual app screens · illustrative history
          </span>
        </div>
      </section>
      <div className="qualities-bar">
        <div className="section-shell">
          <span>
            <Icon name="book" /> No account needed
          </span>
          <span>
            <Icon name="offline" /> Offline logging & insights
          </span>
          <span>
            <Icon name="grid" /> Every feature free
          </span>
          <span>
            <Icon name="android" /> Made for Android
          </span>
        </div>
      </div>
      <section id="overview" className="overview-section section-shell">
        <SectionHeading
          number="01"
          eyebrow="LOG IT. CHECK YOUR TOTALS."
          text="Track drinks, calories, alcohol, and spending without an account or subscription."
        >
          What you drink.
          <br />
          <em>What it costs.</em>
        </SectionHeading>
        <div className="feature-row">
          {[
            {
              icon: "glass" as const,
              number: "01",
              title: "Log a drink in seconds.",
              text: "Save your usual serving, place, and prices. Log one or several drinks now or earlier, or use +1 now for a quick entry.",
              link: "/app/#favorites",
              label: "See drink logging",
            },
            {
              icon: "chart" as const,
              number: "02",
              title: "See your drinking habits.",
              text: "Check daily totals, compare time periods, and find the days and drinks that add up.",
              link: "/insights/",
              label: "Explore the metrics",
            },
            {
              icon: "wallet" as const,
              number: "03",
              title: "Track your spending.",
              text: "Add a price when you know it. See recorded spending, average cost, and where the money goes.",
              link: "/insights/#spending",
              label: "See spending insights",
            },
          ].map((item) => (
            <article className="feature" key={item.number}>
              <div className="feature-top">
                <span className="feature-icon">
                  <Icon name={item.icon} size={28} />
                </span>
                <span>{item.number}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a className="text-link" href={href(item.link)}>
                {item.label}
                <Icon name="arrow" size={18} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="perspective-section">
        <div className="section-shell perspective-inner">
          <div className="perspective-visual">
            <div className="orbit-line" aria-hidden="true" />
            <Phone
              image="us/06-nutrition.png"
              alt="Nutrition insights show calorie coverage, with missing and estimated nutrition identified."
            />
            <span className="image-note">MISSING VALUES STAY VISIBLE.</span>
          </div>
          <div className="perspective-copy">
            <span className="eyebrow">02 / KNOW WHAT’S INCLUDED</span>
            <h2>
              Real entries.
              <br />
              <em>Clear totals.</em>
            </h2>
            <p>
              Record the size of your drink and its price. BarTally totals what
              you’ve logged and shows what’s missing. Unknown calories or costs
              don’t become zero, and different currencies stay separate.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" /> Published values and estimates, clearly
                labeled
              </li>
              <li>
                <Icon name="check" /> Missing details counted separately
              </li>
              <li>
                <Icon name="check" /> Spending totals for each currency
              </li>
            </ul>
            <ButtonLink to={href("/insights/")} secondary>
              See the metrics
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="principles-section section-shell">
        <span className="eyebrow">LOCAL DATA. FREE FEATURES.</span>
        <h2>
          Log locally.
          <br />
          <em>Keep a backup.</em>
        </h2>
        <div className="principles-grid">
          <div>
            <Icon name="shield" size={28} />
            <h3>No account. Your device.</h3>
            <p>
              Logging and insights run on your device. Export a backup when you
              want a separate copy. Google services for ads and purchases have
              their own data practices.
            </p>
            <a href={href("/privacy/")} className="text-link">
              Read the privacy policy
              <Icon name="arrow" size={18} />
            </a>
          </div>
          <div>
            <Icon name="grid" size={28} />
            <h3>All the features. Always free.</h3>
            <p>
              Logging, spending, insights, places, and widgets are included. A
              one-time purchase removes banner ads. There’s no subscription.
            </p>
            <a href={href("/app/#questions")} className="text-link">
              Read common questions
              <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
      </section>
      <ClosingNote />
    </>
  );
}

const appViews = [
  {
    id: "favorites",
    label: "Your favorites",
    image: "01-home.png",
    title: "Your regular drink. The right price.",
    text: "Filter favorites by saved place and choose a serving and price. Tap Log drink to set the quantity and time, or +1 now for an immediate entry. Each log starts with the favorite’s saved place.",
    alt: "Favorites filtered by place with serving and price selectors, Log drink, and +1 now actions.",
  },
  {
    id: "search",
    label: "Find a drink",
    image: "02-search.png",
    title: "Find a drink or add your own.",
    text: "Search 8,200+ drinks, including craft beer, hard seltzers, canned cocktails, and common styles and recipes. Find High Noon, Two Robbers, Suntory -196, Surfside, and Stateside. ABV and calories are shown where known; missing values stay marked.",
    alt: "Offline drink catalog with common beers and available serving and nutrition details.",
  },
  {
    id: "serving",
    label: "Log several drinks",
    image: "03-serving.png",
    title: "Choose the pour, quantity, and time.",
    text: "In Search or Favorites, tap Log drink and choose how many. Keep Now or choose an earlier date and time. Add an optional price and place for this entry; nutrition and price remain per drink.",
    alt: "Search logging dialog with three drinks, Now and custom date/time options, serving controls, and a Log 3 drinks button.",
  },
  {
    id: "spending",
    label: "Track spending",
    image: "08-spending.png",
    title: "See where the money goes.",
    text: "Check recorded spending, average price, trends, and costs by drink or place. Missing prices and different currencies stay separate.",
    alt: "Spending insights with recorded costs, average prices, trends, and price coverage.",
  },
  {
    id: "history",
    label: "Drink history",
    image: "04-history.png",
    title: "Add or edit past drinks.",
    text: "Add past drinks from favorites or search the catalog, including your custom drinks. Set the quantity, serving, date, time, price, and place. Times use your phone’s local time zone and 12- or 24-hour clock setting.",
    alt: "Drink history with drink counts, recorded prices, nutrition values, and local timestamps.",
  },
] as const;

function UnitSwitch({
  metric,
  onChange,
}: {
  metric: boolean;
  onChange: (metric: boolean) => void;
}) {
  return (
    <div
      className="unit-switch"
      role="group"
      aria-label="Screenshot measurement units"
    >
      <button onClick={() => onChange(false)} aria-pressed={!metric}>
        US fl oz
      </button>
      <button onClick={() => onChange(true)} aria-pressed={metric}>
        Milliliters
      </button>
    </div>
  );
}

function AppPreview() {
  const [active, setActive] = useState(0);
  const [metric, setMetric] = useState(false);
  const view = appViews[active];
  return (
    <section id="preview" className="app-preview-section section-shell">
      <div className="preview-copy">
        <span className="eyebrow">A LOOK INSIDE</span>
        <h2>
          Find it. Log it.
          <br />
          <em>Check your totals.</em>
        </h2>
        <p>
          Real app screens with example entries. Select a screen to see how it
          works.
        </p>
        <div
          className="preview-tabs"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Explore app screens"
        >
          {appViews.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={active === index}
              aria-controls="app-preview-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                const next =
                  event.key === "ArrowDown" || event.key === "ArrowRight"
                    ? (index + 1) % appViews.length
                    : event.key === "ArrowUp" || event.key === "ArrowLeft"
                      ? (index + appViews.length - 1) % appViews.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? appViews.length - 1
                          : null;
                if (next !== null) {
                  event.preventDefault();
                  setActive(next);
                  document.getElementById(`tab-${appViews[next].id}`)?.focus();
                }
              }}
            >
              <span className="tab-number">0{index + 1}</span>
              <span>{item.label}</span>
              <Icon name="arrow" size={20} />
            </button>
          ))}
        </div>
        <UnitSwitch metric={metric} onChange={setMetric} />
        <p className="small-print">
          The app starts with US fluid ounces. Switch to milliliters anytime in
          More options → Units. Alcohol totals can use grams, milliliters of
          pure alcohol, or US standard drinks.
        </p>
      </div>
      <div
        className="preview-panel"
        role="tabpanel"
        id="app-preview-panel"
        aria-labelledby={`tab-${view.id}`}
      >
        <div className="preview-phone-stage">
          <div className="preview-disc" aria-hidden="true" />
          <Phone
            image={`${metric ? "metric" : "us"}/${view.image}`}
            alt={view.alt}
            eager
          />
        </div>
        <div className="preview-description" aria-live="polite">
          <h3>{view.title}</h3>
          <p>{view.text}</p>
        </div>
      </div>
    </section>
  );
}

const questions = [
  [
    "Is BarTally free?",
    "Yes. Every feature is free: logging, spending, insights, saved places, serving preferences, and home-screen widgets. An optional one-time purchase removes banner ads. There is no subscription.",
  ],
  [
    "Does it work without an internet connection?",
    "Logging, the drink catalog, saved places, and insights work offline. Ads and Google Play purchase checks use internet services.",
  ],
  [
    "Can I use milliliters instead of ounces?",
    "Yes. US fluid ounces are the default. Open More options → Units to choose milliliters. The preference applies across the app and widgets without changing recorded amounts or nutrition.",
  ],
  [
    "How does spending tracking work?",
    "Enter the price per drink when you log it, or add it later in History. The price is multiplied by the entry’s drink count. Leave it blank if you don’t know, or enter 0 for a free drink. USD is the default; you can choose another currency. Totals and averages stay separate for each currency, with no exchange-rate conversion. BarTally does not connect to bank accounts or estimate missing prices.",
  ],
  [
    "What if my drink is not in the catalog?",
    "Choose Add custom drink on Search. Enter a serving, ABV, and calories when you know them, or leave those details unknown. Saving makes the drink searchable; choose Log drink to record it, or use Add to favorites separately. The built-in catalog is separate from your custom drinks, favorites, and history. App updates can add or correct catalog entries without rewriting what you previously logged.",
  ],
  [
    "Can I save different prices for the same drink?",
    "Yes. Add any named prices to a favorite: Regular, Happy hour, Game day, or your own labels. Enter the final amount for each option, then select the one that applies on Home. That choice is reused for repeat +1 now taps. Prices do not switch automatically with times or game schedules, and discounts do not stack automatically. A widget uses the favorite's saved serving, default price, and place.",
  ],
  [
    "Can I keep different favorites for different pubs?",
    "Yes. Name a place when saving or editing a favorite, then reuse it for other drinks. Save the same beer at different places with their own servings and prices, and filter Home to a saved place. You can also choose a different serving on Home, such as 12 or 16 US fl oz, without editing the favorite. Saving or editing a favorite does not log a drink or change past entries.",
  ],
  [
    "Can I log drinks from last night?",
    "Yes. In Search or Favorites, tap Log drink, set the number of drinks, and choose an earlier date and time instead of Now. History also offers Add past drinks, with favorites first and catalog or custom drinks available through search. For example, record four of the same draft from last night in one entry. Times use your phone’s local time zone and 12- or 24-hour clock setting.",
  ],
  [
    "Can I log several of the same drink at once?",
    "Yes. Tap Log drink in Search or Favorites, then use the plus and minus controls or type a quantity. Keep Now or choose an earlier date and time. The log button shows how many drinks will be added. Calories, alcohol, and spending use that quantity. Favorites also offers +1 now for immediate logging, and History supports quantities for past visits.",
  ],
  [
    "Can I back up my history or move it to another phone?",
    "Yes. Open More options → Backup & restore to export a JSON backup using Android’s file picker. It includes history, custom drinks, favorites with their prices and places, and your saved places. Choose a backup to preview what will be restored, then select Restore backup. Missing records are added and existing records are kept when IDs match, except that untouched starter favorites can be restored from the backup. Restoring the same file again does not duplicate records. Settings, widgets, the built-in catalog, and ad-removal receipts are not included. Keep the file somewhere private: it contains readable personal data and is not encrypted by BarTally.",
  ],
  [
    "How do I change a widget?",
    "Long-press the widget and choose the launcher’s edit or reconfigure option where supported. Otherwise, remove it and add it again to choose its settings. Edit a favorite in BarTally to change the serving, default price, or place used by its quick-log widgets.",
  ],
  [
    "Can my totals follow the calendar week?",
    "Yes. Metrics offers Today, This week, and This month alongside 7 days, 30 days, 90 days, and All time. Choose Sunday or Monday for the start of the week. Counter widgets also offer calendar periods, plus rolling Last 24 hours, Last 7 days, and Last 30 days. Each counter has its own period and week-start choice. Calendar totals use your device’s local time zone.",
  ],
  [
    "Do I have to share my location?",
    "No. BarTally does not request location permission or use GPS. Places are optional names you enter when saving or editing a favorite and reuse from your own saved list. They work offline.",
  ],
  [
    "Are the calorie and alcohol values exact?",
    "Published values are distinguished from generic estimates and recipe assumptions. Your actual drink may differ by product, recipe, and pour. Alcohol totals default to grams of pure alcohol. In Units, choose grams, milliliters of pure alcohol, or US standard drinks (14 grams each). These are not blood alcohol or driving-safety calculations.",
  ],
];

function AppPage() {
  return (
    <>
      <section className="page-intro section-shell">
        <span className="eyebrow">DRINKS, COSTS, AND HABITS IN ONE APP</span>
        <h1>
          Log what you drink.
          <br />
          <em>See what it costs.</em>
        </h1>
        <p>
          Record a drink, choose the serving, and add the price if you know it.
          <br className="desktop-break" /> Check your history and totals
          whenever you need them.
        </p>
        <Availability />
      </section>
      <AppPreview />
      <section id="logging" className="logging-section section-shell">
        <SectionHeading number="01" eyebrow="QUICK TO LOG. EASY TO UPDATE.">
          Three steps.
          <br />
          <em>One saved entry.</em>
        </SectionHeading>
        <div className="steps-grid">
          {[
            [
              "Find your drink",
              "Search 8,200+ catalog entries or create a custom drink. Save a favorite to reuse its serving, place, and prices next time.",
            ],
            [
              "Set serving and price",
              "Use US fluid ounces or milliliters. Enter a price and optional place, or reuse the details saved in a favorite.",
            ],
            [
              "Save the entry",
              "Tap Log drink in Search or Favorites. Set the quantity, keep Now or choose an earlier date and time, then save. History also offers Add past drinks.",
            ],
          ].map(([title, text], index) => (
            <article key={title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="favorites" className="places-section section-shell">
        <div>
          <span className="eyebrow">02 / SAVE YOUR USUAL ORDER</span>
          <h2>
            Same drink.
            <br />
            <em>Different prices.</em>
          </h2>
          <p>
            Save your serving, pub, and any prices you use. Regular price, happy
            hour, a game-day deal: give each one a name and enter the final
            amount.
          </p>
          <p>
            Choose a serving and price on Home. Tap Log drink to change the
            quantity and time, or +1 now to log immediately. Switch between a 12
            and 16 US fl oz pour without editing your favorite. Filter Home by
            saved place to find your drinks there. Past entries keep the details
            you actually logged.
          </p>
          <a className="text-link" href="#preview">
            See saved favorites <Icon name="arrow" size={18} />
          </a>
        </div>
        <div
          className="spending-receipt"
          role="group"
          aria-label="Example named prices for one favorite"
        >
          <div className="receipt-heading">
            <Icon name="wallet" size={26} />
            <span className="eyebrow">ONE FAVORITE / EXAMPLE PRICES</span>
          </div>
          <h3>Your usual draft</h3>
          <p className="receipt-label">The Corner Bar · USD per drink</p>
          <div className="receipt-divider" />
          {[
            ["Regular", "$6.00"],
            ["Happy hour", "$3.00"],
            ["Game day", "$5.00"],
          ].map(([label, price]) => (
            <div className="receipt-row" key={label}>
              <span>{label}</span>
              <strong>{price}</strong>
            </div>
          ))}
          <div className="receipt-divider" />
          <p className="receipt-note">
            Your labels. Your amounts. Select a price manually in the app. These
            are fictional examples, not venue offers or automatic discounts.
          </p>
        </div>
      </section>
      <section className="widget-section">
        <div className="section-shell widget-inner">
          <div className="widget-demo-stage">
            <div
              className="widget-demo widget-quick-demo"
              aria-label="Illustrative compact quick-log widget"
            >
              <div className="widget-quick-copy">
                <h3>Your usual draft</h3>
                <p>16 US fl oz · USD 6.00</p>
                <span className="widget-demo-count">The Corner Bar</span>
                <span className="widget-quick-total">
                  25.2 g alcohol · Last 24h
                </span>
              </div>
              <div className="widget-demo-action">
                <Icon name="plus" /> 1
              </div>
            </div>
            <div
              className="widget-counter-demo"
              aria-label="Illustrative counter showing 117.6 grams of pure alcohol this week"
            >
              <span>This week</span>
              <strong>117.6</strong>
              <span>grams of alcohol</span>
              <small>Week starts Monday</small>
            </div>
            <span className="demo-caption">
              Illustrative widgets · example totals
            </span>
          </div>
          <div>
            <span className="eyebrow">03 / LOG FROM YOUR HOME SCREEN</span>
            <h2>
              One tap.
              <br />
              <em>Drink logged.</em>
            </h2>
            <p>
              Add a free home-screen widget for a favorite drink. Tap +1 to log
              its saved serving, default price, and place without opening the
              full app. Each quick tap logs another drink. The widget briefly
              shows Added 1, Added 2, and so on, then returns to your saved
              details. When space allows, it also shows your rolling 24-hour
              alcohol total.
            </p>
            <ul className="check-list">
              <li>
                <Icon name="check" /> A different favorite on every widget
              </li>
              <li>
                <Icon name="check" /> A five-second Undo for an accidental tap
              </li>
              <li>
                <Icon name="check" /> Calendar or rolling totals in a compact
                counter
              </li>
            </ul>
            <p>
              Use a counter for Today, This week, This month, or a rolling 24
              hours, 7 days, or 30 days. Choose logged drinks, grams or
              milliliters of pure alcohol, or US standard drinks, and a Sunday
              or Monday week start.
            </p>
            <p className="small-print">
              Widgets use saved favorite defaults. Temporary serving and price
              choices on Home apply only to app logging.
            </p>
          </div>
        </div>
      </section>
      <section id="places" className="places-section section-shell">
        <div>
          <span className="eyebrow">04 / OPTIONAL PLACES</span>
          <h2>
            Track where
            <br />
            <em>you drink.</em>
          </h2>
          <p>
            Name a place when saving or editing a favorite, then reuse it for
            other drinks. Save it with a favorite for future app and widget
            logs, and filter Home to your drinks at that place. Your place list
            works offline and needs no location permission.
          </p>
          <p>
            Location is optional, and you can change or clear it for an
            individual app log. Entries without a location still count toward
            drink and spending totals. Location comparisons show how many
            entries are tagged.
          </p>
          <a className="text-link" href={href("/insights/#places-insights")}>
            See how place insights work <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="places-art">
          <div className="place-line" aria-hidden="true" />
          <div className="place-pill">
            <Icon name="pin" />
            <span>The Corner Bar</span>
            <small>Saved place</small>
          </div>
          <div className="place-pill">
            <Icon name="pin" />
            <span>A friend’s place</span>
            <small>Your own label</small>
          </div>
          <div className="place-pill place-pill-muted">
            <Icon name="book" />
            <span>Just the drink</span>
            <small>No location</small>
          </div>
        </div>
      </section>
      <section id="backup" className="places-section section-shell">
        <div>
          <span className="eyebrow">05 / KEEP YOUR HISTORY</span>
          <h2>
            Your records.
            <br />
            <em>Your backup.</em>
          </h2>
          <p>
            Export your drink history, custom drinks, favorites, and saved
            places to a JSON file. Choose where it goes using Android’s file
            picker.
          </p>
          <p>
            Moving phones or recovering a saved copy? Preview the file, then
            choose Restore backup. Missing records are added. Your existing
            records are kept; untouched starter favorites can be restored from
            your backup. Restoring the same file again does not duplicate
            records.
          </p>
          <a className="text-link" href={href("/privacy/#privacy-backup")}>
            What a backup contains <Icon name="arrow" size={18} />
          </a>
        </div>
        <div>
          <h3>More options → Backup &amp; restore</h3>
          <ul className="check-list">
            <li>
              <Icon name="check" /> History keeps its recorded times, servings,
              prices, and places
            </li>
            <li>
              <Icon name="check" /> Favorites keep their named prices and saved
              defaults
            </li>
            <li>
              <Icon name="check" /> Existing history and edited favorites stay
              in place
            </li>
          </ul>
          <p className="small-print">
            Backups contain readable personal data. Store them somewhere
            private. There is no automatic BarTally cloud sync; settings,
            widgets, and ad-removal purchases are separate.
          </p>
        </div>
      </section>
      <section id="questions" className="faq-section section-shell">
        <div>
          <span className="eyebrow">BEFORE YOU START</span>
          <h2>
            Common
            <br />
            <em>questions.</em>
          </h2>
        </div>
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Icon name="plus" size={21} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <ClosingNote />
    </>
  );
}

const periods = [
  {
    label: "7 days",
    values: [0, 1, 0, 2, 1, 0, 1],
    names: ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    count: 5,
    days: 4,
    spending: 28,
    priced: 4,
    note: "Four drinks have prices. One price is missing.",
  },
  {
    label: "30 days",
    values: [2, 1, 3, 2, 0, 4, 1, 2, 3, 1, 2, 3],
    names: ["Aug 13", "", "", "", "", "", "", "", "", "", "", "Sep 11"],
    count: 24,
    days: 19,
    spending: 146,
    priced: 20,
    note: "Twenty drinks have prices. Four prices are missing.",
  },
  {
    label: "90 days",
    values: [3, 5, 2, 4, 6, 2, 5, 3, 4, 6, 3, 5],
    names: ["Jun 14", "", "", "", "", "", "", "", "", "", "", "Sep 11"],
    count: 48,
    days: 35,
    spending: 312,
    priced: 42,
    note: "Forty-two drinks have prices. Six prices are missing.",
  },
] as const;

function RhythmDemo() {
  const [period, setPeriod] = useState(1);
  const selected = periods[period];
  const max = Math.max(...selected.values);
  return (
    <div className="rhythm-demo">
      <div className="demo-topline">
        <span className="eyebrow">DRINKS & SPENDING</span>
        <span className="sample-label">EXAMPLE DATA</span>
      </div>
      <div
        className="period-buttons"
        role="group"
        aria-label="Example chart time range"
      >
        {periods.map((item, index) => (
          <button
            key={item.label}
            aria-pressed={period === index}
            onClick={() => setPeriod(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="rhythm-total" aria-live="polite">
        <strong>{selected.count}</strong>
        <span>
          drinks logged
          <br />
          <small>{selected.days} days with entries</small>
        </span>
      </div>
      <div
        className="rhythm-chart"
        role="img"
        aria-label={`Illustrative ${selected.label} chart, ${selected.count} drinks across ${selected.days} days with entries. Bar heights show example counts across this period.`}
      >
        {selected.values.map((value, index) => (
          <div className="chart-column" key={index}>
            <div className="chart-bar-track">
              <span
                style={{ height: `${(value / max) * 100}%` }}
                className={value === max ? "chart-bar peak" : "chart-bar"}
              />
            </div>
            <small>{selected.names[index]}</small>
          </div>
        ))}
      </div>
      <div className="spending-demo" aria-live="polite">
        <div>
          <span>Recorded spending · USD</span>
          <strong>${selected.spending.toFixed(2)}</strong>
        </div>
        <div>
          <span>Average per priced drink</span>
          <strong>${(selected.spending / selected.priced).toFixed(2)}</strong>
        </div>
      </div>
      <p className="chart-note">{selected.note}</p>
    </div>
  );
}

function InsightsPage() {
  const [metric, setMetric] = useState(false);
  return (
    <>
      <section className="insights-hero section-shell">
        <div>
          <span className="eyebrow">KNOW HOW MUCH. KNOW HOW OFTEN.</span>
          <h1>
            The drinks.
            <br />
            The costs.
            <br />
            <em>The patterns.</em>
          </h1>
          <p>
            See how much you drink and spend over time. Compare days, drinks,
            and places to find where your totals add up.
          </p>
          <a href="#insights-overview" className="text-link">
            Explore your insights <Icon name="arrow" size={18} />
          </a>
        </div>
        <RhythmDemo />
      </section>
      <section id="insights-overview" className="insight-index section-shell">
        <SectionHeading
          number="01"
          eyebrow="MORE THAN A RUNNING TOTAL"
          text="Choose Today, This week, This month, 7 days, 30 days, 90 days, or All time. Compare your logged drinking and spending across periods."
        >
          Check the totals.
          <br />
          <em>Find the patterns.</em>
        </SectionHeading>
        <p className="calendar-explanation">
          Start your week on Sunday or Monday. Calendar days, weeks, and months
          follow your device’s local time zone. The 7-, 30-, and 90-day views
          include today and the preceding calendar dates; counter widgets also
          offer rolling periods, such as the last 24 hours. Time labels follow
          your phone’s 12- or 24-hour clock setting.
        </p>
        <div className="insight-grid">
          {[
            [
              "clock",
              "When you drink",
              "Explore daily trends, weekdays, and times of day. See days with entries alongside days without logs.",
            ],
            [
              "glass",
              "What you drink",
              "See which drinks appear most often and how they contribute to your logged totals.",
            ],
            [
              "wallet",
              "What you spend",
              "Track recorded costs, averages, spending trends, and the drinks or places that cost the most. Each currency has its own totals.",
            ],
            [
              "pin",
              "Where you drink",
              "Compare tagged places by entries, days, nutrition, and recorded spending. See how many entries have a location and price.",
            ],
          ].map(([icon, title, text]) => (
            <article key={title}>
              <Icon name={icon as IconName} size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="spending" className="spending-section section-shell">
        <div className="spending-copy">
          <span className="eyebrow">02 / TRACK THE COST</span>
          <h2>
            Small tabs.
            <br />
            <em>Running totals.</em>
          </h2>
          <p>
            A few drinks at a time can add up. Record the price per drink to see
            what you’ve spent, your average cost, and which drinks and places
            account for it.
          </p>
          <ul className="check-list">
            <li>
              <Icon name="check" /> Add a price now or edit it later in History
            </li>
            <li>
              <Icon name="check" /> Reuse named prices from your favorites
            </li>
            <li>
              <Icon name="check" /> Blank means unknown; zero means free
            </li>
            <li>
              <Icon name="check" /> USD by default, with other currencies
              available
            </li>
            <li>
              <Icon name="check" /> Separate totals per currency; no conversions
            </li>
          </ul>
          <p className="small-print">
            Prices are optional and entered by you. BarTally does not connect to
            bank accounts or fill in missing costs.
          </p>
        </div>
        <div
          className="spending-receipt"
          role="group"
          aria-label="Illustrative spending breakdown in US dollars"
        >
          <div className="receipt-heading">
            <Icon name="wallet" size={25} />
            <span className="eyebrow">30 DAYS · EXAMPLE DATA</span>
          </div>
          <p className="receipt-label">Recorded spending · USD</p>
          <strong className="receipt-total">$146.00</strong>
          <div className="receipt-divider" />
          {[
            ["The Corner Bar", "$88.00"],
            ["Garden Social", "$40.00"],
            ["Home", "$18.00"],
          ].map(([place, total]) => (
            <div className="receipt-row" key={place}>
              <span>{place}</span>
              <strong>{total}</strong>
            </div>
          ))}
          <div className="receipt-divider" />
          <div className="receipt-row">
            <span>Average per priced drink</span>
            <strong>$7.30</strong>
          </div>
          <p className="receipt-coverage">20 of 24 drinks have prices.</p>
          <p className="receipt-note">
            4 missing prices are excluded from spending, not counted as free
            drinks.
          </p>
        </div>
      </section>
      <section className="nutrition-section">
        <div className="section-shell nutrition-inner">
          <div>
            <span className="eyebrow">03 / CALORIES & ALCOHOL</span>
            <h2>
              Known values.
              <br />
              <em>Visible gaps.</em>
            </h2>
            <p>
              Nutrition totals should tell you what’s included. BarTally
              separates published, estimated, entered, and unknown values
              instead of quietly filling in the blanks.
            </p>
            <div className="coverage-example">
              <div>
                <strong>20 of 24</strong>
                <span>drinks have calorie values</span>
              </div>
              <div className="coverage-track" aria-hidden="true">
                <span />
              </div>
              <p>
                4 missing values stay visible. They are not counted as zero.
              </p>
              <small>Illustrative coverage example.</small>
            </div>
            <UnitSwitch metric={metric} onChange={setMetric} />
            <p className="small-print">
              Serving and alcohol units change the display, not your saved
              history. Alcohol totals default to grams of pure alcohol;
              milliliters and US standard drinks (14 g each) are also available
              in Units.
            </p>
          </div>
          <div className="nutrition-phone">
            <Phone
              image={`${metric ? "metric" : "us"}/06-nutrition.png`}
              alt={`Actual nutrition screen showing coverage and average pour in ${metric ? "milliliters" : "US fluid ounces"}.`}
            />
            <span className="demo-caption">
              Actual app screen · illustrative history
            </span>
          </div>
        </div>
      </section>
      <section id="places-insights" className="place-insights section-shell">
        <div className="place-summary">
          <div className="summary-heading">
            <Icon name="pin" size={26} />
            <h3>Places & patterns</h3>
          </div>
          <p>17 of 24 drinks include a place</p>
          {[
            ["The Corner Bar", "6 drinks"],
            ["Garden Social", "6 drinks"],
            ["Home", "5 drinks"],
          ].map(([name, count]) => (
            <div className="place-summary-row" key={name}>
              <span>{name}</span>
              <strong>{count}</strong>
            </div>
          ))}
          <div className="untagged-summary">
            <strong>No location · 7 drinks</strong>
            <span>Included in every overall total.</span>
          </div>
          <small>Example entries. Location is optional.</small>
        </div>
        <div>
          <span className="eyebrow">04 / LOCATIONS ARE OPTIONAL</span>
          <h2>
            Add a place.
            <br />
            <em>Compare the costs.</em>
          </h2>
          <p>
            Compare drinks and recorded spending by place. Entries without a
            location still count toward your overall totals.
          </p>
          <p>
            Place comparisons include only the entries you tag. Price and
            location coverage show how much of your history each comparison
            represents.
          </p>
          <a className="text-link" href={href("/app/#places")}>
            See location options <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>
      <aside className="insights-note section-shell">
        <Icon name="book" size={24} />
        <p>
          A journal is a record of your entries, not a complete record of
          consumption. A day without a log isn’t necessarily a day without
          alcohol. BarTally does not calculate blood alcohol concentration or
          determine whether you can drive.
        </p>
      </aside>
      <ClosingNote />
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="not-found section-shell">
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1>
        Page <em>not found.</em>
      </h1>
      <p>This link doesn’t match a page. Open the home page to continue.</p>
      <ButtonLink to={href("/")}>Back to BarTally</ButtonLink>
    </section>
  );
}

export function App({ page }: { page: PageId }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header page={page} />
      <main id="main-content" tabIndex={-1}>
        {page === "home" ? (
          <HomePage />
        ) : page === "app" ? (
          <AppPage />
        ) : page === "insights" ? (
          <InsightsPage />
        ) : page === "beta" ? (
          <BetaPage />
        ) : page === "privacy" ? (
          <PrivacyPage
            developerName={siteConfig.developerName}
            supportEmail={siteConfig.supportEmail}
            playStoreUrl={siteConfig.playStoreUrl}
          />
        ) : (
          <NotFoundPage />
        )}
      </main>
      <Footer />
    </>
  );
}
