import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const users = [
  { name: "Adrian Cole", email: "admin@caffora.dev", role: "ADMIN" },
  { name: "Mira Carter", email: "user@caffora.dev", role: "USER" },
  { name: "Sam Rivera", email: "sam@example.com", role: "USER" },
]

export default function AdminUsersPage() {
  return <Card><CardHeader><CardTitle>Users</CardTitle></CardHeader><CardContent className="space-y-3">{users.map(user => <div key={user.email} className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-3 sm:items-center"><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p><Badge className="w-fit">{user.role}</Badge></div>)}</CardContent></Card>
}
