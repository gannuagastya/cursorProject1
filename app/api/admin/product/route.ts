import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const isAdmin = (await cookies()).get('is_admin')?.value === '1'
  if (!isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const formData = await req.formData().catch(() => null)
  if (!formData) return NextResponse.json({ error: 'Bad form' }, { status: 400 })

  const title = String(formData.get('title') || '')
  const price_cents = Number(formData.get('price_cents') || 0)
  const sku = String(formData.get('sku') || '')
  const stock = Number(formData.get('stock') || 0)
  const active = String(formData.get('active') || '') === 'on'
  const imageUrlsRaw = String(formData.get('image_urls') || '').trim()
  const image_urls = imageUrlsRaw
    ? imageUrlsRaw
        .split(/\n|,/) // split by newline or comma
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  if (!title || !price_cents || !sku) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: seller } = await supabase
    .from('sellers')
    .select('id')
    .eq('handle', process.env.NEXT_PUBLIC_SELLER_HANDLE as string)
    .maybeSingle()

  if (!seller) {
    return NextResponse.json({ error: 'Seller not found' }, { status: 400 })
  }

  const { error } = await supabase.from('products').insert({
    seller_id: seller.id,
    title,
    price_cents,
    sku,
    stock,
    image_urls,
    active,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.redirect(new URL('/admin', req.url))
}