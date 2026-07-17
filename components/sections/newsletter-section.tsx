"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus("loading")
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle")
      }, 3000)
    }, 1500)
  }

  return (
    <section className="w-full py-20 sm:py-24 bg-primary text-primary-foreground border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4 text-primary-foreground">
            Join the Caffora Inner Circle
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Subscribe to receive exclusive access to new collections, design inspiration, and special offers reserved for our community.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-6 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 transition-all shadow-inner"
                disabled={status === "loading" || status === "success"}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="h-12 px-8 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all font-semibold shrink-0 shadow-sm"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>
          
          <div className="h-6 mt-4">
            {status === "success" && (
              <p className="text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                Thank you for subscribing! Welcome to the inner circle.
              </p>
            )}
          </div>
          
          <p className="mt-4 text-xs text-primary-foreground/60">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  )
}
