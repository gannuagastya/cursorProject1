import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/supabase'

export type Product = {
  id: string
  title: string
  price_cents: number
  sku: string
  stock: number
  image_urls: string[]
}

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_urls?.[0]
  const isSoldOut = (product.stock ?? 0) <= 0
  return (
    <div className="card overflow-hidden">
      <Link href={`/p/${encodeURIComponent(product.sku)}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          {imageUrl ? (
            <Image src={imageUrl} alt={product.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">No image</div>
          )}
          {isSoldOut && (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white">Sold out</span>
          )}
        </div>
        <div className="space-y-1 p-3">
          <h3 className="font-medium">{product.title}</h3>
          <div className="text-sm text-gray-600">{formatPrice(product.price_cents)}</div>
        </div>
      </Link>
    </div>
  )
}