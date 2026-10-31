// End-to-end verification against the running app (default: vite preview of the production build).
// Requires Playwright + Chromium to be available (`require('playwright')`).
// Usage: node scripts/e2e.mjs [baseUrl]   (screenshots -> docs/evidence/screenshots)
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:4173';
const shots = 'docs/evidence/screenshots';
mkdirSync(shots, { recursive: true });

const results = [];
const consoleErrors = [];
const failedRequests = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
page.on('requestfailed', (r) => failedRequests.push(`${r.url()} (${r.failure()?.errorText})`));
page.on('response', (r) => { if (r.status() >= 400) failedRequests.push(`${r.url()} (HTTP ${r.status()})`); });

const nav = (label) => page.getByRole('link', { name: label, exact: true }).click();

await page.goto(base);
await page.getByRole('heading', { name: 'Recent High-Severity Incidents' }).waitFor();
check('Dashboard renders', true);
check('Dashboard shows 4 KPI cards + 5 incidents', (await page.locator('tbody tr').count()) === 5);
check('Radar chart rendered', (await page.locator('.recharts-radar').count()) > 0);
check('Tailwind styles bundled (sidebar has bg)', (await page.locator('aside').evaluate((e) => getComputedStyle(e).backgroundColor)) !== 'rgba(0, 0, 0, 0)');
await page.waitForTimeout(800);
await page.screenshot({ path: `${shots}/dashboard-desktop.png` });

// Verifier — failing scenario
await nav('Verifier');
await page.getByRole('heading', { name: /Control Verifier/ }).waitFor();
await page.getByText('CTRL-001').first().waitFor();
check('Verifier lists 3 controls', (await page.locator('tbody tr').count()) === 3);
const failedText = await page.locator('text=Failed').first().locator('xpath=following-sibling::div').innerText();
check('Failing scenario: 3 failed', failedText.trim() === '3', `Failed=${failedText.trim()}`);
await page.getByRole('button', { name: 'Details' }).nth(2).click();
await page.getByText('Findings (5)').waitFor();
check('CTRL-003 details show all 5 secret findings', true);
check('Secrets are masked in UI', !(await page.content()).includes('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'));
await page.screenshot({ path: `${shots}/verifier-failing-details.png`, fullPage: true });

// Verifier — passing scenario
await page.getByRole('button', { name: 'Passing samples' }).click();
await page.waitForFunction(() => document.body.innerText.includes('100%'));
const passedText = await page.locator('text=Passed').first().locator('xpath=following-sibling::div').innerText();
check('Passing scenario: 3 passed / 100% compliance', passedText.trim() === '3');
await page.screenshot({ path: `${shots}/verifier-passing.png`, fullPage: true });

// Governance
await nav('Governance');
await page.waitForTimeout(300);
check('Governance renders RACI table', (await page.locator('table').count()) > 0);
await page.screenshot({ path: `${shots}/governance-desktop.png`, fullPage: true });

// Risk register sorting
await nav('Risk Register');
await page.getByRole('heading', { name: 'Risk Register' }).waitFor();
const firstScore = async () => (await page.locator('tbody tr').first().locator('td').nth(6).innerText()).trim();
check('Risk register default sort: highest score first', (await firstScore()) === '75');
await page.getByRole('columnheader', { name: /Score/ }).click();
check('Clicking Score reverses to ascending', (await firstScore()) === '45');
await page.screenshot({ path: `${shots}/risk-register-sorted.png`, fullPage: true });

// Project plan
await nav('Project Plan');
await page.waitForTimeout(300);
await page.screenshot({ path: `${shots}/project-plan-desktop.png`, fullPage: true });
check('Project Plan renders', (await page.locator('main').innerText()).length > 50);

// Executive deck
await nav('Executive Deck');
await page.waitForTimeout(300);
const before = await page.locator('main h2, main h3').first().innerText();
await page.locator('main button').filter({ has: page.locator('svg') }).last().click();
await page.waitForTimeout(300);
const after = await page.locator('main h2, main h3').first().innerText();
check('Executive deck next-slide changes slide', before !== after, `${before} -> ${after}`);
await page.screenshot({ path: `${shots}/executive-deck.png` });

// Theme toggle
await nav('Dashboard');
await page.getByRole('button', { name: 'Toggle theme' }).click();
check('Dark mode toggles html.dark', await page.evaluate(() => document.documentElement.classList.contains('dark')));
await page.screenshot({ path: `${shots}/dashboard-dark.png` });
await page.getByRole('button', { name: 'Toggle theme' }).click();

// Mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const mp = await mobile.newPage();
mp.on('pageerror', (e) => consoleErrors.push('mobile pageerror: ' + e.message));
await mp.goto(base);
await mp.getByText('Recent High-Severity Incidents').waitFor();
await mp.waitForTimeout(800); // let the 0.5s fade-in finish
const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
check('Mobile: no page-level horizontal overflow', !overflow);
await mp.screenshot({ path: `${shots}/dashboard-mobile.png`, fullPage: true });
await mp.getByRole('link', { name: 'Verifier', exact: true }).click().catch(async () => mp.locator('aside a').nth(1).click());
await mp.getByText('CTRL-001').first().waitFor();
await mp.waitForTimeout(800);
await mp.screenshot({ path: `${shots}/verifier-mobile.png`, fullPage: true });

const ignorable = (s) => /fonts\.(googleapis|gstatic)\.com/.test(s);
const realConsole = consoleErrors.filter((s) => !ignorable(s));
const realFailed = failedRequests.filter((s) => !ignorable(s));
check('No console errors (excluding Google Fonts)', realConsole.length === 0, realConsole.join(' | '));
check('No failed network requests (excluding Google Fonts)', realFailed.length === 0, realFailed.join(' | '));
writeFileSync('docs/evidence/test-results/e2e-results.json', JSON.stringify({ base, results, consoleErrors, failedRequests }, null, 2));
await browser.close();
process.exit(results.every((r) => r.ok) ? 0 : 1);
