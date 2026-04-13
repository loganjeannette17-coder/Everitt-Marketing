-- ============================================================================
-- Everitt Marketing & Co — Initial Schema
-- Run against your Supabase project via:
--   supabase db push  (CLI)  or paste into the SQL editor in the dashboard
-- ============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
-- pgcrypto for UUID generation (Supabase enables this by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- vector extension — enable now so the path to RAG is clean in v2
-- Uncomment when ready to use embeddings:
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- ─── Helpers ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ─── Table: case_studies ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_studies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  industry      TEXT NOT NULL,           -- e.g. "DTC Apparel", "B2B SaaS"
  size_band     TEXT,                    -- e.g. "$5M–$20M ARR"
  challenge     TEXT NOT NULL,
  approach      TEXT NOT NULL,
  execution     TEXT,
  results_json  JSONB NOT NULL DEFAULT '{}',
  -- results_json shape: { "headline": "3.8× ROAS", "metrics": [{"label": "ROAS", "before": "1.4", "after": "3.8"}] }
  hero_stat     TEXT,                    -- short pull-quote number, e.g. "3.8×"
  hero_label    TEXT,                    -- e.g. "blended ROAS"
  tags          TEXT[] DEFAULT '{}',
  published     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Table: testimonials ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote           TEXT NOT NULL,
  author_name     TEXT NOT NULL,
  author_title    TEXT,
  company_label   TEXT,   -- anonymized label, e.g. "Head of Growth, Series B SaaS"
  avatar_url      TEXT,
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: insights ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insights (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  category     TEXT,                    -- e.g. "Paid Media", "Creative", "Attribution"
  published_at TIMESTAMPTZ,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_insights_updated_at
  BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Table: kpis ─────────────────────────────────────────────────────────────
-- Headline terminal statistics — update these without redeploying
CREATE TABLE IF NOT EXISTS kpis (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,      -- machine key, e.g. "blended_roas"
  label      TEXT NOT NULL,             -- display label, e.g. "Blended ROAS"
  value      TEXT NOT NULL,             -- display value, e.g. "4.2×"
  unit       TEXT,                      -- optional unit suffix, e.g. "×" or "%"
  trend      SMALLINT DEFAULT 1         -- 1 = up, -1 = down, 0 = flat
    CHECK (trend IN (-1, 0, 1)),
  sparkline  JSONB,                     -- array of numbers for mini chart: [1.2,1.4,1.8,2.1...]
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_kpis_updated_at
  BEFORE UPDATE ON kpis
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Table: leads ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  company      TEXT,
  website      TEXT,
  monthly_spend TEXT,                   -- budget band from qualification
  primary_goal  TEXT,                   -- e.g. "Scale paid ads", "Improve ROAS"
  current_tools TEXT,                   -- platforms they use
  answers_json  JSONB NOT NULL DEFAULT '{}',
  summary_text  TEXT,                   -- AI-generated qualification summary
  source        TEXT NOT NULL DEFAULT 'website',
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'closed_won', 'closed_lost')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Table: newsletter_subscribers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  confirmed       BOOLEAN NOT NULL DEFAULT FALSE,
  confirm_token   TEXT,                 -- for double opt-in flow
  source          TEXT DEFAULT 'website',
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ─── Table: documents (v2 RAG path) ──────────────────────────────────────────
-- Enables RAG upgrade: store source docs, chunk them, embed with pgvector
CREATE TABLE IF NOT EXISTS documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  category     TEXT,
  -- embedding vector(1536),   -- uncomment when enabling vector extension
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE case_studies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights             ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads                ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents            ENABLE ROW LEVEL SECURITY;

-- ── Public read: marketing content ──────────────────────────────────────────
-- Anyone (including anon) can read published marketing content

CREATE POLICY "public_read_published_case_studies"
  ON case_studies FOR SELECT
  USING (published = TRUE);

CREATE POLICY "public_read_published_testimonials"
  ON testimonials FOR SELECT
  USING (published = TRUE);

CREATE POLICY "public_read_published_insights"
  ON insights FOR SELECT
  USING (published = TRUE);

CREATE POLICY "public_read_kpis"
  ON kpis FOR SELECT
  USING (TRUE);  -- all KPIs are readable; control via service role for writes

-- ── Lead insert: anon can insert, cannot read ────────────────────────────────
-- The Route Handler uses the SERVICE ROLE key for inserts, bypassing RLS.
-- These policies are a defence-in-depth layer; the API route is the real gate.

CREATE POLICY "service_role_manage_leads"
  ON leads FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_manage_newsletter"
  ON newsletter_subscribers FOR ALL
  USING (auth.role() = 'service_role');

-- ── Documents: service role only ────────────────────────────────────────────
CREATE POLICY "service_role_manage_documents"
  ON documents FOR ALL
  USING (auth.role() = 'service_role');

-- ── Authenticated users (your team) can manage everything ───────────────────
CREATE POLICY "auth_full_access_case_studies"   ON case_studies   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access_testimonials"   ON testimonials   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access_insights"       ON insights       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_full_access_kpis"           ON kpis           FOR ALL USING (auth.role() = 'authenticated');

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_case_studies_published   ON case_studies (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_published   ON testimonials (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_insights_published       ON insights (published, sort_order, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_kpis_key                 ON kpis (key);
CREATE INDEX IF NOT EXISTS idx_leads_email              ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at         ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email         ON newsletter_subscribers (email);
