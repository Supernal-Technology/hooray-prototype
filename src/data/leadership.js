// Leadership view metrics. Equivalent Human Hours is the hero number; rest are
// reporting performance and portfolio health.

export const LEADERSHIP = {
  equivalentHumanHours: {
    mtd: 184,
    trailing6: [142, 156, 161, 168, 174, 184],
    delta: '+12% MoM',
    methodNote:
      'Hours recovered = (reports drafted × 16 hrs/report) + (anomalies surfaced × 1.5 hrs/anomaly) + (Ask SAL queries × 0.25 hrs/query). 16 hrs/report is Hooray\'s pre-SAL baseline for the 4-section format, measured Q4 2025 across 3 AMs.',
  },
  reporting: {
    onTimePct: { value: 0.92, trailing6: [0.85, 0.88, 0.90, 0.91, 0.93, 0.92] },
    reportsShipped: { mtd: 9, trailing6: [7, 8, 8, 9, 9, 9] },
    anomaliesCaught: { mtd: 14, trailing6: [9, 11, 12, 13, 12, 14] },
    avgRevisions: 1.2,
  },
  portfolioHealth: {
    totalClients: 10,
    tier1: 7,
    tier2: 2,
    tier3: 1,
    pendingCompliance: 1,
    pendingDelegation: 2,
  },
}

export const LEADERSHIP_ROLES = [
  { id: 'david', name: 'David', title: 'CEO' },
  { id: 'roger', name: 'Roger', title: 'COO' },
  { id: 'randy', name: 'Randy', title: 'Head of Account' },
  { id: 'steven', name: 'Steven', title: 'Head of Strategy' },
]
