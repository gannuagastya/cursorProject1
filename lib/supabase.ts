import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const PUBLIC_CURRENCY_CODE = (process.env.NEXT_PUBLIC_CURRENCY_CODE as string) || 'USD'

export function createClient(): SupabaseClient {
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase env vars')
  }
  return createSupabaseClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
}

export function formatPrice(cents: number, currencyCode: string = PUBLIC_CURRENCY_CODE): string {
  const amount = (cents ?? 0) / 100
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}