# SAL / Hooray — UX Spec Gap Analysis

Audit of the current app against `UX & Functional Spec`. No code changed in this pass (per spec §7.2).
Status legend: ✅ present · 🟡 partial · ❌ missing · ⚠️ conflict.

## Critical context: there is no backend

`server.js` is an Express **static file server** with a `/health` route. Nothing else.
There is no AI service, no email, no Monday.com integration, and no persistence layer.
The whole app runs on mock seed data in `src/data/*.js`.

**Consequence:** every `[SIM]` item in the spec ("real app sends the email", "writes the
Monday.com board status", "calls the actual AI/query backend", "persists and versions edits",
"note injected into AI drafting context") has nothing to wire to. These cannot be made "real"
without building/connecting backend services + credentials. See decision Q1.

Also: `docs/design-system.md` and `docs/reference/sal-prototype.jsx` referenced by the spec
do **not** exist in this repo. I worked from the two spec documents directly.

---

## §0 Product invariants (acceptance criteria)

| # | Invariant | Status | Notes |
|---|---|---|---|
| 0.1 | Human-in-the-loop; explicit sign-off before delivered | 🟡 | Sign-off action exists; but Edit not wired, Send-Back has no notes gate, and state isn't global (see §6.1). |
| 0.2 | Every anomaly flag carries an explanation | 🟡 | Platform chips show reasons; Trends chip uses a generic "breaks from baseline" string, not a real per-anomaly explanation. Tooltip title "Why flagged" vs spec "Why I flagged this". |
| 0.3 | Honest about missing data | 🟡 | Missing-data report renders inline amber, but there's no dedicated **exclusion panel** for excluded/compliance items, and Portfolio never hides clients (good). |
| 0.4 | Provenance on every AI answer | ✅ | Ask SAL responses render Sources block (platform, tier, data-as-of). |
| 0.5 | Audit trail (named user + timestamp on sign-off/send-back/edit) | 🟡 | Sign-off toast names actions but masthead shows no "Signed off by {user} · {time}"; no "Edited by {user}" marker; send-back note not shown verbatim. No current-user identity passed into Approvals. |

---

## §1 Information architecture

| # | Requirement | Status | Notes |
|---|---|---|---|
| 1.1 | Sidebar grouped under eyebrow heads: APP / SAL / NEXT | ⚠️ | Current sidebar is a **flat** list and includes extra views not in this spec: Data Sources, Anomalies & Opportunities, Signals Feed, Leadership. Spec only names Portfolio, Report Approvals, Ask SAL, Phase 2. See Q3. |
| 1.2 | VAULT status card in sidebar (synced count + awaiting count in amber) | ❌ | Not present. |
| 1.3 | Footer: current-user avatar, name, role | ✅ | RoleSwitcher does this. |
| 1.4 | Ask SAL = collapsible **right dock** (~380px) that reflows main, never overlays | ⚠️ | Currently Ask SAL is a **full nav view** replacing the main area. Converting to a docked panel is a real architectural change. See Q2. |
| 1.5 | Client detail drawer: right slide-in ~440px, scrim + Esc/scrim-click close | 🟡 | Drawer exists at **560px**, closes on scrim click but **no Esc handler**. |
| 1.6 | Phase 2 modal | ✅ | Present, locked stepper, single Close. |
| 1.7 | Toast stack bottom-right, auto-dismiss ~4s | 🟡 | Single toast (not a stack — new toast replaces old), auto-dismiss 5.5s, white card not dark ink (see Q4). |

---

## §2 Portfolio view

