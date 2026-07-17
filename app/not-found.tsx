import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 bg-background">
      <div className="space-y-6 max-w-md animate-fade-in">
        <h1 className="text-8xl font-heading font-bold text-primary animate-pulse-glow inline-block rounded-full px-6 py-2">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button render={<Link href="javascript:history.back()" />} variant="outline" className="w-full sm:w-auto gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button render={<Link href="/" />} className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
