import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/cards/product-card"
import { ProductCard as ProductCardType } from "@/types"

// Mock data for Phase 2
const FEATURED_PRODUCTS: ProductCardType[] = [
  {
    id: "p1",
    title: "Minimalist Lounge Chair",
    slug: "minimalist-lounge-chair",
    price: 39900,
    comparePrice: 49900,
    images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2065&auto=format&fit=crop"],
    rating: 4.8,
    reviewCount: 124,
    category: { name: "Furniture", slug: "furniture" },
    stock: 15,
    featured: true
  },
  {
    id: "p2",
    title: "Modern Brass Pendant Light",
    slug: "modern-brass-pendant-light",
    price: 12900,
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop"],
    rating: 4.5,
    reviewCount: 89,
    category: { name: "Lighting", slug: "lighting" },
    stock: 42,
    featured: false
  },
  {
    id: "p3",
    title: "Ceramic Artisan Vase",
    slug: "ceramic-artisan-vase",
    price: 8500,
    images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1974&auto=format&fit=crop"],
    rating: 4.9,
    reviewCount: 210,
    category: { name: "Decor", slug: "decor" },
    stock: 8,
    featured: true
  },
  {
    id: "p4",
    title: "Solid Walnut Dining Table",
    slug: "solid-walnut-dining-table",
    price: 89900,
    comparePrice: 119900,
    images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1976&auto=format&fit=crop"],
    rating: 4.7,
    reviewCount: 56,
    category: { name: "Furniture", slug: "furniture" },
    stock: 5,
    featured: false
  }
]

export function FeaturedProducts() {
  return (
    <section className="w-full py-24 bg-surface border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4 text-foreground">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked selections from our most popular collections. Discover the pieces our customers love most.
            </p>
          </div>
          <Link 
            href="/products?featured=true" 
            className="group flex items-center text-primary font-medium hover:text-primary/80 transition-colors whitespace-nowrap"
          >
            Shop All Featured
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
