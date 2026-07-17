"use client"

import { useEffect, useState } from "react"

interface StatItemProps {
  label: string
  value: number
  suffix?: string
  prefix?: string
}

function StatItem({ label, value, suffix = "", prefix = "" }: StatItemProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const duration = 2000 // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      
      // Easing function (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - percentage, 4)
      
      setCount(Math.floor(value * easeOut))

      if (percentage < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    const element = document.getElementById(`stat-${label.replace(/\s+/g, '-')}`)
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [label, value])

  return (
    <div id={`stat-${label.replace(/\s+/g, '-')}`} className="flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all hover:bg-muted/50">
      <div className="text-4xl sm:text-5xl font-bold tracking-tight text-primary mb-2 font-heading">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm sm:text-base font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

export function StatsBar() {
  return (
    <section className="w-full bg-surface border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-border max-md:[&>*:nth-child(even)]:border-l max-md:[&>*:nth-child(n+3)]:border-t md:divide-x">
          <StatItem label="Premium Products" value={1500} suffix="+" />
          <StatItem label="Happy Customers" value={50} suffix="k+" />
          <StatItem label="Successful Orders" value={100} suffix="k+" />
          <StatItem label="Client Satisfaction" value={99} suffix="%" />
        </div>
      </div>
    </section>
  )
}
