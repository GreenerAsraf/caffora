import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

const orders = [
  { id: "CF-1048", date: "Jul 18, 2026", total: 6824, status: "PROCESSING" },
  { id: "CF-1036", date: "Jul 10, 2026", total: 3498, status: "DELIVERED" },
  { id: "CF-1021", date: "Jun 28, 2026", total: 5299, status: "DELIVERED" },
]

export default function OrdersPage() {
  return <Card><CardHeader><CardTitle>My Orders</CardTitle></CardHeader><CardContent className="space-y-3">{orders.map(order => <div key={order.id} className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-4 sm:items-center"><p className="font-medium">{order.id}</p><p className="text-sm text-muted-foreground">{order.date}</p><p className="font-semibold">{formatPrice(order.total)}</p><Badge className="w-fit">{order.status}</Badge></div>)}</CardContent></Card>
}
