import Link from "next/link"
import { NavbarClient } from "./navbar-client"
import { SITE_INFO } from "@/lib/constants"

export function Navbar() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 w-full border-b border-border/50 glass"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 focus-brand rounded-lg"
            aria-label={`${SITE_INFO.name} home`}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-bold text-sm select-none"
              aria-hidden="true"
            >
              C
            </div>
            <span className="font-heading font-bold text-xl text-foreground hidden sm:block">
              {SITE_INFO.name}
            </span>
          </Link>

          {/* Client-side interactive parts (nav links, cart, theme, mobile menu) */}
          <NavbarClient />
        </div>
      </div>
    </header>
  )
}
