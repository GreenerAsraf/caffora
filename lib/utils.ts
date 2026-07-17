import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as a currency string.
 * @example formatPrice(1999) → "$19.99"
 * @example formatPrice(4999, "GBP") → "£49.99"
 */
export function formatPrice(
  priceInCents: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(priceInCents / 100)
}

/**
 * Format a number as a compact string.
 * @example formatCompact(1500) → "1.5K"
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)
}

/**
 * Truncate a string to a given length, appending "…"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + "…"
}

/**
 * Generate star rating display array.
 * @example ratingToStars(4.3) → ["full","full","full","full","half","empty"]
 */
export type StarType = "full" | "half" | "empty"
export function ratingToStars(rating: number, max = 5): StarType[] {
  const stars: StarType[] = []
  for (let i = 1; i <= max; i++) {
    if (rating >= i) stars.push("full")
    else if (rating >= i - 0.5) stars.push("half")
    else stars.push("empty")
  }
  return stars
}

/**
 * Slugify a string.
 * @example slugify("Hello World") → "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Calculate discount percentage.
 * @example discountPercent(10000, 8000) → 20
 */
export function discountPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100)
}

/**
 * Format a date relative to now (e.g. "2 days ago").
 */
export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["week", 604_800_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
    ["second", 1_000],
  ]
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) {
      return rtf.format(-Math.round(diff / ms), unit)
    }
  }
  return "just now"
}

/**
 * Format date as "Jan 15, 2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d)
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Get initials from a full name.
 * @example getInitials("John Doe") → "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
