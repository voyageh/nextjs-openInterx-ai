import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request, response) {
  if (request.nextUrl.pathname.startsWith('/back')) {
    const session = await auth()
    const modifiedRequest = request.clone()
    modifiedRequest.headers.set('authorization', session?.accessToken)
    return NextResponse.next(modifiedRequest)
  }

  const res = await auth(request, response)  
  return res
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|flexible.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
