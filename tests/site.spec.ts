import AxeBuilder from '@axe-core/playwright';
import { test as base, expect, type Page } from '@playwright/test';

// Every interaction test also guards hydration errors and unexpected third-party requests.
const test = base.extend<{ browserIssues: void }>({
  browserIssues: [async ({ page, baseURL }, use) => {
    const errors: string[] = [];
    const externalRequests: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('request', request => {
      const url = new URL(request.url());
      if (url.protocol.startsWith('http') && url.origin !== siteURL(baseURL).origin) {
        externalRequests.push(request.url());
      }
    });
    await use();
    expect(errors, 'There should be no JavaScript, hydration, or resource console errors.').toEqual([]);
    expect(externalRequests, 'Fonts, scripts, and images must be hosted with the website.').toEqual([]);
  }, { auto: true }],
});

function siteURL(baseURL: string | undefined, path = './') {
  if (!baseURL) throw new Error('The test configuration must provide a website base URL.');
  return new URL(path, baseURL);
}

function imagePath(baseURL: string | undefined, image: string) {
  return siteURL(baseURL, `images/${image}`).pathname;
}

const routes = [
  { path: './', heading: /Your drinks\.\s*Your tab\.\s*Tracked\./, title: /BarTally/ },
  { path: 'app/', heading: /Log what you drink\./, title: /Meet the app/ },
  { path: 'insights/', heading: /The drinks\.\s*The costs\.\s*The patterns\./, title: /BarTally insights/ },
  { path: 'beta/', heading: /Help get BarTally ready\./, title: /BarTally/ },
  { path: 'privacy/', heading: /Privacy policy\./, title: /Privacy policy/ },
];

async function openNavigation(page: Page) {
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
  }
}

