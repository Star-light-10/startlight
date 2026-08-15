import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

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
  ],
} satisfies NextAuthConfig
