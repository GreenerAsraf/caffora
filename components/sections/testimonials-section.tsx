"use client"

import { useEffect } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Star, Quote } from "lucide-react"
import { ratingToStars } from "@/lib/utils"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Interior Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    rating: 5,
    content: "The quality of the furniture is absolutely exceptional. Every piece I've ordered for my clients has exceeded expectations in both craftsmanship and design."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    rating: 5,
    content: "Finding truly premium modern pieces can be challenging. Caffora makes it effortless with their curated selection and impeccable customer service."
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Homeowner",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
    rating: 4.5,
    content: "I completely transformed my living room with their spring collection. The attention to detail on the walnut dining table is just stunning."
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    rating: 5,
    content: "Not only is the product top-tier, but the shipping was incredibly fast and the packaging was beautiful. A true luxury experience from start to finish."
  }
]

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    skipSnaps: false
  })

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi) return
    
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }, 4000)
    
    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <section className="w-full py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4 text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Don&apos;t just take our word for it. Discover how our pieces have transformed spaces and elevated everyday living.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 sm:-ml-6 lg:-ml-8 cursor-grab active:cursor-grabbing">
              {TESTIMONIALS.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 sm:pl-6 lg:pl-8 min-w-0"
                >
                  <div className="flex flex-col h-full p-8 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-shadow relative">
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10 rotate-180" />
                    
                    <div className="flex text-amber-500 mb-6">
                      {ratingToStars(testimonial.rating).map((star, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${star === "full" ? "fill-current" : star === "half" ? "fill-current opacity-50" : "opacity-30"}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground text-lg italic flex-1 mb-8">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none hidden sm:block" />
        </div>
      </div>
    </section>
  )
}

