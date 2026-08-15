import NextAuth from "next-auth"
import authConfig from "./src/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth({
  ...authConfig,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as { role?: string })?.role
      const path = nextUrl.pathname

      // Protect /dashboard and /admin routes
      if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl))
        if (role !== "SUPER_ADMIN" && role !== "SCHOOL_OWNER" && role !== "PRINCIPAL") {
          return NextResponse.redirect(new URL("/login", nextUrl))
        }
      }

      // Protect /teacher routes
      if (path.startsWith("/teacher")) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl))
        if (role !== "TEACHER" && role !== "SUPER_ADMIN") {
          return NextResponse.redirect(new URL("/login", nextUrl))
        }
      }

      // Protect /student routes
      if (path.startsWith("/student")) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl))
        if (role !== "STUDENT") {
          return NextResponse.redirect(new URL("/login", nextUrl))
        }
      }

      // Protect /parent routes
      if (path.startsWith("/parent")) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl))
        if (role !== "PARENT") {
          return NextResponse.redirect(new URL("/login", nextUrl))
        }
      }

      return true
    },
  },
})

export default auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
}
