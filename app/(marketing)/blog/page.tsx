import type { Metadata } from "next"
import Link from "next/link"
import { SITE_INFO, BLOG_POSTS } from "@/lib/constants"
import { Clock, ArrowRight, Tag } from "lucide-react"
import { NewsletterForm } from "./_components/newsletter-form"

export const metadata: Metadata = {
  title: `Blog | ${SITE_INFO.name}`,
  description: `Explore tips, trends, and stories from the ${SITE_INFO.name} team. Stay inspired with our latest articles on tech, fashion, home living, and more.`,
}

const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Living", "Beauty", "Sports"]

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            The {SITE_INFO.name} Blog
          </span>
          <h1 className="font-heading mb-5 text-4xl font-bold tracking-tight md:text-6xl">
            Stories, tips &amp;{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              inspiration
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Dive into expert guides, trend reports, and buying advice curated by the {SITE_INFO.name} team.
          </p>
        </div>
      </section>

      {/* ── Category pills ───────────────────────────────── */}
      <section className="border-b border-border">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* ── Featured post ────────────────────────────────── */}
        <article className="group mb-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 overflow-hidden md:h-auto">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Tag className="h-3 w-3" />
                {featured.category}
              </span>
            </div>
            <div className="flex flex-col justify-center p-8">
              <span className="mb-2 text-xs font-medium text-muted-foreground">
                Featured Article
              </span>
              <h2 className="font-heading mb-3 text-2xl font-bold tracking-tight leading-snug md:text-3xl">
                {featured.title}
              </h2>
              <p className="mb-6 text-muted-foreground">{featured.excerpt}</p>
              <div className="mb-6 flex items-center gap-3">
                <img
                  src={featured.author.avatar}
                  alt={featured.author.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{featured.author.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {featured.readTime} min read &middot;{" "}
                    {new Date(featured.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Read Article <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>

        {/* ── Post grid ────────────────────────────────────── */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">Latest Articles</h2>
          <span className="text-sm text-muted-foreground">{BLOG_POSTS.length} posts</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                  <Tag className="h-3 w-3 text-primary" />
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading mb-2 text-base font-bold leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold">{post.author.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {post.readTime} min
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Read <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Newsletter CTA ───────────────────────────────── */}
        <div className="mt-14 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center text-primary-foreground shadow-lg md:p-12">
          <h2 className="font-heading mb-3 text-2xl font-bold md:text-3xl">
            Never miss an article
          </h2>
          <p className="mb-6 text-primary-foreground/80">
            Get the latest posts delivered straight to your inbox. No spam, ever.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  )
}
