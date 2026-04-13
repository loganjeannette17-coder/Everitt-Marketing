-- ============================================================================
-- Seed data — Demo content for Everitt Marketing & Co
-- Run after migration: psql $DATABASE_URL -f supabase/seed.sql
--   OR paste into Supabase SQL editor after running migrations
-- ============================================================================

-- ─── KPIs (terminal headline stats) ──────────────────────────────────────────
INSERT INTO kpis (key, label, value, unit, trend, sparkline) VALUES
  ('blended_roas',   'Blended ROAS',      '4.2',  '×',  1,  '[1.8,2.0,2.2,2.4,2.8,3.1,3.4,3.7,4.0,4.2]'),
  ('avg_cac_change', 'CAC Reduction',     '-31',  '%',  1,  '[0,-4,-9,-12,-17,-20,-24,-27,-30,-31]'),
  ('mer',            'MER',               '3.8',  '×',  1,  '[2.1,2.3,2.5,2.8,3.0,3.2,3.5,3.6,3.7,3.8]'),
  ('managed_spend',  'Monthly Spend Mgd', '$2.4', 'M',  1,  '[0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.1,2.3,2.4]'),
  ('creative_iter',  'Creative Iterations/Mo', '47', '',  0,  '[20,25,28,32,36,38,40,42,45,47]'),
  ('channel_roas_meta',   'Meta ROAS',    '4.6',  '×',  1,  '[2.1,2.4,2.8,3.2,3.6,3.9,4.1,4.3,4.5,4.6]'),
  ('channel_roas_google', 'Google ROAS',  '3.9',  '×',  1,  '[2.0,2.2,2.5,2.8,3.1,3.4,3.6,3.7,3.8,3.9]'),
  ('channel_roas_tiktok', 'TikTok ROAS',  '3.1',  '×',  1,  '[1.2,1.4,1.7,2.0,2.3,2.6,2.8,2.9,3.0,3.1]')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  trend = EXCLUDED.trend,
  sparkline = EXCLUDED.sparkline,
  updated_at = NOW();

-- ─── Case Studies ─────────────────────────────────────────────────────────────
INSERT INTO case_studies (slug, title, industry, size_band, challenge, approach, execution, results_json, hero_stat, hero_label, tags, published, sort_order) VALUES
(
  'dtc-apparel-roas',
  'Scaling a DTC Apparel Brand from Breakeven to 4× ROAS',
  'DTC Apparel',
  '$3M–$8M revenue',
  'A fast-growing apparel brand was running Meta Ads at a 1.3× blended ROAS — barely covering CAC with no attribution clarity. Spend was flat because every scaling attempt crushed efficiency. The creative team was producing assets based on intuition, not data.',
  'We deployed a three-layer attribution stack (pixel + server-side API + post-purchase survey) to establish ground truth. Channel mix was restructured around a prospecting → retargeting → retention funnel. Creative was moved into a structured testing cadence: 6 new concepts per week, winners scaled within 72 hours of statistical confidence.',
  'Migrated campaigns to a consolidated campaign architecture with incremental budget testing. Launched creative ops workflow (brief → concept → production → launch → analysis) that cut creative cycle time from 3 weeks to 5 days. Meta Advantage+ Catalog and broad-audience prospecting replaced fragmented interest stacks.',
  '{
    "headline": "4.1× blended ROAS, 62% revenue growth in 90 days",
    "metrics": [
      {"label": "Blended ROAS", "before": "1.3×", "after": "4.1×", "delta": "+215%"},
      {"label": "Monthly Revenue", "before": "$280K", "after": "$453K", "delta": "+62%"},
      {"label": "CAC", "before": "$74", "after": "$41", "delta": "-45%"},
      {"label": "Creative Testing Velocity", "before": "4/mo", "after": "24/mo", "delta": "+500%"}
    ],
    "period": "90 days"
  }',
  '4.1×',
  'blended ROAS',
  ARRAY['Meta Ads', 'Attribution', 'Creative Ops', 'DTC'],
  TRUE,
  1
),
(
  'b2b-saas-cac',
  'Cutting B2B SaaS CAC by 38% with Demand-Gen Restructure',
  'B2B SaaS',
  '$8M–$25M ARR',
  'A Series B SaaS company was generating leads through Google and LinkedIn, but CAC had climbed 60% over 18 months while close rates held flat. Marketing and sales were misaligned on lead quality — volume was there, intent was not.',
  'Rather than optimizing within the existing campaign structure, we rebuilt the demand-generation model around intent signals. LinkedIn was restructured around job-function segments with tailored copy per persona. Google Search was rebuilt with exact-match + SKAG architecture focused on bottom-of-funnel terms only. Remarketing was layered with sequential messaging to warm intent segments.',
  'Implemented lead scoring in HubSpot aligned to ICP firmographics, allowing us to feed only MQL+ leads to sales. Google Demand Gen was tested against pure Search to find the lowest-CAC acquisition channel. Monthly attribution reviews were built into the cadence to catch channel decay early.',
  '{
    "headline": "38% CAC reduction, 2.1× pipeline from same budget",
    "metrics": [
      {"label": "CAC", "before": "$1,840", "after": "$1,140", "delta": "-38%"},
      {"label": "MQL-to-SQL Rate", "before": "18%", "after": "34%", "delta": "+89%"},
      {"label": "Pipeline Generated", "before": "$1.2M/mo", "after": "$2.5M/mo", "delta": "+108%"},
      {"label": "Google CPC", "before": "$48", "after": "$31", "delta": "-35%"}
    ],
    "period": "6 months"
  }',
  '38%',
  'CAC reduction',
  ARRAY['Google Ads', 'LinkedIn', 'B2B', 'Lead Gen', 'Attribution'],
  TRUE,
  2
),
(
  'ecomm-scaling',
  'Taking a $400K/mo E-commerce Brand to $1.1M During Peak Season',
  'E-commerce (Home & Lifestyle)',
  '$15M–$40M revenue',
  'An established home goods brand had a consistent $400K/month in revenue but had never cracked $600K — primarily due to creative fatigue and a single-channel dependency on Google Shopping. Peak season (Q4) was underutilized: spend went up, efficiency collapsed.',
  'Six months before Q4, we initiated a full creative library build: 80+ static concepts, 30 video assets across formats optimized for Meta, TikTok, and YouTube. Channel mix was diversified from 90% Google to a balanced Google/Meta/TikTok stack. Q4 pacing was modeled with daily efficiency thresholds — spend was automated to scale only when 7-day ROAS held above target.',
  'Deployed incrementality testing to understand true channel lift. Creative was segmented by funnel stage and audience temperature. Automated rules managed daily budget allocation with hard floors on ROAS. Real-time dashboard was built in Looker Studio for client visibility into pacing vs. plan.',
  '{
    "headline": "$1.1M revenue month during peak, 2.7× YoY",
    "metrics": [
      {"label": "Peak Month Revenue", "before": "$400K", "after": "$1.1M", "delta": "+175%"},
      {"label": "Blended ROAS", "before": "2.8×", "after": "4.4×", "delta": "+57%"},
      {"label": "TikTok ROAS (new channel)", "before": "0", "after": "3.2×", "delta": "New"},
      {"label": "Q4 Managed Spend", "before": "$140K", "after": "$250K", "delta": "+79%"}
    ],
    "period": "Peak season (Oct–Dec)"
  }',
  '2.7×',
  'YoY peak revenue',
  ARRAY['Meta Ads', 'Google Ads', 'TikTok', 'E-commerce', 'Creative Ops'],
  TRUE,
  3
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  results_json = EXCLUDED.results_json,
  published = EXCLUDED.published;

