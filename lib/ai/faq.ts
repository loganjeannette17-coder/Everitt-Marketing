// ============================================================================
// AI Widget — Structured FAQ + Tone Guardrails
// v1: Rules-based with FAQ matching + lead qualification flow
// v2 path: Replace matchFAQ() with RAG over documents table using pgvector
// ============================================================================

export interface FAQEntry {
  id: string
  keywords: string[]
  question: string
  answer: string
  suggestions?: string[]
}

// Structured knowledge base — update without redeploying
export const FAQ_ENTRIES: FAQEntry[] = [
  {
    id: 'services',
    keywords: ['service', 'offer', 'do', 'help', 'what', 'speciali'],
    question: 'What services do you offer?',
    answer: `Everitt Marketing & Co. operates across five disciplines:

**Paid Advertising** — Meta, Google, TikTok, and programmatic. We manage strategy, execution, and optimization with a focus on contribution-margin efficiency, not just ROAS headlines.

**ROI & ROAS Optimization** — Attribution architecture, channel-level efficiency analysis, bid strategy, and budget allocation. We fix accounts that are scaling inefficiently or hitting ceilings.

**Website Development** — Performance-first builds on Next.js, Shopify, or WordPress. We build for conversion, Core Web Vitals, and growth — not just aesthetics.

**Brand Scaling Strategy** — Channel mix modeling, creative positioning, and growth roadmapping for brands ready to move from traction to scale.

**Analytics & Attribution** — Implementing measurement stacks that give you reliable data: server-side events, post-purchase surveys, incrementality testing, and MER tracking.`,
    suggestions: ['What does an engagement look like?', 'What industries do you work with?', 'How is pricing structured?'],
  },
  {
    id: 'roas',
    keywords: ['roas', 'return', 'roi', 'performance', 'result', 'metric', 'kpi'],
    question: 'What ROAS can I expect?',
    answer: `Results depend heavily on your tracking maturity, creative quality, and market conditions — we won't promise a number before understanding your account.

**Typical levers we pull:**
- Fixing attribution gaps that make performance look worse (or better) than it is
- Restructuring campaign architecture to improve signal quality
- Accelerating creative testing velocity to find winners faster
- Optimizing budget allocation across channels based on true incrementality

Across our client base, we typically see 60–150% ROAS improvement within the first 90 days when there are structural inefficiencies to address. But the right metric depends on your margins: for many businesses, MER or contribution margin tells a truer story than platform ROAS.

*These are illustrative outcomes — your results will depend on your specific account, market, and margin profile.*`,
    suggestions: ['What is MER and why does it matter?', 'How do you measure success?', 'Can I see case studies?'],
  },
  {
    id: 'pricing',
    keywords: ['price', 'cost', 'fee', 'pricing', 'charge', 'rate', 'budget', 'expensive'],
    question: 'How is pricing structured?',
    answer: `Our engagements are structured around scope and impact, not arbitrary percentage-of-spend models.

**Typical structures:**
- **Retained advisory** — Monthly retainer covering strategy, execution oversight, and reporting. Starts at $3,500/month for focused accounts; most full-service engagements run $6K–$15K/month.
- **Project-based** — Attribution audits, account restructures, website builds. Scoped and fixed-fee.
- **Performance-aligned** — For qualifying accounts at scale, we can structure part of the fee against incremental revenue. We discuss this after a strategy call.

Minimum recommended ad spend is typically $15K/month for paid media engagements — below that, the testing surface is too small to iterate meaningfully.

The best starting point is a 30-minute strategy call where we look at your current performance and scope what would move the needle.`,
    suggestions: ['What does the onboarding process look like?', 'Book a strategy call', 'What ad spend do I need?'],
  },
  {
    id: 'process',
    keywords: ['process', 'onboard', 'start', 'begin', 'engagement', 'work', 'together', 'first step'],
    question: 'What does your engagement process look like?',
    answer: `We follow a structured four-phase model:

**1. Audit & Diagnosis (Week 1–2)**
Full account audit: attribution health, campaign structure, creative analysis, channel mix, and benchmark positioning. We identify the highest-leverage opportunities before recommending anything.

**2. Strategy & Architecture (Week 2–3)**
We present a growth plan with prioritized initiatives, projected outcomes (with honest confidence ranges), and a 90-day roadmap.

**3. Execution (Months 1–3)**
Hands-on implementation: restructure, new creative, attribution setup, testing cadence launch. Weekly check-ins with shared dashboards.

**4. Optimization & Scale (Ongoing)**
Monthly attribution reviews, creative performance analysis, budget pacing against targets. Reporting cadence includes a weekly snapshot email + monthly deep-dive.`,
    suggestions: ['How quickly will I see results?', 'What reporting do I get?', 'Start the conversation'],
  },
  {
    id: 'reporting',
    keywords: ['report', 'dashboard', 'data', 'visibility', 'update', 'communication'],
    question: 'What reporting and dashboards do clients receive?',
    answer: `Clients get institutional-grade visibility into their performance:

**Weekly:**
- Snapshot email: spend, revenue, ROAS/MER vs. target, top creative performance, flags
- Slack or Teams channel for async updates (if preferred)

**Monthly:**
- Full attribution review: channel-level true ROAS, incrementality estimates, CAC by cohort
- Creative performance analysis: winner/loser breakdown, next-cycle brief
- Budget pacing vs. plan with variance commentary
- Strategic recommendations for the next period

**Dashboards:**
- Live Looker Studio dashboard (your data, your ownership)
- Optional: custom reporting portal with historical trends

We don't hide behind vanity metrics. If something isn't working, you'll see it in the data and in our commentary — that's how trust gets built.`,
    suggestions: ['What does your process look like?', 'Can I see case studies?', 'Book a strategy call'],
  },
  {
    id: 'industries',
    keywords: ['industry', 'vertical', 'niche', 'sector', 'ecommerce', 'saas', 'b2b', 'dtc', 'brand'],
    question: 'What industries do you work with?',
    answer: `Our core focus areas are:

**DTC & E-commerce** — Apparel, beauty, health, home goods. Strong in Shopify/Meta/Google stacks.

**B2B SaaS & Tech** — Demand generation, pipeline efficiency, LinkedIn + Google paid programs.

**Subscription & Membership** — CAC, LTV, and payback optimization for recurring-revenue businesses.

**Professional Services** — Lead generation and brand authority for agencies, consultancies, and high-ticket service businesses.

We're deliberate about not spreading thin. If your vertical is highly regulated (certain financial services, healthcare with strict claims requirements), we'll be honest about fit before engaging.`,
    suggestions: ['What services do you offer?', 'Can I see case studies?', 'Start the conversation'],
  },
  {
    id: 'attribution',
    keywords: ['attribution', 'track', 'pixel', 'ios', 'privacy', 'measure', 'data'],
    question: 'How do you handle attribution in a post-iOS14 world?',
    answer: `Attribution is one of our core competencies — not an afterthought.

**Our standard measurement stack:**
1. **Server-side conversion API** — Meta CAPI, Google Enhanced Conversions, TikTok Events API. Captures what the pixel misses.
2. **Post-purchase survey** — "How did you hear about us?" surfaces dark social and word-of-mouth that no pixel can see.
3. **UTM architecture** — Clean, consistent tagging across all channels for GA4 and third-party attribution tools.
4. **MER tracking** — Total revenue ÷ total spend at the account level. Privacy-proof, manipulation-resistant.
5. **Geo-based incrementality tests** — Periodic tests to validate platform-reported ROAS against true incremental impact.

We recommend treating platform ROAS as directional and MER as your north star. Most brands find their true efficiency is 20–40% different from what platforms report.`,
    suggestions: ['What is MER and why does it matter?', 'What does your process look like?', 'Book a strategy call'],
  },
  {
    id: 'creative',
    keywords: ['creative', 'ad', 'content', 'video', 'design', 'ugc', 'copy', 'asset'],
    question: 'Do you handle creative production?',
    answer: `Yes — creative is a core part of our offering, not a bolt-on.

**Creative Operations:**
- Brief development based on audience insights and competitor analysis
- Static and video ad production (in-house and via vetted production partners)
- UGC sourcing and direction
- Creative testing framework: systematic hypothesis-driven testing, not random variation
- Performance analysis: we measure and document why creatives win or lose

**Testing Cadence:**
We run a structured weekly creative cycle — brief Monday, produce mid-week, launch Thursday, read Friday. Winning creatives get scaled within 72 hours of reaching statistical confidence. Losers are killed, documented, and learned from.

Our clients typically run 20–40 new concepts per month. Volume isn't the goal — *learning velocity* is.`,
    suggestions: ['What industries do you work with?', 'How do you handle attribution?', 'Start the conversation'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'talk', 'call', 'meet', 'start', 'hire', 'engage', 'book', 'reach'],
    question: 'How do I get started?',
    answer: `The best first step is a 30-minute strategy call — no commitment, no pitch deck, just an honest look at where you are and what would move the needle.

**To start the conversation:**
Use the contact form on this page or click "Book a Strategy Call" — we'll respond within one business day.

**What to expect:**
1. Brief intake form (5 minutes) to understand your current setup
2. 30-minute video call with a senior strategist
3. If there's mutual fit, we'll scope a proposal within 48 hours

We don't take every engagement. If we don't think we can meaningfully move your metrics, we'll say so — and often point you toward what would help more.`,
    suggestions: ['What does your process look like?', 'How is pricing structured?', 'What services do you offer?'],
  },
]