| # | Requirement | Status | Notes |
|---|---|---|---|
| 2.1 | 4 KPI tiles (clients, on-time %, anomalies+unresolved amber sub, hours recovered) | 🟡 | Tiles present; values [SIM] hardcoded from `LEADERSHIP`. "Anomalies" tile has no amber unresolved sublabel. |
| 2.2 | Live as-you-type search across name/collection/AM | ✅ | Works. Zero-result shows `No clients match "x"` — spec wants an explanatory recovery line (🟡 minor). |
| 2.3 | Client table: name + inline amber anomaly count, AM, tier pill (em dash when none), live status pill, chevron | 🟡 | No inline anomaly count on name; no chevron; TierBadge always renders (no em-dash-when-none). Status pill reads from **static** REPORTS, so it will **not** flip live on sign-off (❌ for the "shared state" requirement). |
| 2.4 | Drawer sections in order: report → sources → baselines → context note | 🟡 | Order differs (Properties, Baseline, Sources, Note, Report). Missing: delivery metadata for delivered, written reason for excluded/compliance, source data-as-of timestamps, "no sources" explanatory sentence. "Open in Approvals" deep-link ✅. |
| 2.4 | Context note save → toast "Context note saved. SAL uses it on the next draft." | 🟡 | Saves to local state + inline label; **no toast**; not persisted; not injected into drafting [SIM]. |
| 2.5 | Phase 2 teaser card at bottom + locked sidebar item → modal | 🟡 | Locked sidebar item ✅; no dashed teaser card at bottom of Portfolio. |

---

## §3 Report Approvals (core flow)

