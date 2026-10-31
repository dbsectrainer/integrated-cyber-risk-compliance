# ICRAF Verification Report

Date: 2026-10-31 · Branch: `claude/gallant-ramanujan-f2fveo` · Node 22.23.4 / npm 10.9.9 · Chromium via Playwright (headless, Linux sandbox)

## 1. Scope and methodology

Full audit of the repository (React 19 + TypeScript 5.8 + Vite 6 single-page app, no backend). Steps: read all source/docs → baseline `tsc`/`vite build` → run dev server and production preview → fix defects → add unit tests → drive the **production build** with Playwright (`scripts/e2e.mjs`) on desktop (1440×900) and mobile (390×844) → capture screenshots → update docs. The app is client-only: there are no API/database integrations to verify.

## 2. Initial issues found

| # | Severity | Issue | Evidence / root cause |
|---|---|---|---|
| 1 | High | **Verifier broken in production builds.** It `fetch()`ed `/samples/...` from the repo root; this only works under the Vite dev server, since `samples/` is not in `public/` and not copied to `dist/`. Production would get HTML/404 and show an empty table. | `components/Verifier.tsx` (original), `dist/` contained no samples |
| 2 | High | **Runtime dependency on third-party CDNs.** Styling relied on `cdn.tailwindcss.com` (Play CDN, not for production), plus an import map pointing React/Recharts at `aistudiocdn.com`, and a link to a non-existent `/index.css`. In this sandbox both CDNs return 403, so the app would be unstyled. | `index.html`; build warning "`/index.css` doesn't exist at build time" |
| 3 | Medium | **CI-log verifier dropped a finding.** Fixture lists 5 secrets; parser reported 4 (the "Private Key" finding uses `Pattern:` not `Secret:`; block-end detection also ignored the log-line prefix). Under-reporting in a compliance tool. | New regression test failed on the original code (expected 5, got 4) |
| 4 | Medium | **Verifier could only ever show failing samples** (passing fixtures were fetched and discarded), so PASS state was unreachable; compliance always 0%. | original `runVerifications` |
| 5 | Medium | **Light-mode contrast.** Severity/framework badges and finding panels used dark-theme-only colours (`text-red-400` on `bg-red-900/50`) – near-unreadable on white. | screenshot review |
| 6 | Medium | **Documentation claims not backed by code.** README/RUNBOOK describe a "CMMC Tracker" view/tab (none exists), "17 CMMC domains" (official model: 14; the listing in README names 15), `npm start` (no such script), and a `public/samples` workaround. | grep: no CMMC component in `components/`; `package.json` scripts |
| 7 | Low | Unused `process.env.GEMINI_API_KEY` injection in `vite.config.ts` (leaks any local env key into the bundle; feature unused). | `vite.config.ts` |
| 8 | Low | No test, typecheck, or lint scripts; `package-lock.json` git-ignored (non-reproducible installs). | `package.json`, `.gitignore` |
| 9 | Info | Main JS chunk 657 kB (no code splitting). | build output |

## 3. Fixes implemented