-- ─── Testimonials ─────────────────────────────────────────────────────────────
INSERT INTO testimonials (quote, author_name, author_title, company_label, rating, published, sort_order) VALUES
(
  'Everitt didn''t just run our ads — they built an operating system for our paid media. For the first time, I actually trust our attribution numbers, and I know exactly where every dollar is working.',
  'Sarah K.',
  'Head of Growth',
  'Series B SaaS, $18M ARR',
  5,
  TRUE,
  1
),
(
  'We went from a 1.4× ROAS to 3.9× in under four months. More importantly, the team taught us *why* the levers work. We''re a much smarter buyer of media than we were before.',
  'Marcus T.',
  'Founder & CEO',
  'DTC Apparel Brand, $6M revenue',
  5,
  TRUE,
  2
),
(
  'The creative testing process alone was worth the engagement. We went from guessing which ad would win to having a systematic process with clear decision rules. Game-changing for our brand.',
  'Jamie L.',
  'VP Marketing',
  'E-commerce, $30M GMV',
  5,
  TRUE,
  3
),
(
  'Most agencies talk about ROAS. Everitt talks about MER, contribution margin, and payback period. It''s a different conversation — one that actually aligns with how our business works.',
  'Priya M.',
  'CFO',
  'DTC Health Brand, $12M revenue',
  5,
  TRUE,
  4
)
ON CONFLICT DO NOTHING;

-- ─── Insights ─────────────────────────────────────────────────────────────────
INSERT INTO insights (title, body, category, published_at, published, sort_order) VALUES
(
  'The MER Shift: Why Smart Brands Are Moving Beyond ROAS',
  'Marketing Efficiency Ratio (MER) — total revenue divided by total ad spend — is replacing ROAS as the north-star metric for scaling brands. Why? ROAS is channel-siloed and attribution-dependent. MER is agnostic, manipulation-resistant, and correlates more reliably with contribution margin at scale. Brands that manage to MER targets typically see more sustainable scaling curves and avoid the ROAS-gaming that erodes real profitability.',
  'Paid Media',
  NOW() - INTERVAL '3 days',
  TRUE,
  1
),
(
  'Creative Velocity as Competitive Moat: The 5-Day Testing Cycle',
  'The brands winning on Meta in 2024–2025 aren''t necessarily spending more — they''re iterating faster. A structured 5-day creative cycle (brief Monday, produce Tue–Wed, launch Thu, read Friday, scale or kill) compresses the learning loop and keeps the algorithm fed with signal. Teams running 20+ new concepts per month consistently outperform those running 4–6, even at equal budgets.',
  'Creative',
  NOW() - INTERVAL '8 days',
  TRUE,
  2
),
(
  'Attribution Maturity: A Four-Level Framework',
  'Most brands operate at Level 1 (last-click, pixel only) and wonder why their numbers don''t match revenue. Level 2 adds server-side events and post-purchase surveys. Level 3 layers geo-based incrementality tests. Level 4 adds media mix modeling for full-funnel view. You don''t need Level 4 to run efficiently — but you do need Level 2, and most brands don''t have it.',
  'Attribution',
  NOW() - INTERVAL '14 days',
  TRUE,
  3
),
(
  'TikTok''s Q1 2025 Signal Quality Update: What Changed',
  'TikTok''s latest algorithm update shifted optimization signals toward engagement-weighted conversions — meaning ads that generate comments, saves, and re-watches before conversion are now favored over pure click-to-purchase paths. Early data from client accounts shows UGC-style creatives with strong hook rates (>35% 3-second view rate) outperforming polished brand content by 40–70% on CPA. Update your creative briefs accordingly.',
  'Paid Media',
  NOW() - INTERVAL '5 days',
  TRUE,
  4
)
ON CONFLICT DO NOTHING;