| # | Requirement | Status | Notes |
|---|---|---|---|
| 3.1 | Queue (~300px) + selected raised; selection persists | ✅ | Done; selected item highlighted; queue shows name/status. Queue lacks amber anomaly count. |
| 3.2 | Three item kinds: Report / Drafting panel / Excluded panel | ❌ | All statuses render the **full report**. No dedicated drafting panel (first-person status, complete/pending/ETA). No exclusion panel (what's missing, why publishing is wrong, staged data, "Send CSV Reminder" / "Notify me"). Data supports this: `status:'drafting'`, `missingData:[...]`. |
| 3.3 | Report doc structure (masthead, 01–04, footer) | 🟡 | Sections 01–04 present and well-structured. Masthead missing: serif **lede**, accent **signature strip**, "Pending sign-off by {AM}", "Data through {date}" framing, "Edited by you" marker. Footer provenance ✅ (one line under action bar). |
| 3.4 | **State machine** — Edit / Send Back / Sign Off | 🟡/❌ | **Edit**: button present, **no handler** — no edit mode, no editable textareas, no Save Edits, no "Edited by" (❌). **Send Back**: fires immediately — **no inline notes panel**, no non-empty gate, note not shown verbatim (🟡). **Sign Off**: flips status + toast, but **local only** (Portfolio/drawer don't update), and delivered state shows generic "No action required" instead of the delivered confirmation line + sign-off attribution (🟡). Send-back resolves on a 8s timer [SIM]. |
| 3.4 | Delivered ⇒ read-only; toast only on confirmed success; switching items resets transient state | 🟡 | Delivered is read-only ✅. Toast fires optimistically (no success gate, no backend) ⚠️. Per-item transient reset (edit mode / note text / panels) — N/A today, must hold once those exist. |
| 3.5 | Anomaly chips: amber pill + hover **and focus** tooltip "Why I flagged this" with baseline/onset/mechanism/threshold; positive anomalies flagged honestly | 🟡 | Hover+focus tooltip ✅; title wording differs; platform reasons come from data, but Trends tooltip is a generic sentence. Threshold/onset detail not consistently present. |

---

## §4 Ask SAL

| # | Requirement | Status | Notes |
|---|---|---|---|
| 4.1 | Header: title + contract line + close | 🟡 | Title + subtitle present; **no close** (it's a view, not a panel — see Q2). Contract wording differs. |
| 4.2 | Empty state: first-person capability statement naming connected platforms | 🟡 | Generic "Start with a suggested prompt." |
| 4.3 | 4–6 prompt chips, always visible, click submits | ✅ | Present. |
| 4.4 | Input: Enter/send submits; disabled when empty; **no double-submit while pending** | 🟡 | Empty disabled (button), but input stays enabled while typing — can double-submit during the pending window. |
| 4.5 | Response: narrative → numeric grid → sources block | ✅ | Shape correct. |
| 4.6 | Unanswerable: name what it CAN query + suggest client+metric; never fabricate | 🟡 | Freeform returns a "prototype only" message rather than the spec's capability+suggestion response. |
| 4.7 | Auto-scroll to newest; open/closed persists across view switches | 🟡 | Auto-scroll ✅; persistence N/A as a view. |
| 4.8 | [SIM] keyword-matched canned answers ~900ms → real backend | 🟡 | Canned answers via `ASK_SAL_PROMPTS`; no real backend (Q1). |

---

## §5 Toasts

| # | Requirement | Status | Notes |
|---|---|---|---|
| 5.1 | Bottom-right **stack**, dark ink bg, accent icon, 1 sentence, ~4s, stack vertically | ⚠️ | Single toast (replaces, no stack), **white card** (design-system pass made it white), 5.5s. Conflict with this spec's "dark ink background" — see Q4. |
| 5.2 | Confirm completed facts only; error toast on failure | 🟡 | Copy is past-tense ✅; but no failure path exists (no backend), so "toast only after success" is unverifiable today. |

---

## §6 Cross-cutting

| # | Requirement | Status | Notes |
|---|---|---|---|
| 6.1 | **Live shared status state** across table/drawer/queue/report bar | ❌ | **Biggest gap.** Status lives in two places: static `REPORTS` (Portfolio/drawer) and local `reportStates` (Approvals). A sign-off in Approvals does not propagate. Spec §7.3 makes this the first implementation pass. |
| 6.2 | Esc closes drawer/modal; Tab reachable + accent focus ring; tooltips on focus; toast `aria-live=polite`; icons aria-hidden | 🟡 | Focus ring ✅ (global); tooltips on focus ✅; **no Esc handlers**; **no aria-live** on toast; icon aria-hidden inconsistent. |
| 6.3 | Motion: fade-up mount, drawers/modals ≤300ms, spinners only in-progress, reduced-motion | ✅ | fade-up + reduced-motion in place; modal/drawer animate. |
| 6.4 | Desktop-first ≥1280px; never crush report column; Ask SAL becomes overlay if no space | ⚠️ | Depends on Q2 (dock vs view). |

---

## Decisions needed before implementation (spec §7.3)

- **Q1 — [SIM] handling.** No backend exists. Keep all [SIM] items simulated (client-side state + timers, demo-faithful) **or** build/connect real services (AI query, email, Monday.com, persistence)?
- **Q2 — Ask SAL architecture.** Convert to the spec's collapsible right dock (reflows main), or keep it as the current full nav view?
- **Q3 — Sidebar IA & extra views.** Spec names only Portfolio / Approvals / Ask SAL / Phase 2. The app also has Data Sources, Anomalies, Signals, Leadership. Restructure into APP/SAL/NEXT groups and keep extras in their own group, or hide extras to match the spec exactly?
- **Q4 — Toast styling conflict.** This spec says dark-ink toast; the earlier design-system pass produced a white-card toast. Which wins?

## Proposed implementation order (once decided), per §7.3

1. **Shared status state** (lift report state to App/context; Portfolio, drawer, queue, report bar all read it). Unblocks 2.3, 3.4, 6.1.
2. **Portfolio** — table anomaly count + chevron + em-dash tier; drawer reorder + delivery/exclusion/no-sources states; context-note toast; teaser card; zero-result recovery.
3. **Approvals** — three item kinds (drafting/exclusion panels); masthead lede/signature/attribution; Edit mode + Save Edits; Send-Back notes panel w/ verbatim note; Sign-Off attribution + delivered confirmation line + (success-gated) toast; anomaly tooltip wording/threshold.
4. **Ask SAL** — (per Q2) dock/overlay; empty + unanswerable copy; double-submit lock; "Querying the Vault" indicator.
5. **Toasts/teaser/a11y** — stack + (per Q4) styling + ~4s; aria-live; Esc handlers; icon aria-hidden.
