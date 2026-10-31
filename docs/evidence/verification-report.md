# ICRAF Verification Report

Date: 2026-10-31 · Branch: `claude/gallant-ramanujan-f2fveo` · Node 22.23.4 / npm 10.9.9 · Chromium 1243 via Playwright 1.63.0 (headless, Linux sandbox)

This report covers two passes: the initial audit (section 2, round 1) and the follow-up remediation of everything the first pass left open (round 2).

## 1. Scope and methodology

React 19 + TypeScript 5.8 + Vite 6 single-page app, no backend. Method: read all source and docs, baseline build, run dev server and production preview, fix defects, add tests, drive the **production build** with Playwright (`scripts/e2e.mjs`, 39 checks, desktop 1440×900 and mobile 390×844), run axe-core on every view in light and dark mode, capture screenshots, update docs. Every claim below is backed by a log under `docs/evidence/`.

## 2. Issues found and fixed

### Round 1 (initial audit)
| # | Issue | Fix |
|---|---|---|
| 1 | Verifier `fetch('/samples/…')` only worked under the dev server; broken in production builds | Samples bundled via `?raw` imports |
| 2 | Runtime dependency on Tailwind CDN + `aistudiocdn` import map + missing `/index.css` | Tailwind bundled via PostCSS |
| 3 | CI-log parser dropped the `Pattern:` finding (4 of 5 reported) | Parser fixed, regression test |
| 4 | PASS state unreachable (passing fixtures fetched but unused) | Failing/Passing scenario switch |
| 5 | Light-mode contrast in Verifier | Light/dark variants |
| 6 | Docs described features/scripts that did not exist | Corrected |
| 7–8 | Unused `GEMINI_API_KEY` injection; no scripts; lockfile ignored | Removed / added / tracked |

### Round 2 (remaining issues)
| # | Previously open item | Resolution |
|---|---|---|
| A | No CMMC tracker UI | **New view** `components/CmmcTracker.tsx`: 14 domains, 110 practices (17 Level 1), search/domain/level/status filters, self-reported statuses persisted in `localStorage` (sanitised on load), Level 1/Level 2/per-domain readiness, links to 3 verifier controls as supporting evidence |
| B | `CMMC-MAPPING.md` said "17 domains" (and 15 L1 practices) | Rewritten from `data/cmmcPractices.ts`: **14 domains**, per-domain counts match NIST SP 800-171r2 (AC 22, AT 3, AU 9, CM 9, IA 11, IR 3, MA 6, MP 9, PS 2, PE 6, RA 3, CA 4, SC 16, SI 7 = 110), 17 Level 1 practices. Counts are asserted by unit tests. Requirement text is condensed from NIST; the doc says to verify against official sources |
| C | No linter | ESLint 10 flat config (typescript-eslint, react-hooks); 29 initial errors fixed (incl. unused imports, `any`, effect-driven setState in Verifier → `useMemo`, `preserve-caught-error`) |
| D | Kubernetes verifier was regex-based | Replaced with `js-yaml` parsing: real container names, `initContainers`, `CronJob`/`Job`/`StatefulSet`/`DaemonSet`/`ReplicaSet`/`Pod`, template annotations, clear error on invalid YAML |
| E | No upload UI | Verifier "Verify your own artifacts": file inputs for Terraform JSON, K8s YAML, CI log (local only, 2 MB cap, revert button, error banner). Terraform verifier now walks `child_modules` and validates plan shape |
| F | Single 657 kB chunk | Views lazy-loaded; largest chunk now 361 kB (Dashboard/Recharts), initial entry 238 kB; Vite size warning gone |
| G | Playwright not a declared dependency | `playwright@1.63.0` + `axe-core` in devDependencies; `npm run test:e2e` builds, serves and runs; script starts its own preview server |
| H | No accessibility audit | axe-core (WCAG 2.0/2.1 A+AA + best-practice) on 7 views × light/dark. First run found real defects, all fixed: low-contrast status colours in light mode, icon-only slide dots without names, icon-only sidebar links with hidden labels, theme toggle accessible name ≠ visible text, non-keyboard-operable sortable headers (now buttons with `aria-sort`), non-focusable scroll regions, white-on-yellow score badges |
| I | Mock-data accuracy unverified | Found and fixed a **real bug**: RACI table columns were rendered with `Object.values(row)`, so roles appeared under the wrong headers. Now uses explicit column order (e2e asserts cell values). Also: "Open Critical Risks" and "Control Coverage" KPIs are now derived from the risk register/CSF data (they contradicted it), "Recent High-Severity Incidents" renamed (it listed Medium incidents), RACI chart no longer clipped at 1440px, UI labelled "sample data", stale "© 2024" removed. Integrity tests added |
| J | `npm audit` | 0 vulnerabilities, including dev tooling (Vitest 5, ESLint 10; `minimatch` pinned to ^11 via `overrides` to clear an advisory in the ESLint tree) |

