// import { cookies } from "next/headers"
// import { login, getUser } from "@/api/user"

const whiteList = ["/", "/sample-video"] // 白名单页面

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    // 页面权限校验
    authorized({ auth, request: { nextUrl } }) {
      if (whiteList.includes(nextUrl.pathname)) {
        return true
      }
      const isLoggedIn = !!auth?.user
      const isMyVideo = nextUrl.pathname.startsWith("/my-video")
      if (isLoggedIn) {
        if (isMyVideo) return true
        return Response.redirect(new URL("/my-video", nextUrl))
      } else {
        return false
      }
    },
  },
  providers: []
}
