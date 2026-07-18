"use client";

import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { ProductCard as ProductCardType } from "@/types"
import { formatPrice, ratingToStars, discountPercent } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: ProductCardType
  isWishlisted?: boolean
  onToggleWishlist?: () => void
}

export function ProductCard({ product, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
  const isDiscounted = product.comparePrice && product.comparePrice > product.price
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface border border-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary/5">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.featured && (
          <Badge className="bg-primary text-primary-foreground border-transparent shadow-sm">Featured</Badge>
        )}
        {isDiscounted && (
          <Badge variant="destructive" className="bg-destructive text-destructive-foreground border-transparent shadow-sm">
            {discountPercent(product.comparePrice!, product.price)}% OFF
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault();
          if (onToggleWishlist) onToggleWishlist();
        }}
        className={`absolute top-3 right-3 z-10 bg-background/70 backdrop-blur-md hover:bg-background/90 rounded-full transition-opacity shadow-sm ${
          isWishlisted ? 'text-red-500 opacity-100 hover:text-red-600' : 'opacity-0 hover:text-red-500 group-hover:opacity-100'
        }`}
        aria-label="Add to wishlist"
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </Button>

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 bg-card">
        <div className="mb-1 text-xs text-muted-foreground uppercase tracking-wider font-medium">{product.category?.name || 'Uncategorized'}</div>
        <Link href={`/products/${product.slug}`} className="group-hover:text-primary transition-colors outline-none">
          <h3 className="line-clamp-1 font-semibold text-foreground text-sm sm:text-base" title={product.title}>{product.title}</h3>
        </Link>
        
        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex text-amber-500">
            {ratingToStars(product.rating).map((star, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${star === "full" ? "fill-current" : star === "half" ? "fill-current opacity-50" : "opacity-30"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">{formatPrice(product.price)}</span>
            {isDiscounted && (
              <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>
          <Button render={<Link href={`/products/${product.slug}`} />} size="sm" variant="default" className="rounded-xl shadow-sm hover:shadow-md transition-all">
            View
          </Button>
        </div>
      </div>
    </div>
  )
}
