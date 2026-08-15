import prisma from "../src/lib/db"
import bcrypt from "bcryptjs"

async function seed() {
  console.log("🌱 Seeding admin user...")

  const hashedPassword = await bcrypt.hash("Admin@Starlight2026", 10)

  // Upsert so running it twice doesn't create duplicates
  const admin = await prisma.user.upsert({
    where: { email: "admin@starlightms.com" },
    update: {},
    create: {
      name: "School Admin",
      email: "admin@starlightms.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  })

  console.log("✅ Admin user created:", admin.email)
  console.log("   Password: Admin@Starlight2026")
  console.log("\n👉 You can change this password after first login.")
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
