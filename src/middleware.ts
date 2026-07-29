import NextAuth from "next-auth"
import authConfig from "./auth.config"

import { NextResponse } from "next/server"

export const { auth: middleware } = NextAuth({
  ...authConfig,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = auth?.user?.role
      const path = nextUrl.pathname

      // Protect /dashboard and /admin routes
      if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
        if (!isLoggedIn) return false
        if (role !== "SUPER_ADMIN" && role !== "SCHOOL_OWNER" && role !== "PRINCIPAL") {
          return NextResponse.redirect(new URL("/unauthorized", nextUrl))
        }
      }

      // Protect /teacher routes
      if (path.startsWith("/teacher")) {
        if (!isLoggedIn) return false
        if (role !== "TEACHER") {
          return NextResponse.redirect(new URL("/unauthorized", nextUrl))
        }
      }

      // Protect /student routes
      if (path.startsWith("/student")) {
        if (!isLoggedIn) return false
        if (role !== "STUDENT") {
          return NextResponse.redirect(new URL("/unauthorized", nextUrl))
        }
      }

      // Protect /parent routes
      if (path.startsWith("/parent")) {
        if (!isLoggedIn) return false
        if (role !== "PARENT") {
          return NextResponse.redirect(new URL("/unauthorized", nextUrl))
        }
      }

      return true
    },
  },
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
