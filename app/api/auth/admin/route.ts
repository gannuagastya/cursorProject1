import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null)
  const logout = formData?.get('logout')
  if (logout) {
    const res = NextResponse.redirect(new URL('/admin', req.url))
    res.cookies.set('is_admin', '', { httpOnly: true, maxAge: 0, path: '/' })
    return res
  }
  const password = String(formData?.get('password') || '')
  const expected = process.env.ADMIN_PASSWORD || ''
  if (password && password === expected) {
    const res = NextResponse.redirect(new URL('/admin', req.url))
    res.cookies.set('is_admin', '1', { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' })
    return res
  }
  return new NextResponse('Unauthorized', { status: 401 })
}