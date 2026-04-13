import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: kpis, error } = await supabase
      .from('kpis')
      .select('*')
      .order('key')

    if (error) {
      console.error('[kpis] Supabase error:', error.message)
      return NextResponse.json({ kpis: [] }, { status: 200 })
    }

    return NextResponse.json({ kpis: kpis ?? [] })
  } catch (err) {
    console.error('[kpis] Unexpected error:', err)
    return NextResponse.json({ kpis: [] }, { status: 200 })
  }
}
