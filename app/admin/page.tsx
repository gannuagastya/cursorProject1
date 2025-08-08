import { cookies } from 'next/headers'
import { createClient, formatPrice } from '@/lib/supabase'
import Link from 'next/link'

async function isAuthed() {
  const value = (await cookies()).get('is_admin')?.value
  return value === '1'
}

async function getData() {
  const supabase = createClient()
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('handle', process.env.NEXT_PUBLIC_SELLER_HANDLE as string)
    .maybeSingle()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return { seller, orders: orders ?? [] }
}

export default async function AdminPage() {
  const ok = await isAuthed()
  const { seller, orders } = await getData()

  if (!ok) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-2 text-gray-600">Enter your admin password to continue.</p>
        <form className="mt-4 max-w-sm space-y-3" action="/api/auth/admin" method="post">
          <input type="password" name="password" placeholder="Password" className="input" required />
          <button className="btn w-full" type="submit">Enter</button>
        </form>
        <div className="mt-6">
          <Link href={`/s/${process.env.NEXT_PUBLIC_SELLER_HANDLE}`} className="underline">Back to catalog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container space-y-8 py-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          {seller && <p className="text-sm text-gray-600">{seller.name}</p>}
        </div>
        <form action="/api/auth/admin" method="post">
          <input type="hidden" name="logout" value="1" />
          <button className="text-sm underline" type="submit">Log out</button>
        </form>
      </header>

      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">Add product</h2>
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2" action="/api/admin/product" method="post">
          <input name="title" placeholder="Title" className="input md:col-span-2" required />
          <input name="price_cents" type="number" placeholder="Price (cents)" className="input" required />
          <input name="sku" placeholder="SKU" className="input" required />
          <input name="stock" type="number" placeholder="Stock" className="input" required />
          <textarea name="image_urls" placeholder="Image URLs (one per line)" className="input md:col-span-2" />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="active" defaultChecked /> Active
          </label>
          <button className="btn md:col-span-2" type="submit">Create</button>
        </form>
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Created</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Buyer</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Total</th>
                <th className="p-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-2">{o.sku}</td>
                  <td className="p-2">{o.buyer_name}</td>
                  <td className="p-2">{o.qty}</td>
                  <td className="p-2">{formatPrice(o.total_cents)}</td>
                  <td className="p-2">{o.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}