import Link from "next/link"
import { Plane } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-6">
        <div className="flex items-center gap-2">
          <Plane className="size-4 text-muted-foreground" />
          <span className="font-serif text-sm text-muted-foreground">
            JetIntel
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/search"
            className="text-xs text-muted-foreground transition-all duration-200 hover:text-foreground hover:-translate-y-px"
          >
            Fleet
          </Link>
          <Link
            href="/ai"
            className="text-xs text-muted-foreground transition-all duration-200 hover:text-foreground hover:-translate-y-px"
          >
            AI Evaluator
          </Link>
          <Link
            href="/stats"
            className="text-xs text-muted-foreground transition-all duration-200 hover:text-foreground hover:-translate-y-px"
          >
            Analytics
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          {"Aviation Intelligence Platform"}
        </p>
      </div>
    </footer>
  )
}
