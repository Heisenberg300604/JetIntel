import { notFound } from "next/navigation"
import Link from "next/link"
import { getJetById, getJets } from "@/lib/data/jets"
import type { Jet } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Check,
  Plus,
} from "lucide-react"
import { FinancialCard } from "@/components/jet-detail"

export function generateStaticParams() {
  return getJets().map((jet) => ({ id: jet.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jet = getJetById(id)
  if (!jet) return { title: "Jet Not Found" }
  return {
    title: `${jet.manufacturer} ${jet.model}`,
    description: jet.description,
  }
}

const categoryGradients: Record<string, string> = {
  Light: "from-chart-2/20 via-chart-4/10 to-muted",
  Midsize: "from-chart-4/20 via-chart-2/10 to-muted",
  "Super Midsize": "from-chart-3/20 via-chart-1/10 to-muted",
  Heavy: "from-chart-1/20 via-chart-5/10 to-muted",
  "Ultra Long Range": "from-primary/20 via-chart-1/10 to-muted",
}

export default async function JetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const jet = getJetById(id)

  if (!jet) {
    notFound()
  }

  const annualCostMisc =
    jet.annual_cost_total -
    jet.annual_cost_fuel -
    jet.annual_cost_maintenance -
    jet.annual_cost_crew

  const costBreakdown = [
    { label: "Fuel", value: jet.annual_cost_fuel, color: "bg-chart-1" },
    { label: "Maintenance", value: jet.annual_cost_maintenance, color: "bg-chart-2" },
    { label: "Crew", value: jet.annual_cost_crew, color: "bg-chart-3" },
    { label: "Miscellaneous", value: annualCostMisc, color: "bg-chart-5" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Back nav */}
        <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-6 animate-fade-in">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground transition-all duration-200 hover:-translate-x-0.5">
            <Link href="/search">
              <ArrowLeft className="mr-1 size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to Fleet
            </Link>
          </Button>
        </div>

        {/* Header */}
        <section className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            {/* Image / carousel placeholder */}
            <div
              className={`h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br ${
                categoryGradients[jet.category] || "from-muted to-secondary"
              }`}
            >
              {/* simple overlay text for now */}
              <div className="h-full flex flex-col items-center justify-center">
                <p className="font-serif text-lg font-semibold text-foreground/50">
                  {jet.manufacturer}
                </p>
                <p className="font-serif text-2xl font-bold text-foreground/70">
                  {jet.model}
                </p>
              </div>
            </div>

            {/* Info & quick stats */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">{jet.category}</Badge>
                </div>
                <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  {jet.manufacturer} {jet.model}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {jet.description}
                </p>
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Range</span>
                  <span className="font-medium text-foreground">
                    {jet.range_nm.toLocaleString()} NM
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Cruise</span>
                  <span className="font-medium text-foreground">
                    {jet.cruise_knots} kts
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Passengers</span>
                  <span className="font-medium text-foreground">
                    {jet.max_passengers}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">New Price</span>
                  <span className="font-medium text-foreground">
                    ${jet.price_new_million}M
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>Introduced {jet.year_introduced}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Performance */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
              Performance
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Range (NM)</span>
                <span className="text-sm font-medium text-foreground">{jet.range_nm.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cruise Speed (kts)</span>
                <span className="text-sm font-medium text-foreground">{jet.cruise_knots}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cruise Speed (Mach)</span>
                <span className="text-sm font-medium text-foreground">{jet.cruise_mach}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Passengers</span>
                <span className="text-sm font-medium text-foreground">{jet.max_passengers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Runway Required (ft)</span>
                <span className="text-sm font-medium text-foreground">{jet.runway_required_ft.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year Introduced</span>
                <span className="text-sm font-medium text-foreground">{jet.year_introduced}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Financial */}
        <section className="border-t border-border/40 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
              Financial
            </h2>
            <FinancialCard jet={jet} costBreakdown={costBreakdown} />
          </div>
        </section>


        {/* Tags */}
        <section className="border-t border-border/40 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <h2 className="mb-6 font-serif text-xl font-semibold text-foreground">
              Best Suited For
            </h2>
            <div className="flex flex-wrap gap-2">
              {jet.tags.map((tag, i) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-sm px-3 py-1 transition-all duration-200 hover:scale-105 hover:bg-primary/10 hover:text-primary animate-scale-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
