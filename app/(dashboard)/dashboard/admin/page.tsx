import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

const stats = [
  { label: "Revenue", value: formatPrice(1284300), icon: DollarSign },
  { label: "Orders", value: "386", icon: ShoppingCart },
  { label: "Customers", value: "2,840", icon: Users },
  { label: "Products", value: "124", icon: Package },
]

export default function AdminPage() {
  return <div className="space-y-8"><section><h2 className="font-playfair text-3xl font-bold">Store overview</h2><p className="mt-2 text-muted-foreground">Demo admin metrics for managing Caffora catalog, customers, and revenue.</p></section><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(item => <Card key={item.label}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle><item.icon className="h-4 w-4 text-primary" /></CardHeader><CardContent><p className="text-3xl font-bold">{item.value}</p></CardContent></Card>)}</div><Card><CardHeader><CardTitle>Operations queue</CardTitle></CardHeader><CardContent className="grid gap-3"><div className="rounded-xl border border-border p-4">6 orders waiting for fulfillment review</div><div className="rounded-xl border border-border p-4">3 products are below reorder stock level</div><div className="rounded-xl border border-border p-4">12 new reviews need moderation</div></CardContent></Card></div>
}