for (const route of routes) {
  test(`${route.path} supports direct loading, refresh, and local assets`, async ({ page, baseURL }) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
    const indexResponse = await page.goto(`${route.path}index.html`);
    expect(indexResponse?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);

    // Load lazy screenshots too, rather than checking only the initial viewport.
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => {
        const image = element as HTMLImageElement;
        return image.complete && image.naturalWidth > 0;
      })).toBe(true);
      if (await image.getAttribute('aria-hidden') === 'true') {
        expect(await image.getAttribute('alt')).toBe('');
      } else {
        expect(await image.getAttribute('alt')).toBeTruthy();
      }
      expect((await image.getAttribute('src'))?.startsWith(imagePath(baseURL, ''))).toBe(true);
    }
    const fontsReady = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('16px "DM Sans Variable"') && document.fonts.check('16px "Fraunces Variable"');
    });
    expect(fontsReady).toBe(true);
  });

  test(`${route.path} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route.path);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(blocking.map(({ id, description, nodes }) => ({ id, description, targets: nodes.map(node => node.target) }))).toEqual([]);
  });
}

test('main navigation reaches all pages and indicates the current page', async ({ page, baseURL }) => {
  await page.goto('./');
  for (const [name, path, heading] of [
    ['The app', 'app/', /Log what you drink\./],
    ['The insights', 'insights/', /The drinks\.\s*The costs\.\s*The patterns\./],
    ['Your privacy', 'privacy/', /Privacy policy\./],
  ] as const) {
    await openNavigation(page);
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(siteURL(baseURL, path).href);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    // On mobile the selected link is hidden when the new page closes its menu.
    await openNavigation(page);
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page');
    const close = page.getByRole('button', { name: 'Close navigation' });
    if (await close.isVisible()) await close.click();
  }
  await page.locator('.site-header').getByRole('link', { name: 'BarTally home' }).click();
  await expect(page).toHaveURL(siteURL(baseURL).href);
});

test('mobile menu closes with Escape and the skip link reaches main content', async ({ page }) => {
  await page.goto('./');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  if (await menu.isVisible()) {
    await menu.click();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  }
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await skip.focus();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('app preview supports keyboard navigation and both regional screenshot sets', async ({ page, baseURL }) => {
  await page.goto('app/#preview');
  const tabs = page.getByRole('tablist', { name: 'Explore app screens' });
  const panel = page.getByRole('tabpanel');
  const favorite = tabs.getByRole('tab', { name: /Your favorites/ });
  await favorite.focus();
  await expect(favorite).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  const search = tabs.getByRole('tab', { name: /Find a drink/ });
  await expect(search).toBeFocused();
  await expect(search).toHaveAttribute('aria-selected', 'true');
  await expect(panel.locator('img')).toHaveAttribute('src', imagePath(baseURL, 'us/02-search.png'));

  const units = page.getByRole('group', { name: 'Screenshot measurement units' });
  await units.getByRole('button', { name: 'Milliliters' }).click();
  await expect(units.getByRole('button', { name: 'Milliliters' })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.locator('img')).toHaveAttribute('src', imagePath(baseURL, 'metric/02-search.png'));
  await search.focus();
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab', { name: /Drink history/ })).toBeFocused();
  await expect(panel.locator('img')).toHaveAttribute('src', imagePath(baseURL, 'metric/04-history.png'));
  await page.keyboard.press('Home');
  await expect(favorite).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.getByRole('tab', { name: /Drink history/ })).toBeFocused();
  await tabs.getByRole('tab', { name: /Log several drinks/ }).click();
  await expect(panel.locator('img')).toHaveAttribute('src', imagePath(baseURL, 'metric/03-serving.png'));
  await units.getByRole('button', { name: 'US fl oz' }).click();
  await expect(panel.locator('img')).toHaveAttribute('src', imagePath(baseURL, 'us/03-serving.png'));
  await tabs.getByRole('tab', { name: /Track spending/ }).click();
  await expect(panel.locator('img')).toHaveAttribute('src', imagePath(baseURL, 'us/08-spending.png'));
  await units.getByRole('button', { name: 'Milliliters' }).click();
  await expect(panel.locator('img')).toHaveAttribute('src', imagePath(baseURL, 'metric/08-spending.png'));
  await expect(panel).toContainText('different currencies stay separate');
});

test('insight controls update drink counts, recorded costs, price coverage, and nutrition units', async ({ page, baseURL }) => {
  await page.goto('insights/');
  const ranges = page.getByRole('group', { name: 'Example chart time range' });
  for (const [label, count, days, spending, average, missing] of [
    ['7 days', 5, 4, '$28.00', '$7.00', 'One price is missing.'],
    ['30 days', 24, 19, '$146.00', '$7.30', 'Four prices are missing.'],
    ['90 days', 48, 35, '$312.00', '$7.43', 'Six prices are missing.'],
  ] as const) {
    await ranges.getByRole('button', { name: label, exact: true }).click();
    await expect(ranges.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.rhythm-total > strong')).toHaveText(String(count));
    await expect(page.locator('.rhythm-total small')).toHaveText(`${days} days with entries`);
    await expect(page.getByRole('img', { name: new RegExp(`Illustrative ${label} chart, ${count} drinks`) })).toBeVisible();
    await expect(page.locator('.spending-demo strong')).toHaveText([spending, average]);
    await expect(page.locator('.chart-note')).toContainText(missing);
  }
  await expect(page.locator('#spending')).toContainText('Blank means unknown; zero means free');
  await expect(page.locator('#spending')).toContainText('Separate totals per currency; no conversions');
  await expect(page.locator('.spending-receipt')).toContainText('EXAMPLE DATA');
  const units = page.getByRole('group', { name: 'Screenshot measurement units' });
  await units.getByRole('button', { name: 'Milliliters' }).click();
  await expect(page.getByRole('img', { name: /Actual nutrition screen/ })).toHaveAttribute('src', imagePath(baseURL, 'metric/06-nutrition.png'));
  await units.getByRole('button', { name: 'US fl oz' }).click();
  await expect(page.getByRole('img', { name: /Actual nutrition screen/ })).toHaveAttribute('src', imagePath(baseURL, 'us/06-nutrition.png'));
});

test('FAQ opens and closes by keyboard and widget illustration has no fake button', async ({ page }) => {
  await page.goto('app/#questions');
  const question = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Is BarTally free?' }) });
  const answer = question.locator('p');
  await expect(answer).toBeHidden();
  await question.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(answer).toBeVisible();
  await expect(answer).toContainText('Every feature is free');
  await page.keyboard.press('Space');
  await expect(answer).toBeHidden();
  await expect(page.locator('.widget-demo').getByRole('button')).toHaveCount(0);
  const costs = page.locator('details').filter({ has: page.locator('summary', { hasText: 'How does spending tracking work?' }) });
  await costs.locator('summary').click();
  await expect(costs.locator('p')).toContainText('multiplied by the entry’s drink count');
  await expect(costs.locator('p')).toContainText('no exchange-rate conversion');
});

test('privacy contents links reach every section and explain bug reports and private contact', async ({ page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('privacy/');
  const contents = page.getByRole('navigation', { name: 'Privacy policy contents' });
  const links = await contents.getByRole('link').all();
  expect(links.length).toBe(12);
  for (const link of links) {
    const anchor = await link.getAttribute('href');
    expect(anchor).toMatch(/^#privacy-/);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${anchor}$`));
    const heading = page.locator(anchor!).getByRole('heading');
    await expect(heading).toBeInViewport();
  }
  const contact = page.locator('#privacy-contact');
  await expect(page.locator('#privacy-data')).toContainText('optional prices and currencies');
  await expect(page.locator('#privacy-data')).toContainText('does not connect to financial accounts');
  await expect(contact).toContainText('review');
  await expect(contact).toContainText('Reviews are public, so please leave out personal information.');
  await expect(page.locator('a[href="mailto:"]')).toHaveCount(0);

  // A preview explains the missing contact route. A published policy may use
  // either a direct email address or the live listing's private App support route.
  const note = page.locator('.policy-note');
  if (await note.count()) {
    await expect(note).toContainText('a private contact route will be available before the app launches');
    await expect(contact).toContainText('A private contact route for privacy questions is not available yet.');
    await expect(contact).toContainText('During the closed test');
  } else if (await contact.locator('a[href^="mailto:"]').count()) {
    await expect(contact.locator('a[href^="mailto:"]')).toBeVisible();
  } else {
    await expect(contact.getByRole('link', { name: 'BarTally listing', exact: true })).toHaveAttribute('href', /^https:\/\/play\.google\.com\/store\/apps\/details\?[^#]*\bid=com\.billcorp\.bartally(?:&|$)/);
    await expect(contact).toContainText('App support');
    await expect(contact).toContainText('Please use that private contact route for personal information.');
  }

  const hasPublicListing = await contact.getByRole('link', { name: 'BarTally on Google Play', exact: true }).count() > 0;
  if (!hasPublicListing) {
    await expect(contact).toContainText('send private testing feedback');
    await expect(contact).toContainText('After the public release, reviews will be available');
  }
  const hasSupportEmail = await contact.locator('a[href^="mailto:"]').count() > 0;
  await page.goto('./');
  const bugReport = page.getByRole('contentinfo').getByRole('link', { name: 'Report a bug', exact: true });
  const feedbackPath = hasSupportEmail || hasPublicListing ? 'privacy/#privacy-contact' : 'beta/#feedback';
  const feedbackURL = siteURL(baseURL, feedbackPath);
  await expect(bugReport).toHaveAttribute('href', `${feedbackURL.pathname}${feedbackURL.hash}`);
  await bugReport.click();
  await expect(page).toHaveURL(feedbackURL.href);
  const feedback = page.locator(feedbackURL.hash);
  await expect(feedback.getByRole('heading', { level: 2 })).toBeInViewport();
  if (!hasPublicListing && !hasSupportEmail) {
    await expect(feedback).toContainText('private feedback option for testers');
    await expect(feedback).toContainText('Leave personal details and real drink history out of group posts');
  }
});

