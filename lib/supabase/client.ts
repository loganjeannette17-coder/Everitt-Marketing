import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client — uses anon key, safe to expose
// Reads public content; all sensitive writes go through server-side Route Handlers
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
