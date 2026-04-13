import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .limit(6)

    if (error) {
      console.error('[insights]', error.message)
      return NextResponse.json({ insights: [] })
    }
    return NextResponse.json({ insights: data ?? [] })
  } catch {
    return NextResponse.json({ insights: [] })
  }
}
