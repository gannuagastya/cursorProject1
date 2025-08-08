import Link from 'next/link'
import { createClient, formatPrice } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

export const revalidate = 60

async function getData(handle: string) {
  const supabase = createClient()
  const { data: seller } = await supabase
    .from('sellers')
    .select('*')
    .eq('handle', handle)
    .maybeSingle()

  if (!seller) return { seller: null, products: [] }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', seller.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  return { seller, products: products ?? [] }
}

export default async function Page({ params }: { params: { handle: string } }) {
  const { handle } = params
  const { seller, products } = await getData(handle)
  if (!seller) {
    return (
      <div className="container py-8">
        <h1 className="text-xl font-semibold">Seller not found</h1>
        <p className="mt-2 text-gray-600">Check the handle and try again.</p>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">{seller.name}</h1>
          <p className="text-sm text-gray-600">Latest sarees</p>
        </div>
        <Link href="/admin" className="text-sm underline">Admin</Link>
      </header>
      {products.length === 0 ? (
        <p className="text-gray-600">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}