## 3. Commands and results (clean `npm ci`)

| Check | Command | Result | Log |
|---|---|---|---|
| Install | `npm ci` | PASS | `build-results/npm-ci.log` |
| Audit | `npm audit` | PASS, 0 vulnerabilities | `build-results/npm-audit.log` |
| Lint | `npm run lint` | PASS, 0 errors/warnings | `build-results/lint.log` |
| Type check | `npm run typecheck` | PASS | `build-results/typecheck.log` |
| Unit tests | `npm test` | PASS, 19/19 | `test-results/unit-tests.log` |
| Build | `npm run build` | PASS, no warnings | `build-results/build.log` |
| Dev server | `npm run dev` | PASS (HTTP 200; e2e 38/38 at the time of the check, before one more test was added) | – |
| E2E on production build | `node scripts/e2e.mjs` | PASS, 39/39 | `test-results/e2e.log`, `e2e-results.json` |
| Accessibility | in e2e | PASS: 14 axe scans, 0 violations of any impact, 492 rule passes | `test-results/a11y-axe-results.json` |
| Firefox / WebKit | `BROWSER=firefox node scripts/e2e.mjs` | **NOT RUN** – see §6 | – |

Regression proof (round 1): reverting the CI-log parser fix makes its test fail (4 ≠ 5).

## 4. Workflows verified (e2e, production build)

Dashboard (KPIs, incident table, radar) · Verifier: failing and passing scenarios, details, secret masking, **upload of a clean CI log flips CTRL-003 to PASS**, **invalid Terraform JSON shows an error banner without crashing**, **uploaded plan with child modules is analysed** · CMMC Tracker: 110 rows, domain filter (AC → 22), Level 1 filter (17), search by NIST number, status change updates Level 2 (1%) and Level 1 (6%) readiness, **persists across reload**, Reset all · Governance: header order and RACI cell values for two activities, no horizontal clipping · Risk Register sort asc/desc, **keyboard (Enter) operable** · Project Plan (7 tasks) · Executive Deck next-slide · dark-mode toggle · mobile 390px: no page-level horizontal overflow on Dashboard, Verifier, CMMC Tracker · no unexpected console errors, no failed requests.

## 5. Screenshots (`docs/evidence/screenshots/`, from the running production build)

| File | Demonstrates |
|---|---|
| `dashboard-desktop.png`, `dashboard-dark.png`, `dashboard-mobile.png` | Dashboard light, dark, 390px |
| `cmmc-tracker.png`, `cmmc-tracker-dark.png`, `cmmc-mobile.png` | CMMC Tracker (captured with one practice marked Implemented, hence 1%/6%) |
| `verifier-failing-details.png`, `verifier-passing.png`, `verifier-mobile.png` | Verifier states |
| `verifier-upload-custom-log.png`, `verifier-upload-error.png` | Uploaded artifact accepted; invalid upload handled |
| `governance-desktop.png` | Corrected RACI chart |
| `risk-register-sorted.png`, `project-plan-desktop.png`, `executive-deck.png` | Respective views |

Screenshots show front-end behaviour only. There is no backend; no integration with SIEM/ITSM/GRC exists or is claimed.

## 6. Remaining limitations (not resolved, and why)

- **Firefox and WebKit not tested.** `npx playwright install firefox webkit` failed: the environment's network policy blocks the Playwright browser download host (`cdn.playwright.dev`). The e2e script supports `BROWSER=firefox|webkit`; run it where those browsers can be installed. To enable here, add that host under Allowed domains in the environment's network settings. Chromium is the only engine verified.
- **No real integrations or backend.** SIEM/ITSM/GRC integration, authentication and persistence beyond `localStorage` are roadmap items that require external systems; dashboard, incident, risk, RACI and project-plan content remain **sample data** (now labelled and internally consistent, but not real).
- **CMMC data caveats.** Requirement text is condensed from NIST SP 800-171r2 and written from knowledge, not copied from the official CMMC Assessment Guides; counts and identifiers are test-verified internally, but wording should be reviewed against official sources before use in a real assessment. Level 3 (NIST SP 800-172) is not covered. Statuses are self-reported and stay in one browser.
- **Verifier scope.** Three controls only; each check is a heuristic (e.g. K8s: digest/tag/registry/signature-annotation rules; CI: parses detect-secrets-style log output, not source code).
- **Accessibility:** automated axe checks only (they catch roughly a third to a half of WCAG issues); no manual screen-reader or keyboard-only review beyond the checks listed.
- Inter loads from Google Fonts (system fallback offline).

## 7. Final status: **PARTIAL PASS**

All items that could be fixed inside this repository and environment are fixed and verified: lint, types, 19 unit tests, build, 39 e2e checks, and 0 axe violations all pass on a clean install. The status stays PARTIAL for two reasons: cross-browser verification could not run (blocked download host), and the application remains a sample-data prototype without real integrations.
