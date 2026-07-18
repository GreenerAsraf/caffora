import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Name</Label><Input defaultValue="Mira Carter" /></div><div className="space-y-2"><Label>Email</Label><Input defaultValue="user@caffora.dev" /></div><div className="space-y-2 sm:col-span-2"><Label>Default address</Label><Input defaultValue="214 Market Street, San Francisco, CA" /></div><Button className="w-fit rounded-full">Save profile</Button></CardContent></Card>
}
