// ============================================================================
// Everitt Marketing & Co — Shared Types
// ============================================================================

// ─── Database row types ───────────────────────────────────────────────────────

export interface CaseStudy {
  id: string
  slug: string
  title: string
  industry: string
  size_band: string | null
  challenge: string
  approach: string
  execution: string | null
  results_json: CaseStudyResults
  hero_stat: string | null
  hero_label: string | null
  tags: string[]
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CaseStudyResults {
  headline: string
  metrics: CaseStudyMetric[]
  period?: string
}

export interface CaseStudyMetric {
  label: string
  before: string
  after: string
  delta: string
}

export interface Testimonial {
  id: string
  quote: string
  author_name: string
  author_title: string | null
  company_label: string | null
  avatar_url: string | null
  rating: number | null
  published: boolean
  sort_order: number
  created_at: string
}

export interface Insight {
  id: string
  title: string
  body: string
  category: string | null
  published_at: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface KPI {
  id: string
  key: string
  label: string
  value: string
  unit: string | null
  trend: -1 | 0 | 1
  sparkline: number[] | null
  updated_at: string
}

// ─── Lead / Form types ────────────────────────────────────────────────────────

export interface LeadFormData {
  name: string
  email: string
  company: string
  website?: string
  monthly_spend: string
  primary_goal: string
  current_tools?: string
  message?: string
}

export interface LeadQualificationAnswers {
  monthly_spend?: string
  primary_goal?: string
  current_channels?: string
  main_challenge?: string
  timeline?: string
  company_stage?: string
}

// ─── AI Chat types ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AIResponse {
  message: string
  suggestions?: string[]
  isLeadQualification?: boolean
  qualificationStep?: number
}

// ─── Analytics event types ────────────────────────────────────────────────────

export type AnalyticsEvent =
  | { event: 'form_start'; form: string }
  | { event: 'form_submit'; form: string; success: boolean }
  | { event: 'ai_open' }
  | { event: 'ai_message'; message_count: number }
  | { event: 'cta_click'; cta: string; location: string }
  | { event: 'scroll_depth'; depth: 25 | 50 | 75 | 100 }
  | { event: 'case_study_view'; slug: string }
  | { event: 'insight_click'; title: string }
