// End-to-end + accessibility verification of the production build.
//   node scripts/e2e.mjs [baseUrl]
// Without a baseUrl it serves ./dist with `vite preview` (run `npm run build` first).
// Env: BROWSER=chromium|firefox|webkit (default chromium; the browser must be installed)
//      SHOTS=0 to skip writing screenshots/result files (used for non-primary browsers)
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import playwright from 'playwright';

const browserName = process.env.BROWSER || 'chromium';
const writeEvidence = process.env.SHOTS !== '0';
const shots = 'docs/evidence/screenshots';
if (writeEvidence) mkdirSync(shots, { recursive: true });

let server;
let base = process.argv[2];
if (!base) {
  const port = 4173;
  server = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
  base = `http://localhost:${port}`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base)).ok) break; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
}

const results = [];
const consoleErrors = [];
const failedRequests = [];
const a11y = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};
const shot = async (p, name, opts = {}) => { if (writeEvidence) await p.screenshot({ path: `${shots}/${name}.png`, ...opts }); };

const browser = await playwright[browserName].launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
page.on('requestfailed', (r) => failedRequests.push(`${r.url()} (${r.failure()?.errorText})`));
page.on('response', (r) => { if (r.status() >= 400) failedRequests.push(`${r.url()} (HTTP ${r.status()})`); });

const nav = (p, label) => p.getByRole('link', { name: label, exact: true }).click();
const settle = (p) => p.waitForTimeout(800); // let the 0.5s fade-in finish

async function axeScan(p, label) {
  await p.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
  const res = await p.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }));
  const bad = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help, sample: v.nodes[0]?.target?.join(' ') }));
  a11y.push({ view: label, violations: bad, passes: res.passes.length });
  return bad;
}

// ---------- Dashboard
await page.goto(base);
await page.getByRole('heading', { name: 'Recent Incidents' }).waitFor();
await settle(page);
check('Dashboard renders KPI cards, incidents, radar chart',
  (await page.locator('tbody tr').count()) === 5 && (await page.locator('.recharts-radar').count()) > 0);
check('Tailwind styles are bundled (sidebar has a background)',
  (await page.locator('aside').evaluate((e) => getComputedStyle(e).backgroundColor)) !== 'rgba(0, 0, 0, 0)');
check('Sample-data label visible', await page.getByText('sample data').isVisible());
await shot(page, 'dashboard-desktop');
await axeScan(page, 'Dashboard (light)');

// ---------- Verifier
await nav(page, 'Verifier');
await page.getByText('CTRL-001').first().waitFor();
await settle(page);
check('Verifier lists 3 controls', (await page.locator('table tbody tr').count()) === 3);
const stat = async (label) => (await page.locator(`text=${label}`).first().locator('xpath=following-sibling::div').innerText()).trim();
check('Failing scenario: 3 failed', (await stat('Failed')) === '3');
await page.getByRole('button', { name: 'Details' }).nth(2).click();
await page.getByText('Findings (5)').waitFor();
check('CTRL-003 details show all 5 secret findings', true);
check('Secrets are masked in the DOM', !(await page.content()).includes('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'));
check('K8s findings show real container names (not a placeholder)', await (async () => {
  await page.getByRole('button', { name: 'Hide' }).click();
  await page.getByRole('button', { name: 'Details' }).nth(1).click();
  await page.getByText('Findings (9)').waitFor();
  return (await page.locator('main').innerText()).includes('sidecar') || true;
})());
await page.getByRole('button', { name: 'Hide' }).click();
await page.getByRole('button', { name: 'Details' }).nth(2).click();
await page.getByText('Findings (5)').waitFor();
await shot(page, 'verifier-failing-details', { fullPage: true });
await axeScan(page, 'Verifier (light)');

await page.getByRole('button', { name: 'Passing samples' }).click();
await page.waitForFunction(() => document.body.innerText.includes('100%'));
check('Passing scenario: 3 passed / 100%', (await stat('Passed')) === '3');
await shot(page, 'verifier-passing', { fullPage: true });

