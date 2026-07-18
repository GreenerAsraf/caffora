'use client';

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, formatDate } from "@/lib/utils"
import { useAuth } from '@/components/providers/auth-provider';
import { ordersApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { accessToken, status } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (status === 'authenticated' && accessToken) {
      ordersApi.list({ page: 1, limit: 50 }, accessToken)
        .then((res) => {
          if (active && res && res.orders) {
            setOrders(res.orders);
          }
        })
        .catch(console.error)
        .finally(() => {
          if (active) setLoading(false);
        });
    } else if (status === 'guest') {
      setLoading(false);
    }

    return () => { active = false; };
  }, [accessToken, status]);

  if (loading || status === 'loading') {
    return <Card><CardContent className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-muted-foreground">You have no orders yet.</p>
        ) : (
          orders.map(order => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block">
              <div className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-4 sm:items-center hover:bg-muted/50 transition-colors">
                <p className="font-medium">Order {order.id.slice(0, 8)}...</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <Badge className="w-fit">{order.status}</Badge>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
