import Image from 'next/image'
import { createClient, formatPrice } from '@/lib/supabase'
import OrderForm from '@/components/OrderForm'

export const revalidate = 60

async function getData(sku: string) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*, sellers(*)')
    .eq('sku', sku)
    .maybeSingle()
  return product
}

export default async function Page({ params }: { params: { sku: string } }) {
  const product = await getData(params.sku)
  if (!product) {
    return (
      <div className="container py-8">
        <h1 className="text-xl font-semibold">Product not found</h1>
      </div>
    )
  }

  const isSoldOut = (product.stock ?? 0) <= 0

  return (
    <div className="container grid gap-6 py-6 md:grid-cols-2">
      <div className="space-y-3">
        {product.image_urls?.length ? (
          <div className="grid grid-cols-2 gap-3">
            {product.image_urls.map((url: string, idx: number) => (
              <div key={idx} className="relative aspect-[4/3] bg-gray-100">
                <Image src={url} alt={`${product.title}-${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative aspect-[4/3] bg-gray-100" />
        )}
      </div>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="mt-1 text-gray-700">{formatPrice(product.price_cents)}</div>
          {isSoldOut && (
            <div className="mt-2 inline-block rounded bg-red-600 px-2 py-1 text-xs text-white">Sold out</div>
          )}
        </div>
        <OrderForm sku={product.sku} price_cents={product.price_cents} />
      </div>
    </div>
  )
}