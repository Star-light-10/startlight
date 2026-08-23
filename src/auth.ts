import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/db"
import authConfig from "./auth.config"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
          }
        }

        return null
      },
    }),

    // ── Student Portal Login ──────────────────────────────────────────────────
    // Students log in with their admission number + surname (no email/password needed)
    Credentials({
      id: "student-credentials",
      credentials: {
        admissionNumber: { label: "Admission Number", type: "text" },
        surname: { label: "Surname", type: "text" },
      },
      async authorize(credentials) {
        const admissionNumber = (credentials?.admissionNumber as string)?.trim()
        const surname = (credentials?.surname as string)?.trim()

        if (!admissionNumber || !surname) return null

        // Find the student profile by admission number
        const profile = await prisma.studentProfile.findUnique({
          where: { admissionNumber },
          include: { user: true },
        })

        if (!profile || !profile.user) return null

        // Verify surname (case-insensitive check against any part of the name)
        const nameParts = (profile.user.name ?? "").toLowerCase().split(/\s+/)
        const surnameMatch = nameParts.some(
          (part) => part === surname.toLowerCase()
        )

        if (!surnameMatch) return null

        return {
          id: profile.user.id,
          email: profile.user.email,
          name: profile.user.name,
          role: profile.user.role,
          tenantId: profile.user.tenantId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.tenantId = (user as any).tenantId
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string | null
        session.user.id = token.id as string
      }
      return session
    },
  },
})
