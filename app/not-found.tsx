import Link from "next/link"
import { Plane, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="flex size-24 items-center justify-center rounded-full bg-primary/10">
          <Plane className="size-12 text-primary animate-bounce" />
        </div>

        {/* Error Code */}
        <div className="space-y-4">
          <h1 className="font-serif text-6xl font-bold tracking-tighter">
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          <h2 className="font-serif text-3xl font-semibold">
            Lost in the Skies
          </h2>

          <p className="max-w-md text-lg text-muted-foreground">
            This page could not be found. It seems our jet has veered off course. Let's navigate back to familiar territory.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>

          <Button asChild size="lg">
            <Link href="/jets">
              <Plane className="mr-2 size-4" />
              Browse Jets
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="space-y-3 border-t border-border/30 pt-8">
          <p className="text-sm text-muted-foreground">
            Need assistance?
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/auth/login" className="text-primary hover:underline">
              Return to Login
            </Link>
            <Link href="/" className="text-primary hover:underline">
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-primary/5 to-transparent" />
    </div>
  )
}
