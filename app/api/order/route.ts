import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let body: any
    if (contentType.includes('application/json')) {
      body = await req.json()
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      body = Object.fromEntries(formData.entries())
    } else {
      body = await req.json().catch(() => ({}))
    }

    const { sku, buyer_name, phone, address, notes } = body
    const qty = Number(body.qty ?? 1)
    const price_cents = Number(body.price_cents)

    if (!sku || !buyer_name || !phone || !price_cents || qty < 1) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = createClient()

    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .maybeSingle()

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const total_cents = price_cents * qty

    const { error } = await supabase.from('orders').insert({
      seller_id: product.seller_id,
      product_id: product.id,
      sku,
      buyer_name,
      phone,
      address,
      notes,
      qty,
      price_cents,
      total_cents,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(new URL('/order/success', req.url))
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}