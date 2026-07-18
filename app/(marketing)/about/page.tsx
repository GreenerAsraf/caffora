import type { Metadata } from "next"
import { SITE_INFO, SITE_STATS, SITE_FEATURES, TESTIMONIALS } from "@/lib/constants"
import { Users, Target, Sparkles, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: `About Us | ${SITE_INFO.name}`,
  description: `Learn about ${SITE_INFO.name} — our mission, values, and the team behind the premium shopping experience.`,
}

const TEAM = [
  {
    name: "Jordan Lee",
    role: "Co-Founder & CEO",
    avatar: "https://i.pravatar.cc/200?img=32",
    bio: "Passionate about building products that delight customers at every touchpoint.",
  },
  {
    name: "Aisha Malik",
    role: "Co-Founder & CTO",
    avatar: "https://i.pravatar.cc/200?img=47",
    bio: "Engineer at heart, obsessed with performance, scalability, and great UX.",
  },
  {
    name: "Carlos Ruiz",
    role: "Head of Design",
    avatar: "https://i.pravatar.cc/200?img=52",
    bio: "Believes that beautiful design is the bridge between a product and its users.",
  },
  {
    name: "Sophie Chen",
    role: "Head of Operations",
    avatar: "https://i.pravatar.cc/200?img=44",
    bio: "Ensures every order is fulfilled with precision, speed, and care.",
  },
]

const VALUES = [
  {
    icon: Target,
    title: "Customer First",
    description:
      "Every decision we make starts with one question: how does this help our customers? Their success is our success.",
  },
  {
    icon: Sparkles,
    title: "Quality Always",
    description:
      "We curate only the best products, vetted by our team for quality, durability, and value for money.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description:
      "We partner with eco-conscious brands and use recyclable packaging to reduce our environmental footprint.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We're building more than a store — a community of mindful shoppers who share tips, reviews, and discoveries.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Our Story
          </span>
          <h1 className="font-heading mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Shopping, reimagined
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              for everyone.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {SITE_INFO.name} was founded on a simple belief: premium products should be accessible, buying
            them should feel joyful, and the experience shouldn&apos;t end at checkout.
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {SITE_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-4xl font-bold text-primary">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                Our Mission
              </span>
              <h2 className="font-heading mb-5 text-3xl font-bold tracking-tight md:text-4xl">
                We exist to make great shopping effortless
              </h2>
              <p className="mb-4 text-muted-foreground">
                From the moment you land on our site to the second your package arrives, we obsess over every
                detail. Fast load times, intuitive search, honest reviews, and lightning delivery — none of
                it happens by accident.
              </p>
              <p className="text-muted-foreground">
                Our team of 80+ people across engineering, design, logistics, and customer experience work
                every day to raise the bar for what online shopping can be.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold">{title}</h3>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features / Why Us ────────────────────────────── */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Why {SITE_INFO.name}
          </span>
          <h2 className="font-heading mb-10 text-3xl font-bold tracking-tight">
            Built around your experience
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SITE_FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.bg}`}>
                  <span className={`text-xl ${f.color}`}>✓</span>
                </div>
                <h3 className="mb-1 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            The Team
          </span>
          <h2 className="font-heading mb-10 text-3xl font-bold tracking-tight">
            Meet the people behind {SITE_INFO.name}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2"
                />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="mb-2 text-xs font-medium text-primary">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial highlight ─────────────────────────── */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="font-heading mb-4 text-xl font-medium italic text-foreground md:text-2xl">
            &ldquo;{TESTIMONIALS[1].text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <img
              src={TESTIMONIALS[1].avatar}
              alt={TESTIMONIALS[1].name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-semibold">{TESTIMONIALS[1].name}</p>
              <p className="text-xs text-muted-foreground">{TESTIMONIALS[1].role}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
