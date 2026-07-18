'use client';

import { useEffect, useState } from 'react';
import { Heart, Package, ShoppingBag, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { dashboardApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, accessToken, status } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'guest') {
      router.push('/login?next=/dashboard');
      return;
    }

    let active = true;
    if (status === 'authenticated' && accessToken) {
      dashboardApi.getUser(accessToken)
        .then((res) => {
          if (active && res) {
            setData(res);
          }
        })
        .catch(console.error)
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => { active = false; };
  }, [accessToken, status, router]);

  if (loading || status === 'loading') {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!data) return null;

  const stats = [
    { label: "Orders", value: data.stats.orderCount.toString(), icon: Package },
    { label: "Wishlist", value: data.stats.wishlistCount.toString(), icon: Heart },
    { label: "Lifetime Spend", value: formatPrice(data.stats.lifetimeSpend), icon: ShoppingBag },
    { label: "Rewards", value: "0", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-playfair text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}</h2>
        <p className="mt-2 text-muted-foreground">Track orders, review favorites, and keep your Caffora profile ready for faster checkout.</p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <item.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent orders</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            data.recentOrders.map((order: any) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div>
                  <Link href={`/orders/${order.id}`} className="font-medium hover:text-primary">Order {order.id.slice(0, 8)}...</Link>
                  <p className="text-sm text-muted-foreground">{order.items.length} items • {formatPrice(order.total)}</p>
                </div>
                <Badge className="w-fit">{order.status}</Badge>
              </div>
            ))
          )}
          <Button render={<Link href="/dashboard/orders" />} className="rounded-full mt-2">View all orders</Button>
        </CardContent>
      </Card>
    </div>
  )
}
