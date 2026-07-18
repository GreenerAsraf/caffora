import type { MetadataRoute } from "next"
import { BLOG_POSTS, CATEGORIES } from "@/lib/constants"

const baseUrl = "https://caffora.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ["", "/products", "/about", "/blog", "/contact", "/cart"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/products" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }))

  const categoryRoutes = CATEGORIES.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes]
}
