import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Clock } from "lucide-react"

const BLOG_POSTS = [
  {
    id: "b1",
    title: "10 Minimalist Interior Design Trends for 2026",
    slug: "minimalist-interior-design-trends-2026",
    excerpt: "Discover the latest trends in minimalist interior design. From warm earth tones to sculptural furniture pieces that double as art.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop",
    category: "Design Trends",
    date: "May 12, 2026",
    readTime: "5 min read"
  },
  {
    id: "b2",
    title: "How to Choose the Perfect Dining Table",
    slug: "choose-perfect-dining-table",
    excerpt: "The dining table is the heart of the home. Learn how to select the right size, shape, and material for your space and lifestyle.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1c0945594?q=80&w=2070&auto=format&fit=crop",
    category: "Buying Guide",
    date: "April 28, 2026",
    readTime: "8 min read"
  },
  {
    id: "b3",
    title: "Sustainable Materials in Modern Furniture",
    slug: "sustainable-materials-modern-furniture",
    excerpt: "Eco-friendly design doesn't mean compromising on aesthetics. Explore how modern designers are using recycled and sustainable materials.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=2070&auto=format&fit=crop",
    category: "Sustainability",
    date: "April 15, 2026",
    readTime: "6 min read"
  }
]

export function BlogPreviewSection() {
  return (
    <section className="w-full py-24 bg-surface border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4 text-foreground">
              Journal & Insights
            </h2>
            <p className="text-lg text-muted-foreground">
              Design inspiration, buying guides, and the latest trends from our interior experts.
            </p>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center text-primary font-medium hover:text-primary/80 transition-colors whitespace-nowrap"
          >
            Read the Journal
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="group flex flex-col rounded-2xl overflow-hidden bg-background border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] w-full overflow-hidden outline-none">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground shadow-sm">
                    {post.category}
                  </span>
                </div>
              </Link>
              
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
                
                <Link href={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors outline-none">
                  <h3 className="text-xl font-bold font-heading mb-3 line-clamp-2 text-foreground">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="mt-auto inline-flex items-center text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors w-fit outline-none"
                >
                  Read Article
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
