import { Truck, ShieldCheck, RefreshCw, Headset } from "lucide-react"

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over $150. Fast and reliable delivery to your door."
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure payment processing. We never store your credit card details."
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day money-back guarantee. Hassle-free returns on all eligible items."
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "Our dedicated support team is here to help you around the clock."
  }
]

export function FeaturesSection() {
  return (
    <section className="w-full py-16 bg-surface border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border max-sm:[&>*:not(:first-child)]:pt-8 max-lg:[&>*:nth-child(n+3)]:border-t max-lg:[&>*:nth-child(n+3)]:pt-8 max-lg:[&>*:nth-child(even)]:border-l-0">
          {FEATURES.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center px-4 group">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 transition-transform duration-500 group-hover:-translate-y-2 group-hover:bg-primary/20 shadow-sm">
                <feature.icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-heading text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
