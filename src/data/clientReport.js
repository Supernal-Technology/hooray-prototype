// Client-facing month-end recap for the hero client (South Coast Winery).
// Numbers transcribed from Hooray's real "Web & Media Overview" recap deck so the
// prototype mirrors the actual deliverable; framed as simulated for the demo.
//
// Story: increased media investment expanded reach and visibility, sustaining
// demand at a strong ~5:1 blended RoAS even as the market softened. Volume is
// down YoY, but a higher ADR / average transaction value offsets it, and low-cost
// Organic + Referral grew their revenue share. Every paid channel beat benchmark.
//
// Editing this file (not the components) is how the demo gets redirected.

const SRC = {
  ga4: { platform: 'GA4', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
  gads: { platform: 'Google Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
  meta: { platform: 'Meta Ads', tier: 1, dataAsOf: '2026-06-08T22:00Z' },
  td: { platform: 'Trade Desk', tier: 3, dataAsOf: '2026-06-05T11:02Z' },
  revinate: { platform: 'Revinate CRM', tier: 2, dataAsOf: '2026-06-08T16:30Z' },
}

// k(label, value, delta, good), good=true colors the delta positive (accent),
// false colors it amber (needs attention). Mirrors the report's up/down arrows.
const k = (label, value, delta, good) => ({ label, value, delta, good })

export const CLIENT_REPORT = {
  clientId: 'south-coast-winery',
  clientName: 'South Coast Winery',
  property: 'Resort & Spa · Temecula',
  period: 'May 2026',

  // ---------------- DASHBOARD (live) ----------------
  dashboard: {
    eyebrow: 'Live · month to date',
    lede: "Here's how the resort is performing right now. Your full May recap is signed off and ready under Reports.",
    kpis: [
      k('Total revenue', '$179.9K', '-8.8% YoY', false),
      k('Blended RoAS', '5.1:1', 'above benchmark', true),
      k('ADR', '$389', '+20.1%', true),
      k('Bookings', '270', '-23.3%', false),
    ],
    overview: {
      narrative:
        "Through May, demand is holding even as volume softens. Bookings and sessions are down year over year, but a much higher ADR ($389, +20%) is offsetting it and paid media is returning a strong ~5:1. Organic and referral are quietly carrying more of the revenue. The full recap with the why behind each number is under Reports.",
      numbers: [k('Total revenue', '$179.9K', '-8.8%'), k('ADR', '$389', '+20%')],
      sources: [SRC.ga4, SRC.gads],
    },
    // SAL's plain-language read of the month, shown front and center on the dashboard.
    headline: {
      confidence: 'high',
      read:
        "In a softer market, you're protecting rate instead of discounting to chase volume, and it's working. ADR is up 20% to $389 and paid media is returning a strong ~5:1, so revenue is holding within 9% of last year even though booking volume is down ~23%. Your lowest-cost channels, organic and referral, are quietly growing their share.",
    },
    // What's moving the numbers, up or down, at a glance.
    drivers: [
      { label: 'Rate protected over volume', detail: 'ADR up 20% to $389', dir: 'up' },
      { label: 'Paid media is efficient', detail: 'Blended ~5:1, every paid channel beat benchmark', dir: 'up' },
      { label: 'Low-cost channels grew', detail: 'Organic + referral gained revenue share', dir: 'up' },
      { label: 'Volume softened', detail: 'Bookings down ~23% YoY on a tougher market', dir: 'down' },
    ],
    // Where the month's revenue actually came from (GA4 channel attribution).
    channelChart: { title: 'Where revenue came from', spec: { type: 'bars', format: 'currency-full', items: [
      { label: 'Organic Search', value: 58369 },
      { label: 'Paid Search', value: 47402 },
      { label: 'Referral', value: 26157 },
      { label: 'Direct', value: 18622 },
      { label: 'Email', value: 11462 },
    ] } },
    // The core executive questions the May deck answers, surfaced and answered
    // inline on the dashboard. `to` deep-links the relevant Monthly Report tab.
    execQuestions: [
      { q: 'How are we performing online vs. last year?', stat: '-8.8% revenue YoY',
        a: "Volume is down but value is up. Sessions and bookings fell ~23% YoY on a softer market, yet a 20% higher ADR ($389) held revenue within 9% of last year at $179.9K. The business is healthier per booking than it looks on volume alone.", to: 'summary' },
      { q: 'Are our marketing investments generating profitable revenue?', stat: '~5:1 blended RoAS',
        a: "Yes. Paid media returned a strong ~5:1 blended RoAS in May and every paid channel beat its industry benchmark. The investment is paying back well above the cost of the media.", to: 'media' },
      { q: 'What channels are driving bookings and revenue?', stat: 'Organic leads at $58K',
        a: "Organic Search led at $58K, then Paid Search ($47K) and Referral ($26K). The healthy signal: your lowest-cost channels, organic and referral, grew their share, so paid is lifting the channels around it, not just buying its own conversions.", to: 'website' },
      { q: 'Why are bookings down despite more marketing activity?', stat: 'Rate protected over volume',
        a: "A deliberate choice. The market softened, and rather than discount to chase volume, the strategy protected rate, so you booked fewer, higher-value stays. Media expanded reach and visibility to sustain demand at a 20% higher ADR instead of cutting price.", to: 'summary' },
      { q: 'Is the website healthy and converting visitors?', stat: '38% bounce rate',
        a: "Yes. Bounce held at 38% against a 55-60% hospitality benchmark, so visitors are staying and engaging rather than leaving on the first page. Check-availability and engagement quality stayed healthy all month.", to: 'website' },
      { q: 'Are our paid channels beating industry benchmarks?', stat: '73% brand impression share',
        a: "Across the board, yes. Every paid channel beat benchmark, and brand impression share sits at 73%, right in the 70-80% target, with ~7 points of headroom to fully box out the OTAs on your own name.", to: 'paid' },
      { q: 'Which campaigns and offers are working best?', stat: 'Search 499% · Social 575% RoAS',
        a: "Search and Social are the workhorses. Search drove 66 bookings at a 499% RoAS, Social 60 bookings at 575%, and Display played a small high-intent support role (10 bookings, 315%). Budget is concentrated where the return is strongest.", to: 'media' },
      { q: 'How are prospecting efforts affecting performance?', stat: 'CTR dip by design',
        a: "Prospecting is widening the top of the funnel on purpose. As Performance Max expands reach to broader audiences, click-rate dilutes by design, but the payoff shows up downstream in the organic and referral lift, your paid investment is feeding the lower-cost channels.", to: 'paid' },
      { q: 'What creative and promotional strategies are running?', stat: 'Rate-integrity positioning',
        a: "The through-line this month was rate integrity: premium, experience-led creative across Search, Social and Display that sells the resort and spa experience rather than leading with discounts. That positioning is what let ADR climb 20% while demand held.", to: 'social' },
      { q: 'What are the next strategic priorities for the quarter?', stat: 'Push brand share toward 80%',
        a: "Three moves: keep protecting rate while the market is soft, push brand impression share from 73% toward 80% to capture the OTA headroom, and keep scaling the efficient Search and Social campaigns while leaning into the organic and referral momentum.", to: 'planning' },
    ],
    questions: [
      { id: 'd-how', label: 'How are we doing this month?', answer: { confidence: 'high', narrative: "Solid given the market. Volume is down YoY across sessions and bookings, but a 20% higher ADR and a strong ~5:1 blended RoAS are sustaining revenue, and low-cost organic/referral are growing their share. The full read is in your May recap.", numbers: [k('ADR', '$389', '+20%'), k('Blended RoAS', '5.1:1', '')], sources: [SRC.ga4, SRC.gads] } },
      { id: 'd-why', label: 'Why is revenue down if rate is up?', answer: { confidence: 'high', narrative: "Fewer, higher-value stays. Booking volume softened ~23% YoY on a tougher market, so even with ADR up 20% and length-of-stay steady, total revenue landed 8.8% lower. The strategy protected rate and demand rather than discounting to chase volume.", numbers: [k('Bookings', '270', '-23%'), k('ADR', '$389', '+20%')], sources: [SRC.ga4] } },
    ],
  },

  // ---------------- MONTHLY REPORT sections ----------------
  sections: [
    /* ===== SUMMARY ===== */
    {
      id: 'summary',
      label: 'Summary',
      eyebrow: 'Executive summary',
      lede:
        "May sustained demand in a softer market. Increased media investment expanded reach and visibility, holding a strong blended RoAS while a higher average rate offset lower booking volume. Organic and referral grew their share of revenue.",
      takeaways: [
        { title: 'Rate offset volume', body: 'Bookings and room nights softened year over year, but ADR rose 20% to $389, partially offsetting the lower volume on revenue.' },
        { title: 'Paid media stayed profitable', body: 'Every paid channel beat its RoAS benchmark for a blended ~5:1 in May; the extra spend went to upper-funnel prospecting.' },
        { title: 'Low-cost channels grew', body: 'Organic Search and Referral grew their share of revenue, the channels that convert at little to no media cost.' },
        { title: 'Engagement quality held', body: 'Bounce rate (38%) and check-availability rate (17%) both stayed in healthy ranges despite softer traffic.' },
      ],
      month: {
        kpis: [
          k('Total revenue', '$179.9K', '-8.8% YoY', false),
          k('Bookings', '270', '-23.3%', false),
          k('ADR', '$389', '+20.1%', true),
          k('Blended RoAS', '5.1:1', 'above benchmark', true),
          k('Room nights', '463', '-24.1%', false),
          k('Avg length of stay', '1.71', '-1.0%', false),
        ],
      },
      recommendation:
        "Hold the rate strategy that's protecting ADR, keep funding the prospecting that's growing reach, and protect brand impression share in paid search (it's the moat against the OTAs). Watch room-night volume into summer.",
      overview: {
        narrative:
          "Your May headline: demand held in a softer market. You protected rate (ADR +20% to $389) and ran paid media at a strong ~5:1, so even with booking volume down ~23% YoY, revenue only slipped 8.8%. Organic and referral grew their revenue share, and engagement quality (bounce, check-availability) stayed healthy. The strategy sustained demand rather than discounting to chase volume.",
        numbers: [k('Total revenue', '$179.9K', '-8.8%'), k('ADR', '$389', '+20%')],
        sources: [SRC.ga4, SRC.gads, SRC.meta],
      },
      questions: [
        { id: 's-headline', label: 'Give me the headline for ownership', answer: { confidence: 'high', narrative: "In a softer market, the resort sustained demand and protected rate. ADR rose 20% to $389 and paid media returned a blended ~5:1, so revenue held within 9% of last year despite a ~23% drop in booking volume. We chose rate integrity over discounting, and low-cost organic/referral grew their share.", numbers: [k('Revenue', '$179.9K', '-8.8%'), k('ADR', '$389', '+20%')], sources: [SRC.ga4, SRC.gads] } },
        { id: 's-why', label: 'Why did volume drop?', answer: { confidence: 'high', narrative: "A softer travel market this cycle pulled sessions and availability checks down year over year. Rather than discount to defend volume, the strategy held rate, which is why ADR climbed 20% and revenue stayed close to last year on fewer, higher-value bookings.", numbers: [k('Sessions', '46.2K', '-20%'), k('Bookings', '270', '-23%')], sources: [SRC.ga4] } },
        { id: 's-next', label: 'What should we do next month?', answer: { confidence: 'medium', narrative: "Keep protecting ADR, sustain the prospecting spend that's expanding reach, and hold brand impression share in paid search at 70-80% to fend off OTAs. Watch room-night volume into summer, if it keeps softening, test a targeted length-of-stay offer rather than an across-the-board discount.", numbers: [], sources: [SRC.gads, SRC.meta] } },
      ],
    },

    /* ===== PLANNING & NEXT STEPS (deck chapter 01) ===== */
    {
      id: 'planning',
      label: 'Next Steps',
      eyebrow: 'Planning & next steps',
      lede:
        "What's in flight for the resort over the next 30, 60 and 90 days, plus where SAL recommends focusing given how May performed.",
      // The agency's planned initiatives, straight from the deck's 30-60-90 page.
      roadmap: [
        { window: '30 Days', items: [
          { title: 'Phase 2 AEO/GEO', status: 'Finalizing' },
          { title: 'Next photoshoot planning', status: 'In progress' },
        ] },
        { window: '60 Days', items: [
          { title: 'Phase 3 AEO/GEO', status: 'Pending' },
          { title: 'Next photoshoot delivery', status: 'Scheduled' },
        ] },
        { window: '90 Days', items: [
          { title: 'Q3 ad refresh', status: 'Planned' },
          { title: 'Summer campaign concepting', status: 'TBD' },
        ] },
      ],
      // SAL's recommended focus, layered on top of the agency plan.
      salFocus: [
        'Keep protecting rate while the market is soft instead of discounting to chase volume.',
        'Push brand impression share from 73% toward 80% to capture the OTA headroom in paid search.',
        'Keep scaling the efficient Search and Social campaigns, and lean into the organic and referral momentum.',
      ],
      overview: {
        narrative:
          "The plan is built around momentum, not correction. The agency is finalizing Phase 2 AEO/GEO (getting the property surfaced in AI and answer engines), planning the next photoshoot, and lining up a Q3 ad refresh. My read: the May numbers say keep doing what's working, protect rate, push brand impression share toward 80%, and scale the Search and Social campaigns that beat benchmark.",
        numbers: [k('Brand impression share', '73%', 'target 80%'), k('Blended RoAS', '5.1:1', '')],
        sources: [SRC.gads, SRC.meta],
      },
      questions: [
        { id: 'pl-quarter', label: "What's the plan for the next quarter?", answer: { confidence: 'high', narrative: "Three waves. Next 30 days: finalize Phase 2 AEO/GEO and plan the next photoshoot. 60 days: Phase 3 AEO/GEO and photoshoot delivery. 90 days: a Q3 ad refresh and summer campaign concepting. The through-line is sustaining demand and visibility rather than reacting to the softer market.", numbers: [], sources: [SRC.gads] } },
        { id: 'pl-aeo', label: "What is Phase 2 AEO/GEO?", answer: { confidence: 'high', narrative: "AEO/GEO is answer-engine and generative-engine optimization, making sure the resort shows up when people ask AI assistants and search engines questions like \"best wine country resort near Temecula.\" Phase 2 is finalizing that setup; Phase 3 extends it. It's the organic-visibility complement to the paid spend.", numbers: [], sources: [SRC.ga4] } },
        { id: 'pl-focus', label: 'Where should we focus budget next?', answer: { confidence: 'medium', narrative: "Lean into what beat benchmark. Search (499% RoAS) and Social (575%) are the workhorses, so protect and scale those. Use the brand impression-share headroom (73% toward 80%) to box out the OTAs, and keep funding the prospecting that's lifting organic and referral. I'd hold Display flat, it's a small high-intent support role.", numbers: [k('Search RoAS', '499%', ''), k('Social RoAS', '575%', '')], sources: [SRC.gads, SRC.meta] } },
      ],
    },

    /* ===== WEBSITE ===== */
    {
      id: 'website',
      label: 'Website',
      eyebrow: 'Web overview',
      lede:
        "Traffic and engagement softened year over year, but quality held: a solid conversion rate, a favorable bounce rate, and a strong check-availability rate. A higher ADR offset lower booking volume, and Organic Search and Referral grew their share of revenue.",
      takeaways: [
        { title: 'Traffic / engagement', body: 'Sessions and engagement softened YoY. User conversion rate (0.74%) stayed within the 0.5-1% benchmark for independent hotels.' },
        { title: 'Transactions & revenue', body: 'Bookings and revenue softened, but a significantly higher ADR helped offset the lower volume. Organic and referral grew their revenue share.' },
        { title: 'Check availability', body: 'The check-availability rate (17.04%) is strong, the 15-20% range we aim for; fluctuations are typical.' },
        { title: 'Bounce rate', body: 'Remains very favorable at 38% (benchmark average 55-60%).' },
      ],
      month: {
        kpis: [
          k('Sessions', '46.2K', '-20.1%', false),
          k('Engaged sessions', '28.6K', '-18.4%', false),
          k('Bounce rate', '38.21%', '-7.0%', true),
          k('Avg session', '03:27', '+3.7%', true),
          k('Total revenue', '$179.9K', '-8.8%', false),
          k('Transactions', '270', '-23.3%', false),
          k('ADR', '$389', '+20.1%', true),
          k('Check-availability', '17.04%', '+4.6%', true),
        ],
        charts: [
          { title: 'Revenue by channel', spec: { type: 'bars', format: 'currency-full', items: [
            { label: 'Organic Search', value: 58369 }, { label: 'Paid Search', value: 47402 }, { label: 'Referral', value: 26157 }, { label: 'Direct', value: 18622 }, { label: 'Unassigned', value: 11684 }, { label: 'Email', value: 11462 }, { label: 'Organic Social', value: 1142 },
          ] } },
          { title: 'Revenue by rate plan', spec: { type: 'bars', format: 'currency-full', items: [
            { label: 'Best Available', value: 71000 }, { label: 'Advance Purchase', value: 27000 }, { label: 'Uncork & Unwind', value: 22000 }, { label: 'Gov & Military', value: 4000 }, { label: 'Stay 2+ Save', value: 1000 },
          ] } },
        ],
        table: {
          title: 'Top pages',
          columns: [{ key: 'page', label: 'Page', align: 'left' }, { key: 'views', label: 'Views', align: 'right' }, { key: 'per', label: 'Views / user', align: 'right' }],
          rows: [
            { page: '/', views: '32,723', per: '2.22' },
            { page: '/booking/rooms-and-rates', views: '27,542', per: '3.09' },
            { page: '/specials', views: '11,101', per: '1.33' },
            { page: '/dining/vineyard-rose', views: '8,466', per: '1.60' },
            { page: '/spa/services', views: '4,518', per: '1.66' },
            { page: '/wine/visit', views: '3,480', per: '1.49' },
          ],
          total: { page: 'Grand total', views: '133,726', per: '4.16' },
        },
      },
      ytd: {
        kpis: [
          k('Sessions', '229.5K', '-21.1%', false),
          k('Engaged sessions', '146.0K', '-15.3%', false),
          k('Bounce rate', '37.37%', '-6.8%', true),
          k('Views / user', '4.57', '+4.6%', true),
          k('Total revenue', '$1.1M', '-21.7%', false),
          k('Transactions', '2.0K', '-30.4%', false),
          k('ADR', '$353', '+11.2%', true),
          k('Check-availability', '18.25%', '+10.1%', true),
        ],
        charts: [
          { title: 'Revenue by channel · YTD', spec: { type: 'bars', format: 'currency-full', items: [
            { label: 'Organic Search', value: 320274 }, { label: 'Paid Search', value: 301068 }, { label: 'Referral', value: 147810 }, { label: 'Direct', value: 141218 }, { label: 'Unassigned', value: 70152 }, { label: 'Email', value: 47089 }, { label: 'Cross-network', value: 21519 },
          ] } },
        ],
      },
      overview: {
        narrative:
          "On the website: sessions and engagement softened YoY, but the quality held. Conversion rate (0.74%) is in the healthy band for independent hotels, bounce rate (38%) beats benchmark, and check-availability (17%) is strong. A higher ADR offset the lower booking volume, and the encouraging story is mix, organic and referral grew their share of revenue.",
        numbers: [k('Conversion rate', '0.74%', 'healthy'), k('Bounce rate', '38%', 'favorable')],
        sources: [SRC.ga4],
      },
      questions: [
        { id: 'w-bounce', label: 'Is my bounce rate healthy?', answer: { confidence: 'high', narrative: "Yes, 38% is favorable. The hospitality benchmark is around 55-60%, so visitors are staying and engaging rather than leaving on the first page. It's held in the high-30s all year.", chart: { type: 'line', format: 'pct', points: [36, 37, 37, 38, 37, 38], xLabels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], latestLabel: 'May', alt: 'Bounce rate trend' }, numbers: [k('May bounce', '38%', ''), k('Benchmark', '55-60%', 'below = good')], sources: [SRC.ga4] } },
        { id: 'w-channels', label: 'Which channels drove revenue?', answer: { confidence: 'high', narrative: "Organic Search led at $58K, then Paid Search ($47K) and Referral ($26K). The healthy signal is that Organic and Referral, your lowest-cost channels, grew their share, your paid investment is lifting the channels around it, not just buying its own conversions.", chart: { type: 'bars', format: 'currency-full', items: [{ label: 'Organic Search', value: 58369 }, { label: 'Paid Search', value: 47402 }, { label: 'Referral', value: 26157 }, { label: 'Direct', value: 18622 }, { label: 'Email', value: 11462 }] }, numbers: [], sources: [SRC.ga4] } },
        { id: 'w-sessions', label: 'Why did sessions soften?', answer: { confidence: 'high', narrative: "A softer travel market this cycle, it's a YoY comparison effect against a strong 2025. Importantly, the quality metrics (conversion, bounce, check-availability) all held or improved, so it's fewer-but-better traffic, not a site problem.", numbers: [k('Sessions', '46.2K', '-20% YoY'), k('Conversion', '0.74%', 'held')], sources: [SRC.ga4] } },
      ],
    },

    /* ===== PAID SEARCH ===== */
    {
      id: 'paid',
      label: 'Paid Search',
      eyebrow: 'Paid search (PPC)',
      lede:
        "Search performed strong against benchmarks: an efficient $0.93 CPC, healthy CTR led by Brand at 33%, and a solid 5:1 return. Performance Max expanded reach earlier in the funnel. Brand impression share held at 73%, right where we want it to fend off OTAs.",
      budget: { gross: '$12,400', net: '$9,142', campaigns: 'Google Brand + Performance Max' },
      benchmarks: [
        'CPC: Brand $2-3 · Non-Brand $4 range',
        'CTR: hospitality Brand 15-20% · Non-Brand 3-4%',
        'Impression share: Brand 70-80% · Non-Brand 30%+',
        'RoAS: Google industry average ~2:1',
      ],
      takeaways: [
        { title: 'Efficient & visible', body: 'CPC $0.93 (well under the $2-3 brand benchmark) and CTR 12.25% blended, with Brand at 33%. Clicks and impressions both rose.' },
        { title: 'CTR dip is by design', body: 'The decline is expected as Performance Max expands reach to broader prospecting audiences, diluting click-rate while growing the funnel.' },
        { title: 'Revenue & transactions', body: 'Volume softened, but the channel held a solid 5:1 RoAS. Performance Max generated 3 bookings at a 2:1 early return as it ramps.' },
        { title: 'Impression share', body: 'Strong at 73.49%, within the 70-80% range we target to stay visible against the OTAs.' },
      ],
      month: {
        kpis: [
          k('Clicks', '9.8K', '+9.5%', true),
          k('Impressions', '80.1K', '+147.5%', true),
          k('CTR', '12.25%', '-55.8%', false),
          k('CPC', '$0.93', '+10.1%', true),
          k('Transactions', '66', '-32.0%', false),
          k('Total revenue', '$45.6K', '-10.1%', false),
          k('Impression share', '73.49%', 'on target', true),
          k('Blended RoAS', '5.0:1', 'above benchmark', true),
        ],
        table: {
          title: 'By campaign',
          columns: [{ key: 'c', label: 'Campaign', align: 'left' }, { key: 'clicks', label: 'Clicks', align: 'right' }, { key: 'ctr', label: 'CTR', align: 'right' }, { key: 'cpc', label: 'CPC', align: 'right' }, { key: 'is', label: 'Impr. share', align: 'right' }, { key: 'tx', label: 'Tx', align: 'right' }, { key: 'rev', label: 'Revenue', align: 'right' }, { key: 'roas', label: 'RoAS', align: 'right' }],
          rows: [
            { c: 'Branded Search', clicks: '7,260', ctr: '33.06%', cpc: '$1.06', is: '73.49%', tx: '63', rev: '$42,728', roas: '5.57:1' },
            { c: 'Performance Max', clicks: '2,556', ctr: '4.39%', cpc: '$0.58', is: ', ', tx: '3', rev: '$2,889', roas: '1.96:1' },
          ],
          total: { c: 'Grand total', clicks: '9,816', ctr: '12.25%', cpc: '$0.93', is: '73.49%', tx: '66', rev: '$45,617', roas: '4.99:1' },
        },
      },
      overview: {
        narrative:
          "Paid search had a strong, efficient month. CPC ($0.93) is well below the brand benchmark, you held a 5:1 return, and brand impression share sat at 73%, exactly where we want it to keep OTAs from bidding over you. CTR ticked down, but that's expected: Performance Max widened reach to new prospects, which dilutes click-rate while growing the funnel.",
        numbers: [k('CPC', '$0.93', 'efficient'), k('Impression share', '73%', 'on target')],
        sources: [SRC.gads],
      },
      questions: [
        { id: 'p-is', label: 'Is my impression share where it should be?', answer: { confidence: 'high', narrative: "Yes, 73% brand impression share is right in the 70-80% target. Brand search is your moat: when someone searches South Coast Winery, you want to be the click, not an OTA reselling your rooms. There's ~7 points of headroom to push toward 80% if you want to fully box out the OTAs.", chart: { type: 'stat', value: '73.49%', label: 'Brand impression share', sub: 'Target 70-80% · ~7 pts of headroom' }, numbers: [k('Impression share', '73%', 'in target'), k('Headroom', '~7 pts', 'to 80%')], sources: [SRC.gads] } },
        { id: 'p-ctr', label: 'Why did CTR drop?', answer: { confidence: 'high', narrative: "By design. Performance Max launched to reach new prospecting audiences earlier in the funnel; those broader audiences click at a lower rate than someone searching your brand, so blended CTR came down as impressions expanded 147%. Brand CTR itself stayed strong at 33%.", numbers: [k('Brand CTR', '33%', 'strong'), k('Driver', 'P-Max reach', 'expected')], sources: [SRC.gads] } },
        { id: 'p-shift', label: 'Should I shift budget in Google Ads?', answer: { confidence: 'medium', narrative: "Modestly. Brand is efficient and protected, keep it funded; with ~7 points of impression-share headroom, a small brand-defense increase could fully box out OTAs. Give Performance Max another cycle to mature, it's already producing bookings at a 2:1 early return and improves as it learns. I wouldn't pull from either yet.", numbers: [], sources: [SRC.gads] } },
      ],
    },

    /* ===== SOCIAL ===== */
    {
      id: 'social',
      label: 'Social',
      eyebrow: 'Paid social',
      lede:
        "Social is an exposure play that supports brand awareness and lifts direct and organic channels. It performed strong against benchmarks, with a 0.50% engagement CTR and a 5.7:1 RoAS, gaining real brand visibility through big increases in clicks and impressions.",
      budget: { gross: '$8,750', net: '$6,950', campaigns: 'Retargeting & Prospecting' },
      benchmarks: ['CTR: industry average 0.05-0.8%', 'RoAS: industry average 2-4:1 (varies by offer, location, budget)'],
      takeaways: [
        { title: 'Strong & efficient', body: 'Engagement CTR 0.50% and RoAS 5.7:1, both above benchmark, with significant gains in clicks and impressions.' },
        { title: 'Full-funnel working', body: 'Retargeting drove the efficiency (1,069% RoAS); prospecting added valuable upper-funnel reach for future conversions.' },
        { title: 'Revenue grew YoY', body: 'With more spend, the channel delivered efficient revenue growth (+24%) on a healthy full-funnel strategy.' },
      ],
      month: {
        kpis: [
          k('Clicks', '2.2K', '+69.2%', true),
          k('Impressions', '440.0K', '+74.9%', true),
          k('CTR', '0.50%', '-3.3%', false),
          k('Cost', '$7.0K', '+130.7%', false),
          k('Transactions', '60', '+22.4%', true),
          k('Total revenue', '$39.9K', '+24.4%', true),
          k('Blended RoAS', '5.7:1', 'above benchmark', true),
          k('Cost / transaction', '$115.84', '', true),
        ],
        table: {
          title: 'By targeting',
          columns: [{ key: 'b', label: 'Bucket', align: 'left' }, { key: 'clicks', label: 'Clicks', align: 'right' }, { key: 'cost', label: 'Cost', align: 'right' }, { key: 'tx', label: 'Tx', align: 'right' }, { key: 'rev', label: 'Revenue', align: 'right' }, { key: 'roas', label: 'RoAS', align: 'right' }],
          rows: [
            { b: 'Retargeting', clicks: '796', cost: '$3,050', tx: '47', rev: '$32,610', roas: '1,069%' },
            { b: 'Prospecting', clicks: '1,400', cost: '$3,900', tx: '13', rev: '$7,340', roas: '188%' },
          ],
          total: { b: 'Grand total', clicks: '2,196', cost: '$6,950', tx: '60', rev: '$39,943', roas: '575%' },
        },
        campaigns: [
          { name: 'Evergreen · brand awareness', detail: 'Spend $543 · 7 tx · $8,346 · 15.3:1' },
          { name: 'MidWeek · 20% off stay', detail: 'Spend $4,828 · 39 tx · $25,166 · 5.21:1' },
          { name: 'SMSM · 20% off stay', detail: 'Spend $1,579 · 14 tx · $6,430 · 4.0:1' },
        ],
      },
      overview: {
        narrative:
          "Social did its job as an exposure play this month, and then some. Engagement CTR (0.50%) and RoAS (5.7:1) both beat benchmark, and clicks/impressions jumped on the added spend. Retargeting carried the efficiency at a 1,069% return while prospecting built upper-funnel reach for future bookings. Revenue grew 24% YoY.",
        numbers: [k('Blended RoAS', '5.7:1', ''), k('Revenue', '$39.9K', '+24%')],
        sources: [SRC.meta],
      },
      questions: [
        { id: 'so-best', label: 'Which campaign performed best?', answer: { confidence: 'high', narrative: "On pure efficiency, the Evergreen brand-awareness ad returned 15.3:1 on a small $543 spend. On volume, MidWeek (20% off) drove the most revenue at $25,166 (5.21:1). Retargeting overall returned a remarkable 1,069%, it's converting people who already know you.", numbers: [k('Top efficiency', 'Evergreen', '15.3:1'), k('Top revenue', 'MidWeek', '$25K')], sources: [SRC.meta] } },
        { id: 'so-prospecting', label: 'Is prospecting worth it?', answer: { confidence: 'medium', narrative: "Yes, with the right expectation. Prospecting returned 188% this month, lower than retargeting because it reaches people who don't know you yet. Its real value is upper-funnel: it grew reach and feeds future retargeting and organic/direct conversions. I'd keep it funded but judge it on assisted, not last-click, return.", numbers: [k('Prospecting RoAS', '188%', ''), k('Retargeting RoAS', '1,069%', '')], sources: [SRC.meta] } },
      ],
    },

    /* ===== DISPLAY ===== */
    {
      id: 'display',
      label: 'Display',
      eyebrow: 'Display',
      lede:
        "Display is an exposure play supporting brand awareness and direct/organic performance. The campaign leveraged a retargeting-focused strategy to drive conversions from high-intent audiences, and performed well against benchmarks with a solid 3.1:1 RoAS.",
      budget: { gross: '$3,000', net: '$1,605', campaigns: 'Retargeting & Prospecting' },
      benchmarks: ['CTR: industry average 0.08-1%', 'RoAS: industry average 1-3:1'],
      takeaways: [
        { title: 'Retargeting-led', body: 'The campaign focused on retargeting to convert high-intent audiences who had already engaged.' },
        { title: 'Solid return on a small budget', body: 'Display held a 3.1:1 RoAS, favorable against the 1-3:1 benchmark, on just $1,605 net.' },
        { title: 'Reduced spend, lower volume', body: 'With less budget, clicks and impressions declined YoY, lowering bookings and revenue for the month, an intentional pullback.' },
      ],
      month: {
        kpis: [
          k('Clicks', '70', '-34.0%', false),
          k('Impressions', '63.6K', '-54.1%', false),
          k('CTR', '0.11%', '+44.0%', true),
          k('Cost', '$1.6K', '-34.7%', true),
          k('Transactions', '10', '-60.0%', false),
          k('Total revenue', '$5.0K', '-65.4%', false),
          k('Avg transaction value', '$506', '', true),
          k('Blended RoAS', '3.1:1', 'above benchmark', true),
        ],
        table: {
          title: 'By targeting',
          columns: [{ key: 'b', label: 'Bucket', align: 'left' }, { key: 'clicks', label: 'Clicks', align: 'right' }, { key: 'cost', label: 'Cost', align: 'right' }, { key: 'tx', label: 'Tx', align: 'right' }, { key: 'rev', label: 'Revenue', align: 'right' }, { key: 'roas', label: 'RoAS', align: 'right' }],
          rows: [{ b: 'Retargeting', clicks: '70', cost: '$1,605', tx: '10', rev: '$5,061', roas: '315%' }],
          total: { b: 'Grand total', clicks: '70', cost: '$1,605', tx: '10', rev: '$5,061', roas: '315%' },
        },
      },
      overview: {
        narrative:
          "Display ran lean this month, an intentional pullback in spend. Even so it held a solid 3.1:1 return through a retargeting-focused strategy aimed at high-intent audiences. Lower budget meant fewer clicks and bookings YoY, but efficiency stayed favorable against the 1-3:1 benchmark.",
        numbers: [k('Blended RoAS', '3.1:1', ''), k('Net spend', '$1,605', '-35%')],
        sources: [SRC.td],
      },
      questions: [
        { id: 'di-worth', label: 'Did display retargeting pay off?', answer: { confidence: 'high', narrative: "On efficiency, yes, 3.1:1 is above the 1-3:1 display benchmark, and it converted high-intent audiences who'd already engaged. On volume it was small by design: you pulled spend back to $1,605, so bookings and revenue are down YoY. It's playing a support role, not a primary driver.", numbers: [k('RoAS', '3.1:1', 'above benchmark'), k('Transactions', '10', '-60%')], sources: [SRC.td] } },
        { id: 'di-keep', label: 'Should we keep display next month?', answer: { confidence: 'medium', narrative: "Keep it small and retargeting-focused. At a 3:1 return it earns its place as a low-cost reinforcement for high-intent audiences, but it's not where I'd add budget for growth, social prospecting and brand search are doing more of that work. Maintain, don't expand.", numbers: [], sources: [SRC.td] } },
      ],
    },

    /* ===== MEDIA MIX ===== */
    {
      id: 'media',
      label: 'Media Mix',
      eyebrow: 'Media overview · all paid',
      lede:
        "Across all paid media, increased investment expanded reach and visibility for a blended 5:1 return, with every channel surpassing its RoAS benchmark. Budget shifted toward upper-funnel prospecting, so this isn't a true 1:1 comparison to last year.",
      benchmarks: ['Blended RoAS: properties generally range 3-8:1'],
      takeaways: [
        { title: 'Blended RoAS 5:1', body: 'All paid channels (Search, Social, Display) surpassed their RoAS benchmark goals; properties generally range 3-8:1.' },
        { title: 'Not a 1:1 YoY', body: 'Budget expanded toward upper-funnel prospecting this year, so the blended return is not a direct comparison to last year.' },
        { title: 'Reach up, value offset volume', body: 'Increased investment drove significant impression and click growth; transaction/revenue volume softened YoY, but a higher average transaction value helped offset it.' },
      ],
      month: {
        kpis: [
          k('Clicks', '12.1K', '+16.6%', true),
          k('Impressions', '583.7K', '+38.1%', true),
          k('Cost', '$18.0K', '+35.6%', false),
          k('CPC', '$1.46', '+16.3%', false),
          k('Transactions', '136', '-20.5%', false),
          k('Total revenue', '$90.6K', '-7.0%', false),
          k('Avg transaction value', '$666', '+16.9%', true),
          k('Blended RoAS', '512%', '-31.4%', true),
        ],
        table: {
          title: 'By media type',
          columns: [{ key: 't', label: 'Media', align: 'left' }, { key: 'clicks', label: 'Clicks', align: 'right' }, { key: 'cost', label: 'Cost', align: 'right' }, { key: 'tx', label: 'Tx', align: 'right' }, { key: 'rev', label: 'Revenue', align: 'right' }, { key: 'roas', label: 'RoAS', align: 'right' }],
          rows: [
            { t: 'Search', clicks: '9,816', cost: '$9,143', tx: '66', rev: '$45,617', roas: '499%' },
            { t: 'Social', clicks: '2,213', cost: '$6,950', tx: '60', rev: '$39,943', roas: '575%' },
            { t: 'Display', clicks: '70', cost: '$1,605', tx: '10', rev: '$5,061', roas: '315%' },
          ],
          total: { t: 'Grand total', clicks: '12,099', cost: '$17,698', tx: '136', rev: '$90,621', roas: '512%' },
        },
      },
      ytd: {
        kpis: [
          k('Clicks', '56.1K', '+11.6%', true),
          k('Impressions', '2.5M', '+29.1%', true),
          k('Cost', '$85K', '+26.1%', false),
          k('CPC', '$1.51', '+12.9%', false),
          k('Transactions', '998', '-18.7%', false),
          k('Total revenue', '$568.7K', '-14.9%', false),
          k('Avg transaction value', '$570', '+4.7%', true),
          k('Blended RoAS', '671%', '-32.5%', true),
        ],
        table: {
          title: 'By media type · YTD',
          columns: [{ key: 't', label: 'Media', align: 'left' }, { key: 'clicks', label: 'Clicks', align: 'right' }, { key: 'cost', label: 'Cost', align: 'right' }, { key: 'tx', label: 'Tx', align: 'right' }, { key: 'rev', label: 'Revenue', align: 'right' }, { key: 'roas', label: 'RoAS', align: 'right' }],
          rows: [
            { t: 'Search', clicks: '48,518', cost: '$46,727', tx: '524', rev: '$291,065', roas: '623%' },
            { t: 'Social', clicks: '7,279', cost: '$28,936', tx: '398', rev: '$232,238', roas: '803%' },
            { t: 'Display', clicks: '291', cost: '$9,139', tx: '76', rev: '$45,442', roas: '497%' },
          ],
          total: { t: 'Grand total', clicks: '56,088', cost: '$84,802', tx: '998', rev: '$568,745', roas: '671%' },
        },
      },
      overview: {
        narrative:
          "Across all paid media in May: $18k deployed for a blended ~5:1 return, with Search, Social and Display each above benchmark. You leaned into upper-funnel prospecting, which expanded impressions 38% and clicks 17%. Transaction volume dipped YoY, but a higher average transaction value ($666, +17%) offset much of it, the strategy bought reach and demand without sacrificing efficiency.",
        numbers: [k('Cost', '$18.0K', '+36%'), k('Blended RoAS', '5:1', '')],
        sources: [SRC.gads, SRC.meta, SRC.td],
      },
      questions: [
        { id: 'm-mix', label: 'How is the budget split across channels?', answer: { confidence: 'high', narrative: "In May: Search took $9.1k (66 bookings, 499% RoAS), Social $7.0k (60 bookings, 575%), and Display $1.6k (10 bookings, 315%). Search and Social are the workhorses; Display plays a small high-intent support role.", chart: { type: 'bars', format: 'currency-full', items: [{ label: 'Search', value: 9143 }, { label: 'Social', value: 6950 }, { label: 'Display', value: 1605 }] }, numbers: [], sources: [SRC.gads, SRC.meta, SRC.td] } },
        { id: 'm-worth', label: 'Was the extra spend worth it?', answer: { confidence: 'high', narrative: "Yes. You spent ~36% more and held a blended 5:1, with every channel above benchmark while reach grew (impressions +38%). The added dollars went to prospecting, which builds future demand rather than just harvesting it, and a higher average transaction value cushioned the YoY volume dip.", numbers: [k('Cost', '+36%', ''), k('Blended RoAS', '5:1', 'held')], sources: [SRC.gads, SRC.meta] } },
      ],
    },
  ],

  // ---------------- HISTORY ----------------
  history: [
    { period: '2026-04', label: 'April 2026', status: 'delivered', revenue: '$197K', roas: '5.3:1' },
    { period: '2026-03', label: 'March 2026', status: 'delivered', revenue: '$214K', roas: '5.6:1' },
    { period: '2026-02', label: 'February 2026', status: 'delivered', revenue: '$188K', roas: '5.4:1' },
    { period: '2026-01', label: 'January 2026', status: 'delivered', revenue: '$176K', roas: '5.0:1' },
    { period: '2025-12', label: 'December 2025', status: 'delivered', revenue: '$241K', roas: '5.9:1' },
  ],
}

// Keyword-match free text within a section's questions; honest fallback otherwise.
export function matchSectionAnswer(section, text) {
  const q = text.toLowerCase()
  const hit = section.questions?.find((item) =>
    item.label.toLowerCase().split(/\W+/).some((w) => w.length > 3 && q.includes(w))
  )
  if (hit) return hit.answer
  return {
    narrative:
      "I don't have that one wired for this section yet. I can walk you through anything in this report, the numbers, why they moved, or what to do next. Try a suggested question, or ask about a specific metric.",
    numbers: [],
    sources: [],
  }
}
