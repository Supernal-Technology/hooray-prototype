# SAL Dashboard — Context Handoff (resume here)

Prototype for **Hooray Agency** (SAL = their "AI employee"). Live demo for stakeholders
**Stephen Seghers & Randy Stuck**; product owners **David Metze & Roger Burns**; Supernal
side **Nick Agresti**. Next live demo: **Tue (their cadence)**. Read this top-to-bottom.

## Where things live
- **Code (source of truth):** `/Users/jaime/client-demos/sal-dashboard` (part of the `client-demos` monorepo). Repo: `Supernal-Technology/client-demos`, branch `main`.
- **Live demo (GitHub Pages):** https://supernal-technology.github.io/hooray-prototype/
  - Separate public repo `Supernal-Technology/hooray-prototype`. It is a **manual mirror** of `sal-dashboard/`. We sync it on every "push to prod" (see Deploy).
- **Dev server:** `cd /Users/jaime/client-demos/sal-dashboard && npm run dev` → http://localhost:5173/ (Vite, hot-reload).
- **`gh` is authed as `formanti`** (push access to both repos; admin on `hooray-prototype`, NOT on `client-demos`).
- **Source material (the real Hooray report + proposal context):** `/Users/jaime/Desktop/Proposals Supernal/Proposal Hooray/` — esp. `Sample Report - Hooray.pdf` (the real Web & Media Overview deck), `ACTION-PLAN-post-debrief.md`, `PRD-SAL-Dashboard.md`, the two meeting transcripts pasted into chat.

## Deploy = "push to prod" runbook (do exactly this)
1. `cd /Users/jaime/client-demos/sal-dashboard && npx vite build` (sanity).
2. `cd /Users/jaime/client-demos && git add sal-dashboard/` (NEVER stage `.gstack/`), commit, `git push origin main`.
3. Sync the public mirror + deploy:
   ```
   rm -rf /tmp/hp && git clone -q https://github.com/Supernal-Technology/hooray-prototype.git /tmp/hp
   rsync -a --delete --exclude node_modules --exclude dist --exclude .git --exclude .github \
     --exclude railway.json --exclude nixpacks.toml --exclude server.js \
     /Users/jaime/client-demos/sal-dashboard/ /tmp/hp/
   cd /tmp/hp && git add -A && git -c user.name=formanti -c user.email=jaime.garcia@getsupernal.ai commit -q -m "Sync: ..." && git push origin main
   ```
