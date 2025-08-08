import Link from 'next/link'

function waLink() {
  const brand = process.env.NEXT_PUBLIC_SELLER_NAME || 'Our Brand'
  const phoneRaw = (process.env.NEXT_PUBLIC_SELLER_WHATSAPP || '').replace(/[^\d]/g, '')
  const message = encodeURIComponent(`Hi ${brand}, I just placed an order on your catalog. Can you please confirm?`)
  return `https://wa.me/${phoneRaw}?text=${message}`
}

export default function SuccessPage() {
  return (
    <div className="container py-12 text-center">
      <h1 className="text-2xl font-bold">Thank you!</h1>
      <p className="mt-2 text-gray-700">Your order was received. We will reach out shortly.</p>
      <div className="mt-6 flex justify-center">
        <Link href={waLink()} className="btn" prefetch={false}>
          Message on WhatsApp
        </Link>
      </div>
      <div className="mt-6">
        <Link href={`/s/${process.env.NEXT_PUBLIC_SELLER_HANDLE}`} className="underline">
          Back to catalog
        </Link>
      </div>
    </div>
  )
}