// Lead qualification flow — 6 questions that build a qualification summary
export const QUALIFICATION_STEPS = [
  {
    step: 1,
    field: 'monthly_spend',
    question: "What's your approximate monthly ad spend right now?",
    options: [
      'Under $5K/month',
      '$5K–$15K/month',
      '$15K–$50K/month',
      '$50K–$150K/month',
      '$150K+/month',
    ],
  },
  {
    step: 2,
    field: 'primary_goal',
    question: 'What\'s your primary growth objective over the next 6 months?',
    options: [
      'Scale revenue while maintaining ROAS',
      'Reduce CAC / improve efficiency',
      'Enter new channels (Meta, TikTok, Google)',
      'Fix broken attribution / data quality',
      'Launch a new brand or product line',
    ],
  },
  {
    step: 3,
    field: 'current_channels',
    question: 'Which paid channels are you currently active on?',
    options: [
      'Meta (Facebook/Instagram)',
      'Google (Search/Shopping/PMax)',
      'TikTok',
      'LinkedIn',
      'Not running paid ads yet',
    ],
  },
  {
    step: 4,
    field: 'main_challenge',
    question: "What's the biggest bottleneck in your growth right now?",
    options: [
      'Creative quality or velocity',
      'Attribution / measurement gaps',
      'Scaling spend without killing efficiency',
      'Strategy and direction',
      'In-house bandwidth / execution',
    ],
  },
  {
    step: 5,
    field: 'timeline',
    question: 'When are you looking to make a change?',
    options: [
      'Immediately — things are urgent',
      'Within 30 days',
      '1–3 months from now',
      'Just exploring options',
    ],
  },
  {
    step: 6,
    field: 'company_stage',
    question: 'How would you describe your business stage?',
    options: [
      'Pre-revenue / early stage',
      'Traction (product-market fit, growing)',
      'Scale (optimizing and expanding)',
      'Enterprise (complex, multi-channel)',
    ],
  },
]

