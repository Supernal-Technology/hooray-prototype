// Client-facing Ask SAL canned Q&A for the live demo. ALL DATA IS SIMULATED.
//
// This file is intentionally plain data: redirecting the demo after stakeholder
// feedback means editing these objects, not touching components. Each answer has
// the v1 response shape (first-person narrative + numbers + sources) PLUS an
// optional `chart` spec (see components/Chart.jsx) that renders inline in the
// chat thread. Prompts are ordered/tuned to show varied chart types in <2 min.
//
// Scoped to Resorts World Las Vegas (richest v1 data + a clean Meta-cost anomaly
// story). The anomaly lives here in chat data, not in the v1 report object.

const SRC = {
  gads: { platform: 'Google Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
  meta: { platform: 'Meta Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
  ga4: { platform: 'GA4', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
  td: { platform: 'Trade Desk', tier: 3, dataAsOf: '2026-06-05T11:02Z' },
}

export const CLIENT_CHAT = {
  clientId: 'resorts-world',
  clientName: 'Resorts World Las Vegas',

  // 5–6 chips, ordered to produce: grouped bars → line → stacked → line(anomaly) → text/stat.
  prompts: [
    { id: 'paid-vs-last', label: 'How did my paid media perform vs last month?' },
    { id: 'bounce-why', label: 'Why did my bounce rate go up?' },
    { id: 'revpar-trend', label: 'Show me my RevPAR trend' },
    { id: 'budget-where', label: 'Where did my budget go last month?' },
    { id: 'meta-costs', label: "What's driving my Meta costs up?" },
    { id: 'team-doing', label: 'What is the team doing about it?' },
    { id: 'roas-6mo', label: 'Show me ROAS over the last 6 months' },
  ],

  answers: {
    'paid-vs-last': {
      confidence: 'high',
      keywords: ['paid', 'media', 'last month', 'vs', 'channel', 'perform'],
      narrative:
        'Your paid media grew 8% in spend month over month and held efficiency. Google Ads and programmatic were steady; the increase was almost entirely Meta, where I leaned into the May convention calendar. Bookings rose 4% on the higher spend.',
      chart: {
        type: 'groupedBars',
        format: 'currency',
        priorLabel: 'April',
        currentLabel: 'May',
        categories: [
          { label: 'Google Ads', prior: 36000, current: 38000 },
          { label: 'Meta Ads', prior: 18000, current: 22000, flagged: true },
          { label: 'Programmatic', prior: 13500, current: 13000 },
        ],
        alt: 'Channel spend April vs May',
      },
      numbers: [
        { label: 'Total paid spend', value: '$73,000', delta: '+8% MoM' },
        { label: 'Blended ROAS', value: '5.0x', delta: '+1%' },
      ],
      sources: [SRC.gads, SRC.meta, SRC.td],
    },

    'bounce-why': {
      confidence: 'high',
      keywords: ['bounce', 'bounce rate', 'why', 'site', 'leaving'],
      narrative:
        "Your bounce rate rose to 47% in May, up about 10 points. It isn't a website problem, it's traffic mix. You spent more on Google Ads for the convention window, and paid visitors engage less than your direct and organic traffic, so a larger share left without a second page. Your direct-traffic bounce rate actually held at 31%. The lever here is paid targeting, not the site.",
      chart: {
        type: 'line',
        format: 'pct',
        flagged: true,
        points: [36, 37, 38, 39, 42, 47],
        xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        latestLabel: 'May',
        alt: 'Bounce rate trend, last 6 months',
      },
      numbers: [
        { label: 'May bounce rate', value: '47%', delta: '' },
        { label: 'Direct-traffic bounce', value: '31%', delta: 'held' },
      ],
      sources: [SRC.ga4, SRC.gads],
    },

    'revpar-trend': {
      confidence: 'high',
      keywords: ['revpar', 'rev par', 'rate', 'trend'],
      narrative:
        'RevPAR has climbed steadily for six months and hit $313 in May, your strongest in over a year. The May convention calendar carried weekend rate; mid-week held its recent gains rather than giving them back.',
      chart: {
        type: 'line',
        format: 'currency-full',
        points: [298, 302, 305, 311, 307, 313],
        xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        latestLabel: 'May',
        alt: 'RevPAR trend, last 6 months',
      },
      numbers: [
        { label: 'May RevPAR', value: '$313', delta: '+3% MoM' },
        { label: 'vs baseline', value: '+5%', delta: '' },
      ],
      sources: [SRC.ga4],
    },

    'budget-where': {
      confidence: 'high',
      keywords: ['budget', 'where', 'spend breakdown', 'allocation', 'go'],
      narrative:
        "Here's where May's $73k went. Google Ads remains the workhorse at just over half; Meta took a larger slice this month for the convention push; programmatic held its baseline share through Trade Desk.",
      chart: {
        type: 'stacked',
        format: 'currency-full',
        segments: [
          { label: 'Google Ads', value: 38000 },
          { label: 'Meta Ads', value: 22000 },
          { label: 'Programmatic', value: 13000 },
        ],
        alt: 'Budget breakdown by channel, May',
      },
      numbers: [{ label: 'Total deployed', value: '$73,000', delta: 'on plan' }],
      sources: [SRC.gads, SRC.meta, SRC.td],
    },

    'meta-costs': {
      confidence: 'high',
      keywords: ['meta', 'cost', 'cpc', 'expensive', 'driving', 'up', 'rising'],
      narrative:
        "Your Meta cost-per-click has been climbing and jumped to $2.78 in May, about 32% above the $2.10 you'd averaged. It started late April. The driver is auction competition on the convention-window audiences, not a creative or targeting problem on our side: your click-through actually held, so it's the cost of the click that moved, not the quality.",
      chart: {
        type: 'line',
        format: 'money2',
        flagged: true,
        points: [2.10, 2.13, 2.15, 2.22, 2.41, 2.78],
        xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        latestLabel: 'May',
        alt: 'Meta CPC trend, last 6 months',
      },
      numbers: [
        { label: 'May Meta CPC', value: '$2.78', delta: '+32% vs baseline' },
        { label: 'Click-through rate', value: '1.9%', delta: 'held' },
      ],
      sources: [SRC.meta],
      teamDoing:
        "Your team at Hooray has already capped the convention-audience bids and is shifting ~15% of Meta budget to retargeting, where the cost held. We'll know within two weeks whether that pulls the blended CPC back under $2.40, I'll flag it in next month's report either way.",
    },

    'team-doing': {
      confidence: 'medium',
      keywords: ['team', 'doing', 'about it', 'plan', 'next', 'fix'],
      narrative:
        "On the Meta cost rise, your Hooray team capped the convention-audience bids and moved about 15% of Meta budget into retargeting, where cost-per-click held steady. Everything else is performing to plan, so no other changes this cycle. Marcus reviewed and approved this report before it reached you.",
      chart: {
        type: 'stat',
        value: '~$3.3k',
        label: 'Projected May Meta savings from the bid cap',
        delta: '',
        sub: 'Reassessed June 16 · simulated estimate',
      },
      numbers: [
        { label: 'Budget reallocated', value: '15%', delta: 'Meta → retargeting' },
        { label: 'Other channels', value: 'On plan', delta: '' },
      ],
      sources: [SRC.meta, SRC.gads],
    },

    'roas-6mo': {
      confidence: 'high',
      keywords: ['roas', 'return', 'efficiency', '6 month', 'six month'],
      narrative:
        'Blended ROAS has held in a tight, healthy band around 5x all year. May settled at 5.0x, a touch below the spring peak because you spent more into the convention window, which is the right trade: total bookings and RevPAR both rose.',
      chart: {
        type: 'line',
        format: 'x',
        points: [5.1, 5.15, 5.2, 5.3, 5.28, 5.0],
        xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        latestLabel: 'May',
        alt: 'Blended ROAS trend, last 6 months',
      },
      numbers: [
        { label: 'May ROAS', value: '5.0x', delta: '+1% MoM' },
        { label: '6-mo average', value: '5.2x', delta: '' },
      ],
      sources: [SRC.gads, SRC.meta, SRC.ga4],
    },
  },

  // Honest no-source fallback, never a fabricated chart.
  fallback: {
    narrative:
      "I don't have a connected source that answers that yet. I can show you your paid media, RevPAR, ROAS, channel spend, and what's driving any flagged change, try one of the suggestions, or ask about a specific metric and month.",
    numbers: [],
    sources: [],
  },
}

// Keyword match free-text to the nearest canned answer (never fabricate).
export function matchClientAnswer(text) {
  const q = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const [id, ans] of Object.entries(CLIENT_CHAT.answers)) {
    const score = (ans.keywords || []).reduce((n, k) => (q.includes(k) ? n + 1 : n), 0)
    if (score > bestScore) { bestScore = score; best = ans }
  }
  return bestScore > 0 ? best : CLIENT_CHAT.fallback
}

export function answerForPrompt(promptId) {
  return CLIENT_CHAT.answers[promptId] || CLIENT_CHAT.fallback
}
