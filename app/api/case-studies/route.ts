import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 600

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[case-studies]', error.message)
      return NextResponse.json({ case_studies: [] })
    }
    return NextResponse.json({ case_studies: data ?? [] })
  } catch {
    return NextResponse.json({ case_studies: [] })
  }
}
