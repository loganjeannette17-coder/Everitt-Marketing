# Everitt Marketing & Co. — Marketing Website

Production-ready marketing site for Everitt Marketing & Co. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase.

---

## Architecture Overview

```
app/
├── layout.tsx              # Root layout — fonts, metadata, analytics, cursor
├── page.tsx                # Homepage — stitches all sections
├── globals.css             # Design tokens, base styles, animations
└── api/
    ├── leads/route.ts      # Lead capture — validates, stores, notifies
    ├── ai-chat/route.ts    # AI widget backend — FAQ matching + guardrails
    ├── kpis/route.ts       # Terminal KPI data from Supabase
    ├── case-studies/       # Case studies feed
    ├── testimonials/       # Testimonials feed
    ├── insights/           # Research desk feed
    └── subscribe/          # Newsletter signup

components/
├── layout/
│   ├── Header.tsx          # Sticky nav with scroll detection
│   ├── Footer.tsx          # Full footer with site map
│   ├── CustomCursor.tsx    # Magnetic cursor — desktop only, touch/reduced-motion off
│   ├── StickyCtA.tsx       # Floating CTA — shows on scroll depth
│   └── AnalyticsProvider.tsx # Scroll depth tracking init
├── sections/
│   ├── Hero.tsx            # Hero + ticker strip + mouse parallax
│   ├── Terminal.tsx        # Bloomberg-style KPI dashboard
│   ├── Services.tsx        # 6-service grid
│   ├── CaseStudies.tsx     # Expandable case study accordion
│   ├── Methodology.tsx     # 6-pillar methodology grid + editorial quote
│   ├── Testimonials.tsx    # Auto-advancing carousel
│   ├── Insights.tsx        # Research desk cards + newsletter form
│   ├── AIWidget.tsx        # On-site AI assistant + lead qualification
│   └── LeadCapture.tsx     # Contact form with React Hook Form + Zod
└── ui/
    ├── MagneticButton.tsx  # Magnetic buttons with spring physics
    ├── ScrollReveal.tsx    # useInView reveal + stagger containers
    ├── NumberTicker.tsx    # Animated counters with easing
    ├── Sparkline.tsx       # Canvas-based sparkline charts
    ├── GlassCard.tsx       # Glass panel + terminal card variants
    └── cn.ts               # clsx + tailwind-merge utility

lib/
├── supabase/
│   ├── client.ts           # Browser client (anon key)
│   └── server.ts           # Server client (anon key) + service role client
├── ai/faq.ts               # Structured FAQ knowledge base + qualification flow
└── analytics.ts            # PostHog / Plausible event bridge

supabase/
├── migrations/001_initial_schema.sql   # Full schema + RLS policies
└── seed.sql                            # Demo data (KPIs, case studies, insights, testimonials)

types/index.ts              # Shared TypeScript types
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url> everitt-marketing
cd everitt-marketing
npm install        # or: pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase values (see [Supabase Setup](#supabase-setup) below).

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase Setup

### Create a project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** (Settings → API)
3. Note your **Service Role Key** (Settings → API — keep this secret)

### Run migrations

**Option A: Supabase CLI**
```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push supabase/migrations/001_initial_schema.sql
```

**Option B: Supabase Dashboard**
1. Go to your project → SQL Editor
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Run it

### Seed demo data

After migrations, seed the demo content:

**Option A: CLI**
```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

**Option B: Dashboard**
1. SQL Editor → paste contents of `supabase/seed.sql` → Run

### Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key    # never expose to browser
```

---

## Optional Integrations

### Email notifications (Resend)

When a lead submits the contact form, an email is sent to your team if `RESEND_API_KEY` is set.

```env
RESEND_API_KEY=re_your-key
RESEND_FROM_EMAIL=notifications@yourdomain.com
RESEND_TO_EMAIL=team@everittmarketing.com
```

If unset, lead capture works normally — the email just isn't sent.

### Analytics (PostHog or Plausible)

Either or both can be active simultaneously:

```env
# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_your-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=everittmarketing.com
```

Tracked events:
- `form_start` — user focuses any form
- `form_submit` — form submitted (with success boolean)
- `ai_open` — AI widget opened
- `ai_message` — at 3+ messages in AI widget
- `cta_click` — any CTA clicked (with `cta` and `location` props)
- `scroll_depth` — at 25%, 50%, 75%, 100% scroll
- `case_study_view` — case study expanded
- `insight_click` — insight card clicked

### AI Enhancement (v2 path)

The AI widget uses structured FAQ matching in v1. To upgrade to Claude-powered responses:

1. Add `ANTHROPIC_API_KEY` to your env
2. Uncomment the Claude API block in `app/api/ai-chat/route.ts`
3. Enable the `vector` extension in Supabase and uncomment the `embedding` column in `documents` table
4. Build a document ingestion pipeline that chunks content and stores embeddings

---

## Vercel Deployment

### Deploy

1. Push to GitHub
2. Import to Vercel
3. Set environment variables in Vercel Dashboard (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - Optional: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`
   - Optional: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
   - `NEXT_PUBLIC_SITE_URL` (set to your production domain)

### Build settings (auto-detected)

```
Build Command:  npm run build
Output Dir:     .next
Install:        npm install
```

### Edge / Runtime notes

All Route Handlers run on the Node.js runtime (default). No edge functions needed. Supabase `@supabase/ssr` is compatible with the Node runtime used by Vercel serverless functions.

---

## Security Model

| Layer | Mechanism |
|-------|-----------|
| Supabase public read | RLS policies allow `SELECT` on published marketing content for anon users |
| Lead writes | Service role key used server-side in Route Handlers — never exposed to browser |
| Newsletter writes | Same — service role via `/api/subscribe` |
| KPI writes | Service role only — authenticated users or direct DB access |
| Client keys | `NEXT_PUBLIC_*` keys are anon-only, safe to expose |
| Service role | Never in client bundles — server-only import path |
| CSP headers | Configured in `next.config.ts` — restricts scripts, styles, connections |
| Security headers | X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy |

---

## Content Management

All marketing content can be updated without redeploying by editing rows in Supabase:

| Content | Table | Notes |
|---------|-------|-------|
| Terminal KPIs | `kpis` | Update `value`, `sparkline` JSON array |
| Case studies | `case_studies` | Toggle `published` to show/hide |
| Testimonials | `testimonials` | Toggle `published` to show/hide |
| Insights | `insights` | Add rows; toggle `published` |
| Leads | `leads` | Read-only from dashboard; update `status` to track pipeline |

---

## A/B Testing (placeholder)

To add headline A/B tests in the future:

1. Set a feature flag in PostHog or a homegrown flag system
2. In `components/sections/Hero.tsx`, wrap the headline in a condition:
   ```tsx
   const variant = useFeatureFlag('hero_headline') // 'control' | 'variant_a'
   ```
3. PostHog Experiments or Vercel Edge Config work well here

A comment marking the Hero headline as the `// [A/B TEST ANCHOR]` location is the hook point.

---

## Development Notes

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # TypeScript check without building
npm run lint         # ESLint
```

No test suite is included in v1. Recommended additions:
- Vitest for unit tests (FAQ matching logic, Zod schemas)
- Playwright for E2E (form submission, AI widget flow)

---

## Legal Notes

- Platform names (Meta, Google, TikTok, LinkedIn, Shopify) are trademarks of their owners. Use "platforms we operate" framing, not "official partner."
- Performance data shown in the terminal and on the site is illustrative/anonymized. Fine print is displayed in UI.
- AI widget privacy note is displayed in the widget footer explaining data handling.
- No guaranteed ROI claims — language uses "typical levers" and "illustrative outcomes" throughout.