test('pre-launch calls to action explain beta enrollment before opening the store', async ({ page, baseURL }) => {
  await page.goto('./');
  const hero = page.locator('.hero-copy');
  const publicStoreLink = hero.locator('a[href^="https://play.google.com/store/apps/details"]');
  if (await publicStoreLink.count()) {
    await expect(publicStoreLink.first()).toHaveAttribute('href', /id=com\.billcorp\.bartally(?:&|$)/);
    return;
  }
  await expect(hero.locator('a[href^="https://play.google.com/"]')).toHaveCount(0);
  const heroBetaLink = hero.getByRole('link', { name: 'Join the beta', exact: true });
  await expect(heroBetaLink).toHaveAttribute('href', siteURL(baseURL, 'beta/').pathname);
  await openNavigation(page);
  const navBetaLink = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Join the beta', exact: true });
  await navBetaLink.click();
  await expect(page).toHaveURL(siteURL(baseURL, 'beta/').href);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Help get BarTally ready\./);
  await openNavigation(page);
  await expect(navBetaLink).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Join the beta', exact: true })).toHaveAttribute('href', siteURL(baseURL, 'beta/').pathname);
});

test('beta enrollment links follow group, opt-in, and install order with account guidance', async ({ page }) => {
  await page.goto('beta/');
  const main = page.getByRole('main');
  const actions = [
    ['Join the Google Group', 'https://groups.google.com/g/bartallytesters'],
    ['Join the closed test', 'https://play.google.com/apps/testing/com.billcorp.bartally'],
    ['Install BarTally', 'https://play.google.com/store/apps/details?id=com.billcorp.bartally'],
  ] as const;
  for (const [name, url] of actions) {
    const link = main.getByRole('link', { name, exact: true });
    await expect(link).toHaveAttribute('href', url);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('rel', /noreferrer/);
  }
  const expectedUrls = actions.map(([, url]) => url);
  const order = await main.getByRole('link').evaluateAll((links, expected) => links
    .map(link => link.getAttribute('href'))
    .filter(url => expected.includes(url ?? '')), expectedUrls);
  expect(order).toEqual(expectedUrls);
  await expect(main).toContainText('same Google account');
  await expect(main).toContainText('14 consecutive days');
  await expect(main).toContainText('Android 11');
});

