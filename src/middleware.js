import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default async function (request, response) {
  if (request.nextUrl.pathname.startsWith('/backend')) {
    const session = await auth()    
    const headers = new Headers(request.headers)
    headers.set('Authorization', `Bearer ${session?.accessToken}`)
    return NextResponse.rewrite(request.nextUrl, {
      headers,
    })
  }
  return auth(request, response)
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|flexible.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
