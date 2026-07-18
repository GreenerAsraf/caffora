'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatPrice } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';
import { ordersApi } from '@/lib/api';

type RealOrder = {
  id: string;
  items: Array<{ id: string; quantity: number; price: number; product: { title: string; slug: string; images: string[]; price: number } }>;
  total: number;
  status: string;
  address: any;
  paymentId?: string;
  createdAt: string;
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<RealOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken, status } = useAuth();

  useEffect(() => {
    let active = true;

    if (status === 'authenticated' && accessToken) {
      ordersApi.getById(params.id, accessToken)
        .then((res) => {
          if (active && res) {
            setOrder(res);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch order", err);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else if (status === 'guest') {
      // Fallback to local storage for guest/mock checkout
      const stored = localStorage.getItem(`caffora-order-${params.id}`);
      if (stored) {
        setOrder(JSON.parse(stored));
      }
      setLoading(false);
    } else if (status === 'loading') {
       // Wait for auth to resolve
    }

    return () => {
      active = false;
    };
  }, [params.id, accessToken, status]);

  if (loading || status === 'loading') {
    return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <PackageCheck className="mb-4 h-12 w-12 text-primary" />
        <h1 className="font-playfair text-3xl font-bold">Order not found</h1>
        <p className="mt-3 text-muted-foreground">The order could not be found. Please check your order ID or ensure you are logged in.</p>
        <Button render={<Link href="/products" />} className="mt-6 rounded-full">Continue Shopping</Button>
      </div>
    );
  }

  // Calculate subtotal from items if not provided by backend (backend only provides total)
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.0825);
  // Reconstruct shipping if not explicitly saved on backend (or just assume remainder is shipping/discounts, for now we will just show total)
  
  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-primary"><CheckCircle2 className="h-5 w-5" /> Order confirmed</div>
            <h1 className="font-playfair text-4xl font-bold">Order {order.id}</h1>
            <p className="mt-2 text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Badge className="w-fit text-sm">{order.status}</Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <main className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-playfair text-2xl font-bold">Items</h2>
            <div className="mt-5 space-y-5">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <Link href={`/products/${item.product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image src={item.product.images[0] || '/placeholder.png'} alt={item.product.title} fill className="object-cover" />
                  </Link>
                  <div className="flex flex-1 justify-between gap-4">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="font-medium hover:text-primary">{item.product.title}</Link>
                      <p className="mt-1 text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
          </main>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-playfair text-xl font-bold">Shipping</h2>
              {order.address ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{order.address.fullName}<br />{order.address.street}<br />{order.address.city}, {order.address.state} {order.address.zip}<br />{order.address.country}</p>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No address found</p>
              )}
            </section>
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-playfair text-xl font-bold">Summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping & Tax</span><span>{formatPrice(order.total - subtotal)}</span></div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
            </section>
            <Button render={<Link href="/products" />} className="w-full rounded-full">Continue Shopping</Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
