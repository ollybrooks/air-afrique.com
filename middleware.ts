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
 
  // Check if the URL already has the English locale
  if (req.nextUrl.pathname.startsWith('/en')) {
    return
  }

  // Get locale from cookie
  const locale = req.cookies.get('NEXT_LOCALE')?.value || 'fr'
  
  if (locale === 'en') {
    // Only redirect to /en if English is selected
    const pathname = req.nextUrl.pathname || ''
    const search = req.nextUrl.search || ''
    
    return NextResponse.redirect(
      new URL(`/en${pathname}${search}`, req.url)
    )
  }

  // For French (default), don't add any prefix
  return
}