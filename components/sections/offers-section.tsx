/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Initial calculation
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-3 sm:gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-background/95 backdrop-blur-sm text-foreground font-bold text-xl sm:text-2xl shadow-lg border border-border/10">
            {value.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-medium mt-2 text-white/90">{unit}</span>
        </div>
      ))}
    </div>
  )
}

export function OffersSection() {
  // Use a fixed date to avoid hydration mismatch, or just render it client-side only
  // To avoid hydration mismatch safely, we initialize after mount
  const [targetDate, setTargetDate] = useState<Date | null>(null)

  useEffect(() => {
    const date = new Date()
    date.setDate(date.getDate() + 3)
    setTargetDate(date)
  }, [])

  return (
    <section className="w-full py-12 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary/10 group">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2064&auto=format&fit=crop"
              alt="Special offer background"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24 max-w-3xl text-white min-h-[500px]">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 text-sm font-medium mb-6 w-fit animate-in fade-in slide-in-from-bottom-4 duration-700">
              Limited Time Offer
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight mb-4 text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
              Spring Flash Sale
            </h2>
            
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
              Get up to 40% off on our entire new living room collection. Transform your space with premium artisan furniture.
            </p>
            
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-both">
              {targetDate && <CountdownTimer targetDate={targetDate} />}
            </div>
            
            <Button render={<Link href="/products?sale=true" />} size="lg" className="w-fit h-14 px-8 text-base rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700 fill-mode-both">
              Shop The Sale
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

