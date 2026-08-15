/**
 * Generates a secure temporary password for new staff accounts.
 * Format: SMS@ + 8 random alphanumeric characters
 */
export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let password = "SMS@"
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * Generates a unique employee ID for staff.
 * Format: SMS-TCH-YYYY-NNNN
 */
export function generateEmployeeId(count: number): string {
  const year = new Date().getFullYear()
  return `SMS-TCH-${year}-${String(count + 1).padStart(4, "0")}`
}
