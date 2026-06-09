// Per-client × platform monthly performance. 6 months of history ending May 2026.
// One row per (client, platform, month). Numbers are realistic-feeling but mocked.

const MONTHS = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05']

// Helper to nudge a value with month-over-month drift.
const drift = (base, pct) => Math.round(base * (1 + pct) * 100) / 100

// Hand-tuned scenarios per client so each report tells a different story.
const SCENARIOS = {
  salamander: {
    gads:  { spend: 32000, roas: 6.4, cpc: 1.65, conv: 540, impr: 1820000, reach: 720000, drifts: [0, .02, -.03, .04, -.06, -.18] }, // big May ROAS drop = anomaly
    meta:  { spend: 18500, roas: 5.2, cpc: 1.20, conv: 380, impr: 2100000, reach: 1080000, drifts: [0, .04, .03, .02, .05, .09] }, // Meta strong
    ga4:   { sessions: 240000, bookings: 1820, drifts: [0, .03, -.01, .02, -.04, .01] },
  },
  'resorts-world': {
    gads:  { spend: 45000, roas: 5.1, cpc: 2.10, conv: 720, impr: 3200000, reach: 1450000, drifts: [0, .01, .02, .04, .03, .05] },
    meta:  { spend: 28000, roas: 4.6, cpc: 1.80, conv: 510, impr: 4200000, reach: 2100000, drifts: [0, .02, -.01, .03, .02, .02] },
    ga4:   { sessions: 480000, bookings: 3210, drifts: [0, .03, .02, .04, .03, .04] },
  },
  curator: {
    gads:  { spend: 26000, roas: 4.8, cpc: 1.92, conv: 410, impr: 1650000, reach: 690000, drifts: [0, -.01, .02, .04, .02, -.02] },
    meta:  { spend: 14500, roas: 4.4, cpc: 1.55, conv: 290, impr: 1840000, reach: 920000, drifts: [0, .03, .04, .02, .03, .02] },
    ga4:   { sessions: 320000, bookings: 2410, drifts: [0, .02, .03, .04, .01, .02] },
  },
  'aqua-aston': {
    gads:  { spend: 22000, roas: 5.6, cpc: 1.45, conv: 480, impr: 1920000, reach: 810000, drifts: [0, -.04, -.02, .12, .14, .08] }, // spring spike
    meta:  { spend: 12500, roas: 4.9, cpc: 1.30, conv: 310, impr: 1620000, reach: 740000, drifts: [0, -.02, .03, .07, .09, .05] },
    ga4:   { sessions: 215000, bookings: 1610, drifts: [0, -.03, -.01, .08, .10, .04] },
  },
  'marcus-pfister': {
    gads:  { spend: 9500, roas: 4.2, cpc: 2.35, conv: 145, impr: 720000, reach: 290000, drifts: [0, .02, .03, .01, .02, .03] },
    meta:  { spend: 5500, roas: 3.8, cpc: 1.90, conv: 95, impr: 580000, reach: 230000, drifts: [0, .01, .04, .02, .03, .02] },
    ga4:   { sessions: 92000, bookings: 580, drifts: [0, .02, .03, .04, .02, .02] },
    // Trade Desk CSV not yet received — intentionally absent.
  },
  timbers: {
    gads:  { spend: 18500, roas: 7.2, cpc: 1.85, conv: 240, impr: 920000, reach: 380000, drifts: [0, .04, .05, .02, .03, .04] },
    meta:  { spend: 9500, roas: 6.1, cpc: 2.10, conv: 145, impr: 680000, reach: 280000, drifts: [0, .02, .03, .04, .02, .03] },
    ga4:   { sessions: 76000, bookings: 380, drifts: [0, .03, .04, .02, .03, .04] },
  },
  'balboa-bay': {
    gads:  { spend: 14500, roas: 5.8, cpc: 1.70, conv: 295, impr: 1180000, reach: 540000, drifts: [0, .02, .03, .04, .02, .03] },
    meta:  { spend: 8500, roas: 5.0, cpc: 1.55, conv: 195, impr: 980000, reach: 420000, drifts: [0, .03, .02, .04, .05, .04] },
    ga4:   { sessions: 142000, bookings: 1140, drifts: [0, .02, .03, .04, .03, .03] },
  },
  'alila-ventana': {
    gads:  { spend: 26000, roas: 8.1, cpc: 2.85, conv: 175, impr: 720000, reach: 295000, drifts: [0, .03, .02, .04, .06, .05] },
    meta:  { spend: 0, roas: 0, cpc: 0, conv: 0, impr: 0, reach: 0, drifts: [0,0,0,0,0,0], note: 'Tier 2 — Meta managed by client' },
    ga4:   { sessions: 48000, bookings: 165, drifts: [0, .02, .03, .04, .03, .03] },
  },
  'the-guild': {
    gads:  { spend: 6800, roas: 4.5, cpc: 1.55, conv: 110, impr: 540000, reach: 220000, drifts: [0, .02, .03, .04, .02, .03] },
    meta:  { spend: 3200, roas: 4.1, cpc: 1.40, conv: 70, impr: 380000, reach: 180000, drifts: [0, .01, .03, .04, .02, .02] },
    ga4:   { sessions: 58000, bookings: 320, drifts: [0, .02, .03, .04, .03, .03] },
  },
  'mauna-kea': {
    gads:  { spend: 21000, roas: 6.9, cpc: 2.20, conv: 220, impr: 880000, reach: 350000, drifts: [0, .03, .04, .02, .03, .04] },
    meta:  { spend: 9500, roas: 5.8, cpc: 1.85, conv: 135, impr: 720000, reach: 310000, drifts: [0, .02, .03, .04, .03, .03] },
    ga4:   { sessions: 92000, bookings: 540, drifts: [0, .03, .04, .02, .03, .03] },
  },
}