// Match user input to FAQ entries
export function matchFAQ(userMessage: string): FAQEntry | null {
  const lower = userMessage.toLowerCase()
  let bestMatch: FAQEntry | null = null
  let bestScore = 0

  for (const entry of FAQ_ENTRIES) {
    const score = entry.keywords.filter((kw) => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = entry
    }
  }

  return bestScore >= 1 ? bestMatch : null
}

// Generate qualification summary from answers
export function generateQualificationSummary(
  answers: Record<string, string>,
  contactInfo: { name: string; company: string }
): string {
  const { monthly_spend, primary_goal, current_channels, main_challenge, timeline, company_stage } =
    answers

  return `Lead: ${contactInfo.name} from ${contactInfo.company}.

Stage: ${company_stage || 'Unknown'}
Monthly spend: ${monthly_spend || 'Not specified'}
Primary goal: ${primary_goal || 'Not specified'}
Current channels: ${current_channels || 'Not specified'}
Main challenge: ${main_challenge || 'Not specified'}
Timeline: ${timeline || 'Not specified'}

Qualified via: Website AI assistant`
}

// Guardrail: detect and redirect off-topic requests
export function isOffTopic(message: string): boolean {
  const blocked = [
    'weather', 'recipe', 'joke', 'game', 'sport',
    'politics', 'stock tip', 'invest in', 'guaranteed',
    'promise', 'definitely will', 'always achieve',
  ]
  const lower = message.toLowerCase()
  return blocked.some((term) => lower.includes(term))
}

// Default / fallback responses
export const FALLBACK_RESPONSE = `I'm here to help with questions about Everitt Marketing & Co.'s services, process, and approach.

Some things I can help with:
- **Services** — what we offer and how we operate
- **Process** — what an engagement looks like, timelines
- **Pricing** — how we structure fees
- **Attribution** — how we approach measurement
- **Results** — what outcomes clients typically see (with appropriate context)

What would you like to know?`

export const GREETING_RESPONSE = `Hi! I'm the Everitt assistant — I can answer questions about our services, process, and approach to growth marketing.

What's on your mind? Or if you're ready, I can walk you through a quick 6-question diagnostic to help us understand your situation before a call.`