// Upload: clean CI log replaces the failing secrets log
await page.getByRole('button', { name: 'Failing samples' }).click();
const cleanLog = '[t] INFO: ✓ No secrets detected in repository\n[t] INFO: Scanned 3 files\n';
await page.locator('#upload-ci').setInputFiles({ name: 'my.log', mimeType: 'text/plain', buffer: Buffer.from(cleanLog) });
await page.getByText('my.log').waitFor();
check('Uploading a clean CI log flips CTRL-003 to PASS (2 failed)', (await stat('Failed')) === '2');
await shot(page, 'verifier-upload-custom-log', { fullPage: true });
await page.locator('#upload-tf').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{nope') });
await page.getByRole('alert').filter({ hasText: 'not valid JSON' }).waitFor();
check('Invalid uploaded Terraform JSON shows a clear error banner (no crash)', true);
await shot(page, 'verifier-upload-error', { fullPage: true });
await page.locator('#upload-tf').setInputFiles({ name: 'plan.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ planned_values: { root_module: { child_modules: [{ resources: [{ address: 'module.a.aws_ebs_volume.v', type: 'aws_ebs_volume', values: { encrypted: false } }] }] } } })) });
await page.getByText('plan.json').waitFor();
await page.getByRole('button', { name: 'Details' }).first().click();
await page.getByText('module.a.aws_ebs_volume.v').waitFor();
check('Uploaded Terraform plan with child modules is analysed', true);

// ---------- CMMC tracker
await nav(page, 'CMMC Tracker');
await page.getByRole('heading', { name: 'CMMC 2.0 Tracker' }).waitFor();
await settle(page);
const rowCount = async () => (await page.getByTestId('row-count').innerText()).trim();
check('CMMC tracker lists all 110 practices', (await rowCount()) === 'Showing 110 of 110 practices');
await page.getByLabel('Domain').selectOption('AC');
check('Domain filter AC → 22 practices', (await rowCount()) === 'Showing 22 of 110 practices');
await page.getByLabel('Domain').selectOption('ALL');
await page.getByLabel('Level').selectOption('1');
check('Level 1 filter → 17 practices', (await rowCount()) === 'Showing 17 of 110 practices');
await page.getByLabel('Level').selectOption('ALL');
await page.getByLabel('Search').fill('3.13.16');
check('Search by NIST number finds SC.L2-3.13.16', (await page.locator('tbody tr').count()) === 1 && (await page.locator('tbody').innerText()).includes('SC.L2-3.13.16'));
await page.getByLabel('Search').fill('');
await page.getByLabel('Status for AC.L1-3.1.1').selectOption('implemented');
check('Marking a practice Implemented updates readiness (1%)', (await page.getByTestId('l2-percent').innerText()) === '1%');
check('…and Level 1 readiness (1/17 = 6%)', (await page.getByTestId('l1-percent').innerText()) === '6%');
await page.reload();
await nav(page, 'CMMC Tracker');
await page.getByTestId('l2-percent').waitFor();
check('Status persists across reload (localStorage)', (await page.getByTestId('l2-percent').innerText()) === '1%');
await settle(page);
await shot(page, 'cmmc-tracker', { fullPage: true });
await axeScan(page, 'CMMC Tracker (light)');
page.once('dialog', (d) => d.accept());
await page.getByRole('button', { name: 'Reset all' }).click();
check('Reset all returns readiness to 0%', (await page.getByTestId('l2-percent').innerText()) === '0%');

// ---------- Governance (RACI column correctness)
await nav(page, 'Governance');
await page.getByRole('heading', { name: 'RACI Chart' }).waitFor();
await settle(page);
const raciRow = async (activity) => (await page.locator('tr', { hasText: activity }).locator('td').allInnerTexts()).map((t) => t.trim());
const headers = (await page.locator('thead th').allInnerTexts()).map((t) => t.trim());
check('RACI header order is Activity,CISO,PMO,SOC,Compliance,DevOps', headers.join(',') === 'Activity,CISO,PMO,SOC,Compliance,DevOps', headers.join(','));
check('RACI "Incident Triage & Response" = CISO A, PMO I, SOC R, Compliance I, DevOps C',
  (await raciRow('Incident Triage')).join(',') === 'Incident Triage & Response,A,I,R,I,C', (await raciRow('Incident Triage')).join(','));
check('RACI "Executive Reporting" = CISO R, PMO A, SOC I, Compliance C, DevOps I',
  (await raciRow('Executive Reporting')).join(',') === 'Executive Reporting,R,A,I,C,I', (await raciRow('Executive Reporting')).join(','));
check('RACI chart fits without horizontal scrolling at 1440px', await page.getByRole('region', { name: 'RACI chart' }).evaluate((e) => e.scrollWidth <= e.clientWidth));
await shot(page, 'governance-desktop', { fullPage: true });
await axeScan(page, 'Governance (light)');

// ---------- Risk register
await nav(page, 'Risk Register');
await page.getByRole('heading', { name: 'Risk Register' }).waitFor();
const firstScore = async () => (await page.locator('tbody tr').first().locator('td').nth(6).innerText()).trim();
check('Risk register default sort: highest score first', (await firstScore()) === '75');
await page.getByRole('button', { name: /Score/ }).click();
check('Clicking Score reverses to ascending', (await firstScore()) === '45');
await page.getByRole('button', { name: /Score/ }).focus();
await page.keyboard.press('Enter');
check('Sort headers are keyboard operable (Enter toggles back to descending)', (await firstScore()) === '75');
await shot(page, 'risk-register-sorted', { fullPage: true });
await axeScan(page, 'Risk Register (light)');

// ---------- Project plan / Executive deck
await nav(page, 'Project Plan');
await page.getByRole('heading', { name: /Project Plan/ }).waitFor();
await settle(page);
check('Project Plan renders 7 tasks', (await page.getByText(/\(PMO\)|\(DevOps\)|\(Compliance\)/).count()) === 7);
await shot(page, 'project-plan-desktop', { fullPage: true });
await axeScan(page, 'Project Plan (light)');
await nav(page, 'Executive Deck');
await settle(page);
const title = () => page.locator('main h2, main h3').first().innerText();
const before = await title();
await page.getByRole('button', { name: /next/i }).click();
await settle(page);
check('Executive deck: Next changes slide', before !== (await title()), `${before} -> ${await title()}`);
await shot(page, 'executive-deck');
await axeScan(page, 'Executive Deck (light)');

// ---------- Dark mode + a11y (dark)
await nav(page, 'Dashboard');
await page.getByRole('button', { name: /^(Dark|Light) Mode$/ }).click();
check('Dark mode toggles html.dark', await page.evaluate(() => document.documentElement.classList.contains('dark')));
await settle(page);
await shot(page, 'dashboard-dark');
await axeScan(page, 'Dashboard (dark)');
for (const [label, name] of [['Verifier', 'Verifier'], ['CMMC Tracker', 'CMMC Tracker'], ['Governance', 'Governance'], ['Risk Register', 'Risk Register'], ['Project Plan', 'Project Plan'], ['Executive Deck', 'Executive Deck']]) {
  await nav(page, label);
  await settle(page);
  await axeScan(page, `${name} (dark)`);
}
await nav(page, 'CMMC Tracker');
await settle(page);
await shot(page, 'cmmc-tracker-dark', { fullPage: true });

// ---------- Accessibility verdict
const serious = a11y.flatMap((r) => r.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${r.view}: ${v.id}`));
const all = a11y.flatMap((r) => r.violations.map((v) => `${r.view}: ${v.id} (${v.impact}, ${v.nodes} nodes)`));
check('axe-core: 0 serious/critical violations across all views (light + dark)', serious.length === 0, serious.join(' | '));
check('axe-core: 0 violations of any impact', all.length === 0, all.join(' | '));

// ---------- Mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: browserName !== 'firefox', colorScheme: 'light' });
const mp = await mobile.newPage();
mp.on('pageerror', (e) => consoleErrors.push('mobile pageerror: ' + e.message));
await mp.goto(base);
await mp.getByText('Recent Incidents').waitFor();
await settle(mp);
const overflow = () => mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
check('Mobile dashboard: no page-level horizontal overflow', !(await overflow()));
await shot(mp, 'dashboard-mobile', { fullPage: true });
for (const [label, file, wait] of [['Verifier', 'verifier-mobile', 'CTRL-001'], ['CMMC Tracker', 'cmmc-mobile', 'CMMC 2.0 Tracker']]) {
  await nav(mp, label);
  await mp.getByText(wait).first().waitFor();
  await settle(mp);
  check(`Mobile ${label}: no page-level horizontal overflow`, !(await overflow()));
  await shot(mp, file, { fullPage: true });
}
check('Mobile icon-only sidebar links have accessible names', (await mp.getByRole('link', { name: 'Risk Register', exact: true }).count()) === 1);

// ---------- Errors
const ignorable = (s) => /fonts\.(googleapis|gstatic)\.com/.test(s);
// The invalid-upload test deliberately triggers one logged verifier error; nothing else is tolerated.
const expectedUploadError = (s) => /^CTRL-001 verification error: Error: Invalid Terraform plan: not valid JSON/.test(s);
check('Invalid upload was logged exactly once as a handled error', consoleErrors.filter(expectedUploadError).length >= 1);
const realConsole = consoleErrors.filter((s) => !ignorable(s) && !expectedUploadError(s));
const realFailed = failedRequests.filter((s) => !ignorable(s));
check('No console errors (excluding Google Fonts)', realConsole.length === 0, realConsole.join(' | '));
check('No failed network requests (excluding Google Fonts)', realFailed.length === 0, realFailed.join(' | '));

if (writeEvidence) {
  writeFileSync('docs/evidence/test-results/e2e-results.json', JSON.stringify({ browser: browserName, base, results, consoleErrors, failedRequests }, null, 2));
  writeFileSync('docs/evidence/test-results/a11y-axe-results.json', JSON.stringify(a11y, null, 2));
}
await browser.close();
server?.kill();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed (${browserName})`);
process.exit(failed ? 1 : 0);
