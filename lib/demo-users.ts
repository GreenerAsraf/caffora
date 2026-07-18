export const DEMO_USERS = {
  user: {
    email: "user@caffora.dev",
    password: "password123",
    name: "Mira Carter",
    role: "USER" as const,
  },
  admin: {
    email: "admin@caffora.dev",
    password: "admin1234",
    name: "Adrian Cole",
    role: "ADMIN" as const,
  },
}

export function getDemoUser(email: string, password: string) {
  const demo = Object.values(DEMO_USERS).find((account) => account.email === email && account.password === password)
  if (!demo) return null

  return {
    id: demo.role === "ADMIN" ? "demo-admin" : "demo-user",
    name: demo.name,
    email: demo.email,
    avatar: null,
    role: demo.role,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  }
}