1. Tailwind 3.4 now bundled via PostCSS (`tailwind.config.js`, `postcss.config.js`, `index.css`); CDN script and import map removed from `index.html` (#2).
2. Verifier imports samples with Vite `?raw` (bundled), adds Failing/Passing scenario switch and an error banner for per-control failures (#1, #4). Added `vite-env.d.ts`.
3. `verifiers/ciLogsVerifier.ts`: finding-header regex `Finding N:`, accept `Pattern:` lines, strip log prefix when detecting block end (#3).
4. Light/dark colour variants for Verifier badges and panels (#5).
5. Removed unused env injection from `vite.config.ts` (#7).
6. Added `typecheck`, `test`, `check` scripts; Vitest 5.0.5 (3.x had critical advisories in `tinypool`); `package-lock.json` un-ignored (#8).
7. README/RUNBOOK corrected: CMMC UI documented as not implemented, `npm run dev`, troubleshooting rewritten, known limitations listed, screenshots added (#6).
8. Added `tests/verifiers.test.ts` (8 tests) and `scripts/e2e.mjs`.

## 4. Commands and results

| Check | Command | Result | Log |
|---|---|---|---|
| Clean install | `npm ci` | PASS | `build-results/npm-ci.log` |
| Dependency audit | `npm audit` | PASS – 0 vulnerabilities | `build-results/npm-audit.log` |
| Type check | `npm run typecheck` | PASS | `build-results/typecheck.log` |
| Unit tests | `npm test` | PASS – 8/8 | `test-results/unit-tests.log` |
| Production build | `npm run build` | PASS (one >500 kB chunk warning) | `build-results/build.log` |
| Dev server | `npm run dev` | PASS – HTTP 200 on :3000; e2e also run against it, 18/18 | – |
| E2E on production artifact | `npm run preview -- --port 4173` + `node scripts/e2e.mjs` | PASS – 18/18 checks | `test-results/e2e.log`, `e2e-results.json` |
| Lint | – | **NOT RUN** – no ESLint configured | – |

Regression proof: reverting `ciLogsVerifier.ts` to the original makes `reports every finding listed in the failing log` fail (4 ≠ 5); restoring the fix passes.

## 5. Workflows verified (e2e, production build)

Dashboard renders (KPIs, 5 incidents, radar chart, bundled Tailwind styles) · Verifier lists 3 controls; failing scenario → 3 failed; CTRL-003 details show all 5 findings; secrets masked in DOM · Passing scenario → 3 passed / 100% · Governance renders RACI table · Risk Register default sort (score desc) and click-to-reverse · Project Plan renders · Executive Deck next-slide changes slide · Dark-mode toggle sets `html.dark` · Mobile 390px: no page-level horizontal overflow · No console errors and no failed/4xx requests.

## 6. Screenshots (`docs/evidence/screenshots/`, from the running production build)

| File | Demonstrates |
|---|---|
| `dashboard-desktop.png` | Dashboard KPIs, incident table, NIST CSF radar, styling from bundled CSS |
| `dashboard-dark.png` | Dark theme |
| `dashboard-mobile.png` | Mobile layout (icon-only sidebar, stacked cards) |
| `verifier-failing-details.png` | Verifier with failing samples, CTRL-003 details expanded (light-mode badges readable) |
| `verifier-passing.png` | Verifier with passing samples (PASS state, 100%) |
| `verifier-mobile.png` | Verifier at 390px |
| `governance-desktop.png`, `project-plan-desktop.png`, `executive-deck.png`, `risk-register-sorted.png` | Respective views / ascending sort |

Screenshots prove front-end rendering and verifier logic running in the browser against bundled sample files. There is no backend; nothing is claimed about SIEM/ITSM/GRC integration.

## 7. Remaining issues / limitations

- **CMMC tracker UI is not implemented** (README now says so). `CMMC-MAPPING.md` still says "17 domains"; the official CMMC 2.0 Level 2 model has 14 domains – needs subject-matter review, not changed here.
- All dashboard data is mock; Governance/Project Plan/Executive Deck were checked for rendering only, not for content accuracy.
- Verifier operates on bundled samples only (no upload UI); Kubernetes verifier is regex-based and unit-tested only against the two sample files.
- No ESLint; bundle is 657 kB unsplit.
- Inter is loaded from Google Fonts; no font request failures were recorded in the e2e run (`failedRequests` is empty), but the app has a system sans-serif fallback if offline. The e2e script ignores font hosts in its network check.
- E2E uses a sandbox-preinstalled Playwright; it is not a declared devDependency.
- Cross-browser testing (Firefox/Safari) not performed; accessibility not audited beyond role/name-based selectors.

## 8. Final status: **PARTIAL PASS**

Everything that exists in the app installs, builds, runs, and passes its tests and e2e checks; the defects found were fixed with evidence. PARTIAL because the advertised CMMC tracker does not exist, lint is not configured, and data/integrations are mock.