function buildPerf() {
  const rows = []
  for (const [clientId, platforms] of Object.entries(SCENARIOS)) {
    for (const [platformShort, base] of Object.entries(platforms)) {
      const platformId =
        platformShort === 'gads' ? 'gads'
        : platformShort === 'meta' ? 'meta'
        : platformShort === 'ga4' ? 'ga4'
        : platformShort
      MONTHS.forEach((month, i) => {
        const d = base.drifts[i] ?? 0
        if (platformId === 'ga4') {
          rows.push({
            clientId, platformId, month,
            sessions: Math.round(base.sessions * (1 + d)),
            bookings: Math.round(base.bookings * (1 + d)),
          })
        } else {
          rows.push({
            clientId, platformId, month,
            spend: drift(base.spend, d),
            roas: drift(base.roas, d),
            cpc: drift(base.cpc, d * -0.5),
            conversions: Math.round(base.conv * (1 + d)),
            impressions: Math.round(base.impr * (1 + d)),
            reach: Math.round(base.reach * (1 + d)),
            note: base.note,
          })
        }
      })
    }
  }
  return rows
}

export const PERIODS = MONTHS
export const CURRENT_PERIOD = '2026-05'
export const PRIOR_PERIOD = '2026-04'
export const PERFORMANCE = buildPerf()

export function perfFor(clientId, platformId, month) {
  return PERFORMANCE.find((r) => r.clientId === clientId && r.platformId === platformId && r.month === month)
}

export function hospitalityFor(clientId, month) {
  // Synthetic RevPAR/ADR/occupancy derived from baseline with small monthly drift.
  // Centralized so each report card stays consistent.
  return null
}

// Hospitality metrics per client per month (deterministic drift over baseline).
const HOSP_DRIFTS = [0, .02, .03, .05, .04, .03]

export const HOSPITALITY = (() => {
  const out = []
  // Import is lazy to avoid circular; consumers should call buildHospitality with CLIENTS.
  return out
})()

export function buildHospitality(clients) {
  const rows = []
  for (const c of clients) {
    MONTHS.forEach((month, i) => {
      const d = HOSP_DRIFTS[i] ?? 0
      rows.push({
        clientId: c.id, month,
        revpar: Math.round(c.baseline.revpar * (1 + d)),
        adr: Math.round(c.baseline.adr * (1 + d * 0.6)),
        occupancy: Math.round(c.baseline.occupancy * (1 + d) * 1000) / 1000,
      })
    })
  }
  return rows
}