4. Watch: `gh run watch $(gh run list --repo Supernal-Technology/hooray-prototype --limit 1 --json databaseId --jq '.[0].databaseId') --repo Supernal-Technology/hooray-prototype --exit-status`
5. Verify: `curl` the URL + grep the bundle for a new string.
- The mirror's Pages workflow auto-enables Pages via the Actions token (`actions/configure-pages enablement:true`). The monorepo has **no** Pages workflow (we deleted it; it kept failing because Pages can't be enabled there without org admin — that was the source of the "deploy failed" emails. Don't re-add it.)
- **Railway** (`sal-dashboard-production.up.railway.app`) exists but does NOT auto-deploy (service isn't wired to GH). We don't use it. Pages is the live link.

## Hard conventions (do NOT break)
- **ZERO em dashes** anywhere. After any copy edit, purge with the node one-liner:
  `node -e 'const fs=require("fs"),p=require("path");const E=String.fromCharCode(0x2014);(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const q=p.join(d,e.name);if(e.isDirectory())w(q);else if(/\.(jsx?|css)$/.test(e.name)){let s=fs.readFileSync(q,"utf8");if(s.includes(E)){fs.writeFileSync(q,s.replace(new RegExp(" *"+E+" *","g"),", ").replace(new RegExp(E,"g"),"-"))}}}})("src")'`
  then `grep -rc "—" src/ | grep -v ":0"` should print nothing. (The `·` middot in bylines/banner is fine; en dashes in ranges left as-is.)
- **Design system is strict:** warm palette, chartreuse accent family, **amber ONLY for warnings/attention**, Lora (serif, big numerals) + Inter + JetBrains Mono (data). Cards = white, hairline border, NO resting shadow. No blue/purple/teal anywhere. Tokens in `tailwind.config.js` + `src/index.css` `:root`.
- All data is **simulated**; banner says so. No backend.

## Architecture (key files)
- `src/App.jsx` — top strip with **Client view / AM view** toggle (client is default/hero). Both shells stay mounted (state preserved). Dismissible "directional prototype" banner. `ReportsProvider` wraps everything.
- `src/state/reportsStore.jsx` — shared report status + **account-access scoping** (`inScope`, `currentUser`, `pendingCount`). Sign-off/send-back/edit live here ([SIM]).
- **Client view** `src/views/ClientView.jsx` — left nav (Dashboard / Reports{Monthly Report, History}) + main + shared chat dock. Monthly Report = tabs **Summary · Website · Paid Search · Social · Display · Media Mix**, summary-forward, KPI grids (YoY-colored), bar charts, tables, benchmarks, Key Takeaways, This-month/YTD toggle. Hero client = **South Coast Winery** (matches the real deck).
- `src/data/clientReport.js` — ALL the client report data (South Coast Winery, real numbers from the deck) + per-section chat questions/overviews. **Edit data here to redirect, not components.**
- **Chat:** `src/components/ChatPanel.jsx` (section-aware: auto-posts an "Overview" when a section opens, suggested-questions **dropdown** swaps per section) wrapped by `src/components/ChatDock.jsx` (collapsible right rail + full-screen expand). **Used by BOTH** client and AM views (same style). AM uses `AM_CHAT` (cross-client) from `src/data/askSal.js`.
- **AM view** (in `App.jsx` AMShell) — sidebar groups: **App** (Portfolio, Reporting, Genome) · **Signals** (Insights, Anomalies) · **Next** (SAL Expands/Phase 2). Plus the Genome status card + "View as" person switcher.
  - `Portfolio.jsx` (roster table, KPIs under "Pulse · account health", client drawer), `ReportApprovals.jsx` (queue + state machine via shared `ReportArticle.jsx`), `DataSources.jsx` (the **Genome** matrix), `Anomalies.jsx` (=**Insights**: recommendations + opportunities), `SignalsFeed.jsx` (=**Anomalies**: flags feed).
- `src/data/people.js` — 4 "View as" people: **Steven Seghers & Randy Stuck = Partners (all accounts)**; **Tracey McRae & Rocio Woods = Account Directors (scoped books)**. `managerForClient()` = the director shown in the AM "Account Manager" column.
- `src/data/clients.js` — 11 real roster clients: Salamander Collection, **Genting Worldwide**, Preferred Hotels & Resorts, Pebblebrook Hotel Trust, **St. Regis**, Kwame Onwuachi Restaurants, Starwood/Marriott International (hospitality) + Pfizer, Providence Healthcare, Thales Avionics, Sony (non-hospitality, invented). IDs kept stable; reports/signals/sources keyed to them.
- `src/data/sources.js` — Genome connections. **Cendyn was removed and replaced by Prophit** (CHM Warnick product) which shows as a connectable "Connect" source for a few clients.

## Naming locked in
- Data layer = **Genome** (Hooray's internal name; the nav item, the page, the status card, "Querying the Genome", chat subtitle "Answers from the Genome").
- AM nav: **Reporting** (was Report Approvals), **Insights** (recommendations/opportunities), **Anomalies** (flags feed), **Genome** (data sources).
- Phase 2 modal = **"SAL Expands: From Reporting to Strategy"** — richer signal (news/weather/economics + Smith Travel), deeper strategy ("golden egg"), client self-serve + Pulse.

## What's DONE (live in prod)
Editorial design system; Client/AM modes; shared section-aware Ask SAL drawer (dock + full-screen) in both views; client monthly report faithfully mirroring the real deck (6 tabs, KPI grids, revenue bars, campaign/media tables, benchmarks, takeaways, YTD/month toggle, Top Pages/Referrals on Website); Dashboard (live) + History; real client roster + director scoping + Pulse framing; Genome with Prophit; report column reframed (centered max-w-6xl, no right-void); zero em dashes.

## PENDING / next ideas (not yet done)
- **South Coast Winery is the client-portal hero but is NOT in the AM roster** → Client↔AM toggle is slightly incoherent. Consider adding it to `clients.js` (+ a director's scope) so the AM "manages" the same client the portal logs in as.
- The **AM-side reports** (`reports.js`, the 4-section approval reports) are still the older/lighter format, NOT the rich client report. Could unify so the AM reviews the same recap the client sees.
- **Deeper, data-grounded recommendations** (Roger: "you have 20% more impression-share opportunity, from Google Ads not the AM") — partially in Paid Search answers; could push report-wide.
- Real **period switching** (April/May/etc.) is stubbed; **persistent chat memory** noted as future.
- Social/Display are their own tabs already; "Top Referring Sources" table only added on Website implicitly (Top Pages is in; referrals table optional to add).
- Prophit could show as a real connected source (currently "available/Connect" only).

## Gotchas
- The headless **browse tool cold-starts often** (blank screenshots / `about:blank`). Run the whole flow in ONE bash call, `$B status; sleep 2` to warm it, and trust JS `innerText`/build over flaky screenshots. Eyebrow labels are CSS-uppercased, so case-sensitive text checks miss them.
- Keep edits visual/data-only per pass; build after each (`npx vite build`).
