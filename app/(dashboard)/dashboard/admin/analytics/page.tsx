import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const months = [
  { month: "Mar", revenue: 58 },
  { month: "Apr", revenue: 72 },
  { month: "May", revenue: 64 },
  { month: "Jun", revenue: 91 },
  { month: "Jul", revenue: 84 },
]

export default function AdminAnalyticsPage() {
  return <Card><CardHeader><CardTitle>Analytics</CardTitle></CardHeader><CardContent><div className="flex h-72 items-end gap-4 rounded-xl border border-border bg-background p-5">{months.map(item => <div key={item.month} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-primary" style={{ height: `${item.revenue}%` }} /><span className="text-sm text-muted-foreground">{item.month}</span></div>)}</div></CardContent></Card>
}
