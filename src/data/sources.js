// Per-client connected sources. Each entry models a single platform connection
// with sync status, access tier, dataAsOf timestamp, and a missingData flag.

export const PLATFORMS = {
  GA4: { id: 'ga4', name: 'GA4', kind: 'analytics', defaultTier: 1 },
  GADS: { id: 'gads', name: 'Google Ads', kind: 'paid', defaultTier: 1 },
  META: { id: 'meta', name: 'Meta Ads', kind: 'paid', defaultTier: 1 },
  TRADE_DESK: { id: 'trade-desk', name: 'Trade Desk', kind: 'programmatic', defaultTier: 3 },
  REVINATE: { id: 'revinate', name: 'Revinate CRM', kind: 'crm', defaultTier: 2 },
  CENDYN: { id: 'cendyn', name: 'Cendyn', kind: 'crm', defaultTier: 2 },
  GWS: { id: 'gws', name: 'Google Workspace', kind: 'workspace', defaultTier: 1 },
}

// Status: connected | delegated-pending | csv-manual | csv-missing | disconnected
export const SOURCES = [
  // Salamander, full Tier 1 stack
  { clientId: 'salamander', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'salamander', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'salamander', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'salamander', platformId: 'trade-desk', tier: 3, status: 'csv-manual', dataAsOf: '2026-06-04T09:14Z' },
  { clientId: 'salamander', platformId: 'gws', tier: 1, status: 'connected', dataAsOf: '2026-06-09T07:00Z' },

  // Resorts World, high spend
  { clientId: 'resorts-world', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'resorts-world', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'resorts-world', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'resorts-world', platformId: 'trade-desk', tier: 3, status: 'csv-manual', dataAsOf: '2026-06-05T11:02Z' },

  // Curator
  { clientId: 'curator', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'curator', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'curator', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },

  // Aqua Aston
  { clientId: 'aqua-aston', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'aqua-aston', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'aqua-aston', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'aqua-aston', platformId: 'revinate', tier: 2, status: 'delegated-pending', dataAsOf: null },

  // Marcus / Pfister, Tier 3 with missing CSV (honest about missing data)
  { clientId: 'marcus-pfister', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'marcus-pfister', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'marcus-pfister', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'marcus-pfister', platformId: 'trade-desk', tier: 3, status: 'csv-missing', dataAsOf: '2026-04-30T00:00Z', missingNote: 'May 2026 CSV not yet received from client. Trade Desk excluded from this cycle\'s report.' },

  // Timbers
  { clientId: 'timbers', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'timbers', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'timbers', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },

  // Balboa Bay
  { clientId: 'balboa-bay', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'balboa-bay', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'balboa-bay', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },

  // Alila Ventana Big Sur, Tier 2 via Revinate
  { clientId: 'alila-ventana', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'alila-ventana', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'alila-ventana', platformId: 'revinate', tier: 2, status: 'connected', dataAsOf: '2026-06-08T16:30Z' },

  // The Guild, pending compliance
  { clientId: 'the-guild', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'the-guild', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'the-guild', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },

  // Mauna Kea, Tier 2 via Revinate + Cendyn
  { clientId: 'mauna-kea', platformId: 'ga4', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'mauna-kea', platformId: 'gads', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'mauna-kea', platformId: 'meta', tier: 1, status: 'connected', dataAsOf: '2026-06-08T22:00Z' },
  { clientId: 'mauna-kea', platformId: 'revinate', tier: 2, status: 'connected', dataAsOf: '2026-06-08T16:30Z' },
  { clientId: 'mauna-kea', platformId: 'cendyn', tier: 2, status: 'delegated-pending', dataAsOf: null },
]

export const sourcesForClient = (clientId) => SOURCES.filter((s) => s.clientId === clientId)
export const getPlatform = (id) => Object.values(PLATFORMS).find((p) => p.id === id)

// Bulk sync metadata for the Data Sources header.
export const BULK_SYNC = {
  lastCompletedAt: '2026-06-08T22:00Z',
  nextScheduledAt: '2026-06-09T22:00Z',
  totalConnections: SOURCES.length,
  connected: SOURCES.filter((s) => s.status === 'connected').length,
  delegatedPending: SOURCES.filter((s) => s.status === 'delegated-pending').length,
  csvManual: SOURCES.filter((s) => s.status === 'csv-manual').length,
  csvMissing: SOURCES.filter((s) => s.status === 'csv-missing').length,
}
