import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JetCard } from "@/components/jet-card"
import { PageTransition } from "@/components/page-transition"
import { getFeaturedJets } from "@/lib/data/jets"
import {
  Brain,
  BarChart3,
  Navigation,
  Database,
  DollarSign,
  Target,
  ArrowRight,
  Plane,
} from "lucide-react"

const capabilities = [
  {
    icon: Brain,
    title: "AI Evaluation",
    description: "GPT-powered mission analysis matching aircraft to your exact requirements.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Comprehensive speed, range, and efficiency metrics across the fleet.",
  },
  {
    icon: Navigation,
    title: "Distance Calculator",
    description: "Nautical mile route planning with airport-to-airport calculations.",
  },
  {
    icon: Database,
    title: "Fleet Intelligence",
    description: "Detailed specifications and data on the world's premier business jets.",
  },
  {
    icon: DollarSign,
    title: "Cost Analysis",
    description: "Annual operating costs, hourly rates, and fuel efficiency breakdowns.",
  },
  {
    icon: Target,
    title: "Mission Planning",
    description: "Match aircraft capabilities to specific route and passenger requirements.",
  },
]

export default function HomePage() {
  const featured = getFeaturedJets()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <PageTransition>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-6 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex items-center justify-center gap-2 animate-fade-in">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Plane className="size-5 text-primary" />
                </div>
              </div>
              <h1 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-slide-up">
                Aviation Intelligence.
                <br />
                <span className="text-primary">Simplified.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg animate-slide-up stagger-2">
                The definitive platform for business jet analysis. Evaluate missions with AI, compare performance metrics, and make informed aviation decisions backed by comprehensive data.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-slide-up stagger-4">
                <Button asChild size="lg" className="min-w-[180px] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
                  <Link href="/ai">
                    Evaluate Mission
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-w-[180px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <Link href="/search">Browse Fleet</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jets */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary">
                  Featured Fleet
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                  Select Aircraft
                </h2>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground transition-all duration-200 hover:-translate-y-px">
                <Link href="/search">
                  View all
                  <ArrowRight className="ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((jet, i) => (
                <JetCard key={jet.id} jet={jet} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Platform Capabilities */}
        <section className="border-t border-border/40 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Platform Capabilities
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                Intelligence Tools
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((cap, i) => (
                <div
                  key={cap.title}
                  className="group rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-110">
                    <cap.icon className="size-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {cap.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                Ready to Evaluate Your Mission?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Describe your travel requirements and let our AI match you with the optimal aircraft.
              </p>
              <Button asChild size="lg" className="mt-8 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
                <Link href="/ai">
                  Start AI Evaluation
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      </PageTransition>

      <Footer />
    </div>
  )
}