test('the static 404 document keeps its own content and route after refresh', async ({ page, baseURL }) => {
  await page.goto('404.html');
  await expect(page).toHaveTitle(/Page not found/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Page not found\./);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Page not found\./);
  await page.getByRole('link', { name: 'Back to BarTally', exact: true }).click();
  await expect(page).toHaveURL(siteURL(baseURL).href);
});

test('all pages fit 320, 390, 768, 1024, and 1440 pixel viewports without horizontal scrolling', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(route.path);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        return {
          viewport,
          content: document.documentElement.scrollWidth,
          outside: Array.from(document.querySelectorAll('main *')).flatMap(element => {
            const rect = element.getBoundingClientRect();
            return rect.right > viewport + 1 || rect.left < -1
              ? [`${element.tagName.toLowerCase()}.${element.getAttribute('class') ?? ''}: ${Math.round(rect.left)}..${Math.round(rect.right)}`]
              : [];
          }).slice(0, 20),
        };
      });
      expect.soft(dimensions.content, `${route.path} overflows at ${width}px; outside bounds: ${dimensions.outside.join(', ')}`).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  }
});

test('reduced motion disables smooth scrolling and decorative transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('insights/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect(await page.locator('.chart-bar').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
});

test.describe('prerendered content without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('all pages remain readable and footer navigation works', async ({ page, baseURL }) => {
    for (const route of routes) {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(route.heading);
      await expect(page.getByRole('main')).not.toBeEmpty();
      await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'The app', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden();
    }
    await page.getByRole('contentinfo').getByRole('link', { name: 'Meet the app' }).click();
    await expect(page).toHaveURL(siteURL(baseURL, 'app/').href);
    const details = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Is BarTally free?' }) });
    await details.locator('summary').click();
    await expect(details.locator('p')).toBeVisible();
    await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy policy', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy policy.');
  });
});
