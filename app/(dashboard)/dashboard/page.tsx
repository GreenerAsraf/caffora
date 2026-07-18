import { Heart, Package, ShoppingBag, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Orders", value: "8", icon: Package },
  { label: "Wishlist", value: "14", icon: Heart },
  { label: "Cart saves", value: "$243", icon: ShoppingBag },
  { label: "Rewards", value: "1,240", icon: TrendingUp },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-playfair text-3xl font-bold">Welcome back</h2>
        <p className="mt-2 text-muted-foreground">Track orders, review favorites, and keep your Caffora profile ready for faster checkout.</p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <Card key={item.label}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle><item.icon className="h-4 w-4 text-primary" /></CardHeader><CardContent><p className="text-3xl font-bold">{item.value}</p></CardContent></Card>)}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent orders</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {["CF-1048", "CF-1036", "CF-1021"].map((id, index) => <div key={id} className="flex items-center justify-between rounded-xl border border-border p-4"><div><p className="font-medium">Order {id}</p><p className="text-sm text-muted-foreground">{index + 1} items - Premium coffee essentials</p></div><Badge>{index === 0 ? "PROCESSING" : "DELIVERED"}</Badge></div>)}
          <Button className="rounded-full">View all orders</Button>
        </CardContent>
      </Card>
    </div>
  )
}

