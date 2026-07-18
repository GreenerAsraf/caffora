'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/ui/empty-state';

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] p-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Discover our premium blends and start brewing."
          action={
            <Button render={<Link href="/products" />} size="lg" className="rounded-full">
              Start Shopping
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair font-bold text-foreground mb-10">Shopping Cart ({itemCount})</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-end mb-4">
              <Button variant="ghost" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
                Clear Cart
              </Button>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-surface border border-border rounded-2xl">
                <Link href={`/products/${item.product.slug}`} className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-muted rounded-xl overflow-hidden">
                  <Image
                    src={item.product.images[0] || '/placeholder.png'}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </Link>
                
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/products/${item.product.slug}`} className="hover:text-primary transition-colors">
                      <h3 className="font-semibold text-base sm:text-lg">{item.product.title}</h3>
                    </Link>
                    <p className="font-bold text-lg">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-auto">{item.product.category?.name || 'Category'}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease quantity for ${item.product.title}`}> 
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase quantity for ${item.product.title}`}> 
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.product.title} from cart`}> 
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 sticky top-24">
              <h2 className="text-2xl font-playfair font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="text-foreground font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
              </div>
              
              <Button render={<Link href="/checkout" />} size="lg" className="w-full rounded-full h-14 text-lg">
                Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

