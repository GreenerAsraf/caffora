import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return <Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded-xl border border-border p-4"><p className="font-medium">Email notifications</p><p className="text-sm text-muted-foreground">Order updates, shipping alerts, and restock notices are enabled for the demo account.</p></div><Button className="rounded-full">Update settings</Button></CardContent></Card>
}
