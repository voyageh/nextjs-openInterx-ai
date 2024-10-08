import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { login } from '@/api/user'

const whiteList = ['/', '/sample-video'] // 白名单页面

const backend = process.env.BACKEND_URL
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [Google],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'google') {
        const r = await login(account?.access_token, backend)
        return { ...token, accessToken: r.token }
      }
      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },

    // 页面权限校验
    authorized({ auth, request: { nextUrl } }) {
      if (whiteList.includes(nextUrl.pathname)) {
        return true
      }
      const isLoggedIn = !!auth?.user
      const isMyVideo = nextUrl.pathname.startsWith('/my-video')
      if (isLoggedIn) {
        if (isMyVideo) return true
        return Response.redirect(new URL('/my-video', nextUrl))
      } else {
        return false
      }
    },
  },
})
