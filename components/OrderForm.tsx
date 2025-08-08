"use client"

import { useState } from 'react'

type Props = {
  sku: string
  price_cents: number
}

export default function OrderForm({ sku, price_cents }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setSubmitting(true)
    setError(null)
    try {
      formData.append('sku', sku)
      formData.append('price_cents', String(price_cents))
      const res = await fetch('/api/order', {
        method: 'POST',
        body: formData,
      })
      if (res.redirected) {
        window.location.href = res.url
        return
      }
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error || 'Failed to submit order')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <input name="buyer_name" placeholder="Full name" className="input" required />
        <input name="phone" placeholder="Phone" className="input" required />
        <input name="address" placeholder="Address" className="input" />
        <textarea name="notes" placeholder="Notes" className="input" />
        <input name="qty" type="number" min={1} defaultValue={1} className="input" required />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn w-full" disabled={submitting}>
        {submitting ? 'Placing order...' : 'Buy / Reserve'}
      </button>
    </form>
  )
}