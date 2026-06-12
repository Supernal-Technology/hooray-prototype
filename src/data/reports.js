// SAL-drafted reports. The 4 sections per report mirror Hooray's spec:
//   1. Period overview + KPI tiles vs prior + baseline
//   2. One card per connected platform with SAL's 1–2 sentence read
//   3. Trends with sparklines
//   4. 2–4 recommended next steps with inline anomaly flags

export const REPORT_STATUS = ['drafting', 'ready_for_review', 'in_review', 'signed_off', 'delivered']

export const REPORTS = [
  {
    id: 'rep-south-coast-winery-2026-05',
    clientId: 'south-coast-winery',
    period: '2026-05',
    status: 'ready_for_review',
    draftedAt: '2026-06-02T08:00Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Demand held in a softer market on rate strategy. Blended ~5:1, every paid channel beat benchmark.',
    overview: {
      narrative: 'In a softer market, South Coast Winery protected rate over volume. ADR rose 20% to $389 and paid media returned ~5:1, so revenue held within 9% of last year despite booking volume down ~23%.',
      kpis: [
        { label: 'Total revenue', value: '$179.9K', deltaMoM: '-3%', vsBaseline: '-9%' },
        { label: 'Blended RoAS', value: '5.1x', deltaMoM: '+2%', vsBaseline: '+0%' },
        { label: 'ADR', value: '$389', deltaMoM: '+5%', vsBaseline: '+20%' },
        { label: 'Bookings', value: '270', deltaMoM: '-6%', vsBaseline: '-23%' },
      ],
    },
    platforms: [],
    trends: [],
    recommendations: [],
  },
  {
    id: 'rep-salamander-2026-05',
    clientId: 'salamander',
    period: '2026-05',
    status: 'ready_for_review',
    draftedAt: '2026-06-02T14:00Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Strong volume, soft unit economics. Meta open-window flagged. One Google Ads ROAS anomaly.',
    overview: {
      narrative: 'Salamander delivered solid bookings volume in May. Google Ads efficiency softened, ROAS landed 18% below baseline, while Meta showed an upside window worth leaning into for the next 2–3 weeks.',
      kpis: [
        { label: 'Total spend', value: '$50,500', deltaMoM: '+2%', vsBaseline: '+3%' },
        { label: 'Bookings', value: '1,841', deltaMoM: '+1%', vsBaseline: '+0%' },
        { label: 'Blended ROAS', value: '5.8x', deltaMoM: '-8%', vsBaseline: '-9%', anomaly: true },
        { label: 'RevPAR', value: '$425', deltaMoM: '+3%', vsBaseline: '+3%' },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'Google Ads ROAS dropped to 5.25x (baseline 6.4x). CPC on Middleburg-weddings rose 22%; conversions held but unit economics slipped.', anomalies: ['sig-001'] },
      { platformId: 'meta', read: 'Meta prospecting ROAS climbed 9% MoM with no spend change. Top-of-funnel is open, a 2–3 week window to lean in.', anomalies: ['sig-002'] },
      { platformId: 'ga4', read: 'Sessions +1% MoM, bookings +1%. Conversion rate held, the drop is on paid efficiency, not site performance.' },
      { platformId: 'trade-desk', read: 'Programmatic spend on plan (CSV received June 4). No anomalies.' },
    ],
    trends: [
      { metric: 'Blended ROAS', series: [6.4, 6.5, 6.3, 6.5, 6.1, 5.8], anomalyAtEnd: true },
      { metric: 'Meta ROAS', series: [5.2, 5.4, 5.5, 5.6, 5.5, 5.67] },
      { metric: 'Bookings', series: [1810, 1850, 1820, 1860, 1830, 1841] },
    ],
    recommendations: [
      { fromSignal: 'sig-001', text: 'Shift ~30% of spend from "Middleburg weddings" to high-intent search; pause two non-converting display placements.', priority: 'high' },
      { fromSignal: 'sig-002', text: 'Increase Meta prospecting budget by 15% for 14 days; reassess June 16.', priority: 'medium' },
    ],
  },
  {
    id: 'rep-resorts-world-2026-05',
    clientId: 'resorts-world',
    period: '2026-05',
    status: 'ready_for_review',
    draftedAt: '2026-06-02T14:00Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'On-plan growth; convention calendar driving the lift.',
    overview: {
      narrative: 'Resorts World had its strongest month in 5 cycles. The May convention calendar lifted RevPAR 5% and spend efficiency held. No anomalies.',
      kpis: [
        { label: 'Total spend', value: '$73,000', deltaMoM: '+4%', vsBaseline: '+4%' },
        { label: 'Bookings', value: '3,340', deltaMoM: '+4%', vsBaseline: '+4%' },
        { label: 'Blended ROAS', value: '5.0x', deltaMoM: '+1%', vsBaseline: '+1%' },
        { label: 'RevPAR', value: '$313', deltaMoM: '+3%', vsBaseline: '+5%' },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'Google Ads spend +5%, ROAS 5.4x (baseline 5.1x). Convention-segment search drove the lift.' },
      { platformId: 'meta', read: 'Meta prospecting steady. Continued strong CTR on Resorts World brand-defense terms.' },
      { platformId: 'ga4', read: 'Sessions +4%, conversion rate held. Mobile bookings overtook desktop for the second cycle in a row.' },
      { platformId: 'trade-desk', read: 'Programmatic spend on plan. No anomalies.' },
    ],
    trends: [
      { metric: 'Blended ROAS', series: [5.1, 5.15, 5.20, 5.30, 5.28, 5.0] },
      { metric: 'RevPAR', series: [298, 302, 305, 311, 307, 313] },
      { metric: 'Bookings', series: [3210, 3260, 3300, 3370, 3245, 3340] },
    ],
    recommendations: [
      { text: 'Lock the June convention-calendar spend at +5% over plan to ride the trend.', priority: 'medium' },
      { text: 'Build a desktop-vs-mobile breakdown into next month\'s report, the crossover is worth a leadership read.', priority: 'low' },
    ],
  },
  {
    id: 'rep-aqua-aston-2026-05',
    clientId: 'aqua-aston',
    period: '2026-05',
    status: 'in_review',
    draftedAt: '2026-06-02T14:00Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Spring spike confirmed model; CPA crept up. Within target.',
    overview: {
      narrative: 'Aqua Aston ran +14% spend in May driven by the Hawaii spring window. Bookings rose 10%, CPA 6%, within target ranges but worth flagging to the AM.',
      kpis: [
        { label: 'Total spend', value: '$34,500', deltaMoM: '+8%', vsBaseline: '+14%', anomaly: true },
        { label: 'Bookings', value: '1,754', deltaMoM: '+4%', vsBaseline: '+10%' },
        { label: 'Blended ROAS', value: '5.4x', deltaMoM: '-2%', vsBaseline: '-4%' },
        { label: 'Occupancy', value: '75%', deltaMoM: '+2pp', vsBaseline: '+3pp' },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'Spring break window drove +14% spend. CPA +6%; ROAS held at 5.4x.', anomalies: ['sig-004'] },
      { platformId: 'meta', read: 'Meta prospecting +5%, on plan. The Aqua Skyline Inn account dragged the rollup slightly.' },
      { platformId: 'ga4', read: 'Sessions +10%, bookings +10%. The site is converting at baseline rates.' },
      { platformId: 'revinate', read: 'Revinate access still delegated-pending. CRM segments excluded from this cycle.' },
    ],
    trends: [
      { metric: 'Total spend', series: [22000, 21100, 21600, 24200, 25100, 23900], anomalyAtEnd: true },
      { metric: 'Bookings', series: [1610, 1562, 1594, 1739, 1771, 1754] },
      { metric: 'Occupancy', series: [0.72, 0.73, 0.72, 0.74, 0.76, 0.75] },
    ],
    recommendations: [
      { fromSignal: 'sig-004', text: 'Confirm with AM whether the spring spike was modeled; set a $5k cap for the rest of Q2.', priority: 'medium' },
      { text: 'Re-engage the client to unblock Revinate access, we\'re half-blind on CRM until then.', priority: 'medium' },
    ],
  },
  {
    id: 'rep-curator-2026-05',
    clientId: 'curator',
    period: '2026-05',
    status: 'drafting',
    draftedAt: '2026-06-02T14:00Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Soft-brand rollup mostly on plan; one outlier dragging Meta CPC.',
    overview: {
      narrative: 'Curator\'s 37-property rollup landed within band. One outlier member property drove most of an 18% Meta CPC rise, the rest of the portfolio was healthy.',
      kpis: [
        { label: 'Total spend', value: '$40,500', deltaMoM: '+1%', vsBaseline: '+0%' },
        { label: 'Bookings', value: '2,459', deltaMoM: '+2%', vsBaseline: '+2%' },
        { label: 'Blended ROAS', value: '4.6x', deltaMoM: '-2%', vsBaseline: '-4%' },
        { label: 'Meta CPC', value: '$1.83', deltaMoM: '+18%', vsBaseline: '+18%', anomaly: true },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'Google Ads on plan. ROAS 4.7x (baseline 4.8x). No outliers worth surfacing.' },
      { platformId: 'meta', read: 'Meta CPC up 18% on the rollup. One outlier member (37th in roster) is ~70% of the spike, narrow geo, high cost.', anomalies: ['sig-007'] },
      { platformId: 'ga4', read: 'Sessions +2%, conversion rate held across all 37 properties.' },
    ],
    trends: [
      { metric: 'Meta CPC', series: [1.55, 1.55, 1.58, 1.62, 1.59, 1.83], anomalyAtEnd: true },
      { metric: 'Blended ROAS', series: [4.8, 4.75, 4.78, 4.77, 4.72, 4.6] },
    ],
    recommendations: [
      { fromSignal: 'sig-007', text: 'Review the outlier property\'s geo settings; consider widening or reallocating its share.', priority: 'medium' },
    ],
  },
  {
    id: 'rep-marcus-pfister-2026-05',
    clientId: 'marcus-pfister',
    period: '2026-05',
    status: 'drafting',
    draftedAt: '2026-06-02T14:00Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Trade Desk CSV missing, partial report. SAL excluded programmatic.',
    missingData: ['sig-003'],
    overview: {
      narrative: 'Pfister\'s May report is partial. The Trade Desk CSV, programmatic spend, ~$9.5k baseline, has not arrived from the client. SAL has excluded programmatic from the cycle and flagged the gap.',
      kpis: [
        { label: 'Total spend (ex. programmatic)', value: '$15,000', deltaMoM: '+3%', vsBaseline: '+3%' },
        { label: 'Bookings', value: '244', deltaMoM: '+2%', vsBaseline: '+1%' },
        { label: 'Blended ROAS', value: '4.0x', deltaMoM: '-2%', vsBaseline: '-5%' },
        { label: 'Programmatic', value: ', ', deltaMoM: 'missing', vsBaseline: 'missing', missing: true },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'Google Ads steady. ROAS 4.3x (baseline 4.2x). Healthy month for paid search.' },
      { platformId: 'meta', read: 'Meta steady. ROAS 3.9x (baseline 3.8x). No anomalies.' },
      { platformId: 'ga4', read: 'Sessions +2%, bookings +2%. Site is performing as expected.' },
      { platformId: 'trade-desk', read: 'CSV not received as of June 9. Programmatic excluded from this cycle. SAL will rebuild the report once the CSV lands.', missing: true, anomalies: ['sig-003'] },
    ],
    trends: [
      { metric: 'Blended ROAS', series: [4.2, 4.22, 4.25, 4.21, 4.10, 4.0] },
      { metric: 'Bookings', series: [225, 230, 235, 238, 239, 244] },
    ],
    recommendations: [
      { fromSignal: 'sig-003', text: 'Email Tom Brennan at Pfister for the May Trade Desk CSV; reissue the report once received.', priority: 'high' },
    ],
  },
  {
    id: 'rep-timbers-2026-05',
    clientId: 'timbers',
    period: '2026-05',
    status: 'signed_off',
    draftedAt: '2026-06-02T14:00Z',
    signedOffAt: '2026-06-02T19:42Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Strong month; Sebastian Vail brand-defense is the standout.',
    overview: {
      narrative: 'Timbers had its strongest May in 3 years. ROAS 7.5x (baseline 7.2x). Sebastian Vail brand-defense is consistently the highest-performing term.',
      kpis: [
        { label: 'Total spend', value: '$28,000', deltaMoM: '+3%', vsBaseline: '+4%' },
        { label: 'Bookings', value: '395', deltaMoM: '+4%', vsBaseline: '+4%' },
        { label: 'Blended ROAS', value: '6.9x', deltaMoM: '+3%', vsBaseline: '+3%' },
        { label: 'RevPAR', value: '$630', deltaMoM: '+3%', vsBaseline: '+3%' },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'ROAS 7.5x on brand-defense. Strong, steady performance.', anomalies: ['sig-005'] },
      { platformId: 'meta', read: 'Meta steady; Kaua\'i creative refresh paid off.' },
      { platformId: 'ga4', read: 'Sessions +4%, bookings +4%. Direct-channel share climbed to 62%.' },
    ],
    trends: [
      { metric: 'Blended ROAS', series: [7.2, 7.49, 7.66, 7.32, 7.42, 7.49] },
    ],
    recommendations: [
      { fromSignal: 'sig-005', text: 'Spin up a $2k/mo display test layered on Sebastian Vail brand searchers.', priority: 'low' },
    ],
  },
  {
    id: 'rep-balboa-bay-2026-05',
    clientId: 'balboa-bay',
    period: '2026-05',
    status: 'ready_for_review',
    draftedAt: '2026-06-02T14:00Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Event-lead surge on Meta, opportunity for a dedicated wedding LP.',
    overview: {
      narrative: 'Balboa Bay had a clean month. Event-lead Meta forms surged 20% MoM, wedding and corporate over-indexed on lead-to-booking conversion. Worth a dedicated landing page test.',
      kpis: [
        { label: 'Total spend', value: '$23,000', deltaMoM: '+3%', vsBaseline: '+3%' },
        { label: 'Bookings', value: '1,177', deltaMoM: '+3%', vsBaseline: '+3%' },
        { label: 'Blended ROAS', value: '5.5x', deltaMoM: '+2%', vsBaseline: '+2%' },
        { label: 'Event leads', value: '142', deltaMoM: '+20%', vsBaseline: '+20%' },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'On plan. ROAS 5.97x (baseline 5.8x).' },
      { platformId: 'meta', read: 'Event lead forms +20%. Wedding & corporate over-indexed on conversion.', anomalies: ['sig-008'] },
      { platformId: 'ga4', read: 'Sessions +3%, bookings +3%. Newport Beach term continues to over-perform.' },
    ],
    trends: [
      { metric: 'Event leads', series: [118, 121, 124, 130, 124, 142] },
      { metric: 'Blended ROAS', series: [5.8, 5.83, 5.86, 5.92, 5.95, 5.97] },
    ],
    recommendations: [
      { fromSignal: 'sig-008', text: 'Brief design on a wedding-focused LP; ship for July 1.', priority: 'medium' },
    ],
  },
  {
    id: 'rep-mauna-kea-2026-05',
    clientId: 'mauna-kea',
    period: '2026-05',
    status: 'delivered',
    draftedAt: '2026-06-02T14:00Z',
    signedOffAt: '2026-06-03T11:00Z',
    deliveredAt: '2026-06-03T11:05Z',
    targetDeliveryAt: '2026-06-03T17:00Z',
    onTimeTarget: '2026-06-03',
    sectionsSummary: 'Direct bookings +13% (Q1 loyalty push paying off).',
    overview: {
      narrative: 'Mauna Kea direct bookings (Revinate) up 13% MoM. Repeat-guest segment drove the lift, Q1 loyalty program is paying off.',
      kpis: [
        { label: 'Total spend', value: '$30,500', deltaMoM: '+3%', vsBaseline: '+4%' },
        { label: 'Bookings', value: '561', deltaMoM: '+4%', vsBaseline: '+4%' },
        { label: 'Direct bookings', value: '612', deltaMoM: '+13%', vsBaseline: '+13%' },
        { label: 'Blended ROAS', value: '6.5x', deltaMoM: '+3%', vsBaseline: '+3%' },
      ],
    },
    platforms: [
      { platformId: 'gads', read: 'On plan. ROAS 7.18x (baseline 6.9x).' },
      { platformId: 'meta', read: 'On plan. Inter-island prospecting steady.' },
      { platformId: 'ga4', read: 'Sessions +3%; loyalty-segment landing pages converted at 2.4x portfolio average.' },
      { platformId: 'revinate', read: 'Direct bookings +13%. Repeat guests are the driver, Q1 loyalty push showing ROI.', anomalies: ['sig-006'] },
    ],
    trends: [
      { metric: 'Direct bookings', series: [540, 548, 558, 570, 575, 612] },
      { metric: 'Blended ROAS', series: [6.9, 7.10, 7.18, 7.04, 7.10, 7.18] },
    ],
    recommendations: [
      { text: 'Promote the Q1 loyalty result to leadership; share with strategy as Q1 program ROI evidence.', priority: 'low' },
    ],
  },
]

export const getReport = (id) => REPORTS.find((r) => r.id === id)
export const reportForClient = (clientId, period) => REPORTS.find((r) => r.clientId === clientId && r.period === period)
