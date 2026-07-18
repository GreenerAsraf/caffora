'use client';

import { Heart, Loader2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useWishlist } from '@/hooks/use-wishlist';
import { ProductCard } from '@/components/cards/product-card';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, isInWishlist, loading } = useWishlist();

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (wishlist.length === 0) {
    return (
      <EmptyState 
        icon={Heart} 
        title="Your wishlist is empty" 
        description="Saved products will appear here." 
        action={<Button render={<Link href="/products" />} className="rounded-full">Browse products</Button>} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-3xl font-bold">Your Wishlist</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={true}
            onToggleWishlist={() => toggleWishlist(product)}
          />
        ))}
      </div>
    </div>
  )
}
