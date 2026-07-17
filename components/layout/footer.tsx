import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,

  ArrowRight,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SITE_INFO, FOOTER_LINKS, CATEGORIES } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t border-border bg-surface mt-auto"
      aria-label="Site footer"
    >
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 focus-brand rounded-lg"
              aria-label={`${SITE_INFO.name} home`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-bold text-base select-none">
                C
              </div>
              <span className="font-heading font-bold text-2xl text-foreground">
                {SITE_INFO.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              {SITE_INFO.description}
            </p>

            {/* Contact Info */}
            <ul className="space-y-2" aria-label="Contact information">
              <li>
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  aria-label={`Email us at ${SITE_INFO.email}`}
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{SITE_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Call us at ${SITE_INFO.phone}`}
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{SITE_INFO.phone}</span>
                </a>
              </li>
              <li>
                <address className="flex items-start gap-2 text-sm text-muted-foreground not-italic">
                  <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                  <span>{SITE_INFO.address}</span>
                </address>
              </li>
            </ul>
          </div>

          {/* Column 2 — Company Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2.5" aria-label="Company links">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group focus-brand rounded"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group focus-brand rounded"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Categories */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Shop by Category</h3>
            <ul className="space-y-2.5" aria-label="Product categories">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group focus-brand rounded"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Social + Legal */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Follow Us</h3>
            {/* <div className="flex flex-wrap gap-2 mb-6" aria-label="Social media links">
              {[
                { href: SITE_INFO.social.twitter, Icon: Twitter, label: "Twitter" },
                { href: SITE_INFO.social.instagram, Icon: Instagram, label: "Instagram" },
                { href: SITE_INFO.social.facebook, Icon: FacebookLogo, label: "Facebook" },
                { href: SITE_INFO.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
                { href: SITE_INFO.social.youtube, Icon: Youtube, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Caffora on ${label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary transition-colors focus-brand"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div> */}

            <h3 className="font-heading font-semibold text-foreground mb-3 text-sm">Legal</h3>
            <ul className="space-y-2" aria-label="Legal links">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-brand rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {SITE_INFO.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ — Premium Shopping, Delivered.
          </p>
        </div>
      </div>
    </footer>
  )
}
