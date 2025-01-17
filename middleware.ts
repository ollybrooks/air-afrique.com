import { NextRequest, NextResponse } from 'next/server'
 
const PUBLIC_FILE = /\.(.*)$/
 
export async function middleware(req: NextRequest) {
  if (!req.nextUrl) return

  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    req.nextUrl.pathname.includes('/admin') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }
 
  // Get locale from cookie or use 'fr' as fallback
  const locale = req.cookies.get('NEXT_LOCALE')?.value || 'fr'
  
  // Only redirect if the current locale doesn't match the desired locale
  if (req.nextUrl.locale !== locale) {
    const pathname = req.nextUrl.pathname || ''
    const search = req.nextUrl.search || ''
 
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, req.url)
    )
  }
}