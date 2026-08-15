import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// ⚠️ This file must NOT import Prisma or any Node.js-only modules
// because it is used in the Edge Runtime (middleware).
// DB calls must live only in src/auth.ts (Node.js runtime).

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize is intentionally empty here — actual logic is in src/auth.ts
      async authorize() {
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
