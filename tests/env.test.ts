import { describe, it, expect } from 'vitest'
import { config as loadEnv } from 'dotenv'

// Load .env.local first (local overrides), then .env fallback
loadEnv({ path: '.env.local' })
loadEnv()

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SELLER_HANDLE',
  'NEXT_PUBLIC_SELLER_NAME',
  'NEXT_PUBLIC_SELLER_WHATSAPP',
  'NEXT_PUBLIC_CURRENCY_CODE',
]

describe('env', () => {
  it('has required NEXT_PUBLIC_* vars', () => {
    for (const key of REQUIRED) {
      expect(typeof process.env[key]).toBe('string')
      expect((process.env[key] as string).length).toBeGreaterThan(0)
    }
  })
})