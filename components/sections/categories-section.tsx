import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const CATEGORIES = [
  {
    name: "Furniture",
    slug: "furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
    count: 245
  },
  {
    name: "Lighting",
    slug: "lighting",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?q=80&w=2070&auto=format&fit=crop",
    count: 128
  },
  {
    name: "Decor",
    slug: "decor",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
    count: 312
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
    count: 184
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    count: 96
  }
]

export function CategoriesSection() {
  return (
    <section className="w-full py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4 text-foreground">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our wide range of premium collections tailored for every corner of your home.
            </p>
          </div>
          <Link 
            href="/categories" 
            className="group flex items-center text-primary font-medium hover:text-primary/80 transition-colors whitespace-nowrap"
          >
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x snap-mandatory scrollbar-hide">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative flex-none w-[280px] sm:w-[320px] aspect-[4/5] rounded-2xl overflow-hidden snap-start"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 280px, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-2xl font-bold font-heading mb-1">{category.name}</h3>
                <p className="text-white/80 text-sm font-medium">{category.count} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
