import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt="Premium store background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center py-20">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          ✨ New Spring Collection 2026
        </div>
        
        <h1 className="max-w-4xl font-heading text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 ease-out fill-mode-both text-foreground">
          Discover the Art of <span className="text-primary italic">Refined</span> Living
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 ease-out fill-mode-both">
          Elevate your everyday with our curated collection of premium products. Designed for those who appreciate quality, craftsmanship, and timeless style.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 ease-out fill-mode-both">
          <Button render={<Link href="/products" />} size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-lg hover:shadow-primary/25 transition-all">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop the Collection
          </Button>
          <Button render={<Link href="/about" />} variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-md border-border hover:bg-muted transition-all">
            Explore Our Story
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
