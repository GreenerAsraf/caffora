import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://caffora.vercel.app"),
  title: {
    default: "Caffora — Premium Shopping, Delivered",
    template: "%s | Caffora",
  },
  description:
    "Discover thousands of premium products across electronics, fashion, home & more. Fast delivery, secure checkout, and world-class support.",
  keywords: [
    "ecommerce",
    "online shopping",
    "caffora",
    "electronics",
    "fashion",
    "home decor",
  ],
  authors: [{ name: "Caffora Team" }],
  creator: "Caffora",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://caffora.vercel.app",
    siteName: "Caffora",
    title: "Caffora — Premium Shopping, Delivered",
    description:
      "Discover thousands of premium products across electronics, fashion, home & more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Caffora — Premium E-Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caffora — Premium Shopping, Delivered",
    description: "Thousands of premium products. Fast delivery. Secure checkout.",
    images: ["/og-image.png"],
    creator: "@caffora",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
