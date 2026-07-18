'use client';

import { useEffect, useState } from 'react';
import {
  DollarSign, Package, ShoppingCart, Users, Loader2,
  TrendingUp, AlertTriangle, Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from "@/lib/utils"
import { useAuth } from '@/components/providers/auth-provider'
import { dashboardApi, ordersApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  PROCESSING: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  SHIPPED: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  DELIVERED: 'bg-green-500/10 text-green-600 border-green-500/20',
  CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
}

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminPage() {
  const { accessToken, status, user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'guest') {
      router.push('/login?next=/dashboard/admin');
      return;
    }
    if (status === 'authenticated' && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    let active = true;
    if (status === 'authenticated' && accessToken) {
      dashboardApi.getAdmin(accessToken)
        .then((res) => {
          if (active && res) setData(res);
        })
        .catch(console.error)
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => { active = false; };
  }, [accessToken, status, user, router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!accessToken) return;
    setUpdatingOrderId(orderId);
    try {
      await ordersApi.updateStatus(orderId, newStatus, accessToken);
      setData((prev: any) => ({
        ...prev,
        recentOrders: prev.recentOrders.map((o: any) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      }));
      toast.success('Order status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Total Revenue", value: formatPrice(data.stats.revenue), icon: DollarSign, change: "All time" },
    { label: "Total Orders", value: data.stats.orderCount.toLocaleString(), icon: ShoppingCart, change: "All time" },
    { label: "Customers", value: data.stats.userCount.toLocaleString(), icon: Users, change: "Registered" },
    { label: "Products", value: data.stats.productCount.toLocaleString(), icon: Package, change: "In catalog" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-playfair text-3xl font-bold">Store Overview</h2>
        <p className="mt-2 text-muted-foreground">Live metrics for managing Caffora's catalog, customers, and revenue.</p>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(item => (
          <Card key={item.label} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Recent Orders — wider */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Recent Orders
            </CardTitle>
            <Link href="/dashboard/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent orders.</p>
            ) : (
              data.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-border p-3 gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      Order <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.user.name} · {formatPrice(order.total)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(val) => handleStatusChange(order.id, val)}
                    >
                      <SelectTrigger className={`h-7 w-[130px] text-xs border rounded-full px-3 font-medium ${STATUS_COLORS[order.status] || ''}`}>
                        <SelectValue />
                        {updatingOrderId === order.id && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map(s => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts — narrower */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">All products are well stocked.</p>
            ) : (
              data.lowStockProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/admin/products`} className="font-medium text-sm hover:text-primary truncate block">
                      {product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.category?.name ?? 'No Category'}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-destructive border-destructive/30 bg-destructive/10 font-bold">
                    {product.stock} left
                  </Badge>
                </div>
              ))
            )}
            {data.lowStockProducts.length > 0 && (
              <Button variant="outline" size="sm" className="w-full rounded-full mt-2" render={<Link href="/dashboard/admin/products" />}>
                Manage Products
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
