import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 600

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('[testimonials]', error.message)
      return NextResponse.json({ testimonials: [] })
    }
    return NextResponse.json({ testimonials: data ?? [] })
  } catch {
    return NextResponse.json({ testimonials: [] })
  }
}
