// Canned Ask SAL prompts + grounded sourced answers.
// Each answer exposes: narrative, numeric block, sources used (with tier + dataAsOf).

export const ASK_SAL_PROMPTS = [
  {
    id: 'ask-1',
    label: 'How did paid search do for Salamander last month?',
    clientId: 'salamander',
    answer: {
      narrative:
        'Salamander Google Ads ROAS dropped to 5.25x in May — that\'s 18% below the 6-month baseline of 6.4x and the first time it\'s slipped below 6 since I started watching. The volume was actually fine (1,841 bookings, +1% MoM) — the drop is unit-economics. CPC on the "Middleburg weddings" campaign group rose 22% in May. My read: a competitor opened up bidding in that vertical. I\'d shift ~30% of that group\'s spend into high-intent search and pause the two non-converting display placements.',
      numbers: [
        { label: 'May ROAS', value: '5.25x', delta: '-18% vs 6.4x baseline' },
        { label: 'May spend', value: '$32,000', delta: 'on plan' },
        { label: 'CPC (Middleburg weddings)', value: '$2.01', delta: '+22% MoM' },
        { label: 'Conversions', value: '443', delta: '-1% MoM' },
      ],
      sources: [
        { platform: 'Google Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
        { platform: 'GA4', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
      ],
    },
  },
  {
    id: 'ask-2',
    label: 'Which clients are at risk of missing the day-3 delivery window?',
    clientId: null,
    answer: {
      narrative:
        'Two clients are at material risk. Marcus / Pfister is the bigger one — the Trade Desk CSV is still outstanding, so I can\'t finish the programmatic section. The Guild is the other: contract compliance is pending, so I\'m holding the report until cleared. Curator is a soft delay — drafting is done but I\'m waiting on the AM to acknowledge the Meta CPC outlier before I post it for review.',
      numbers: [
        { label: 'At-risk reports', value: '2', delta: '' },
        { label: 'On-time delivery this cycle (so far)', value: '78%', delta: 'vs 95% target' },
        { label: 'Reports delivered', value: '1 / 8', delta: 'Mauna Kea' },
        { label: 'Reports awaiting AM review', value: '3', delta: '' },
      ],
      sources: [
        { platform: 'Reports pipeline', tier: 1, dataAsOf: '2026-06-09T07:00Z' },
        { platform: 'Workspace (compliance log)', tier: 1, dataAsOf: '2026-06-09T07:00Z' },
      ],
    },
  },
  {
    id: 'ask-3',
    label: 'Show me everywhere Meta is over-performing baseline.',
    clientId: null,
    answer: {
      narrative:
        'Meta is over baseline at three accounts right now. Salamander is the clearest signal — prospecting ROAS up 9% MoM, no spend change. Balboa Bay is the strongest opportunity — event-lead forms +20% MoM. Curator is over baseline on spend but driven by one outlier member (37th in roster) skewing CPC — not a true portfolio lift.',
      numbers: [
        { label: 'Salamander Meta ROAS', value: '5.67x', delta: '+9% vs 5.2x baseline' },
        { label: 'Balboa Bay event leads', value: '142', delta: '+20% MoM' },
        { label: 'Curator Meta CPC', value: '$1.83', delta: '+18% (outlier-driven)' },
      ],
      sources: [
        { platform: 'Meta Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
        { platform: 'GA4', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
      ],
    },
  },
  {
    id: 'ask-4',
    label: 'How many human-hours did I recover this month?',
    clientId: null,
    answer: {
      narrative:
        'I count 184 equivalent human-hours recovered in May. The bulk is from monthly reporting — 9 reports drafted end-to-end (16 hrs each at the old cadence = 144 hrs). The remainder is anomaly triage (24 hrs) and ad-hoc Ask-SAL queries (16 hrs). The "how it\'s measured" note in the Leadership view has the full calc.',
      numbers: [
        { label: 'Total hours recovered (May)', value: '184', delta: '+12% MoM' },
        { label: 'Trailing 6-month avg', value: '162 hrs / mo', delta: '' },
        { label: 'Reports drafted', value: '9', delta: '' },
        { label: 'Anomalies surfaced', value: '14', delta: '' },
      ],
      sources: [
        { platform: 'Reports pipeline', tier: 1, dataAsOf: '2026-06-09T07:00Z' },
        { platform: 'Signals feed', tier: 1, dataAsOf: '2026-06-09T07:00Z' },
      ],
    },
  },
  {
    id: 'ask-5',
    label: 'What\'s the Pfister Trade Desk situation?',
    clientId: 'marcus-pfister',
    answer: {
      narrative:
        'Pfister is on Tier 3 for Trade Desk — they send the CSV manually. The April CSV came in April 30, but the May CSV has not arrived. I\'ve held programmatic out of this month\'s report and flagged it as a missing-data event. The May Trade Desk spend is normally ~$9.5k — without it the May Pfister report covers paid search + Meta + GA4 only. The AM (Marcus Cole) should email Tom Brennan to chase.',
      numbers: [
        { label: 'Last CSV received', value: '2026-04-30', delta: '40 days ago' },
        { label: 'Normal May spend (programmatic)', value: '~$9,500', delta: 'excluded' },
        { label: 'Total May spend (ex. programmatic)', value: '$15,000', delta: 'on plan' },
      ],
      sources: [
        { platform: 'Trade Desk', tier: 3, dataAsOf: '2026-04-30T00:00Z', missing: true },
        { platform: 'Google Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
        { platform: 'Meta Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
      ],
    },
  },
  {
    id: 'ask-6',
    label: 'Did the Q1 loyalty push at Mauna Kea pay off?',
    clientId: 'mauna-kea',
    answer: {
      narrative:
        'Yes. Mauna Kea direct bookings (Revinate) rose 13% MoM in May — repeat guests drove the lift. The trailing 3-month direct-booking curve mirrors the Q1 loyalty-program ramp 1:1. Worth surfacing in the Leadership view and sharing with Hooray strategy as Q1 ROI evidence.',
      numbers: [
        { label: 'May direct bookings', value: '612', delta: '+13% MoM' },
        { label: 'Direct-channel share', value: '54%', delta: '+4pp MoM' },
        { label: 'Trailing 3-month delta', value: '+10%', delta: 'tracks Q1 ramp' },
      ],
      sources: [
        { platform: 'Revinate CRM', tier: 2, dataAsOf: '2026-06-08T16:30Z' },
        { platform: 'GA4', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
      ],
    },
  },
]

export const getPrompt = (id) => ASK_SAL_PROMPTS.find((p) => p.id === id)
