import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AIRecommendation } from "@/lib/types"
import { Navigation, Users, Gauge, DollarSign, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface AIResponseCardProps {
  recommendation: AIRecommendation
  variant?: "primary" | "secondary"
}

export function AIResponseCard({
  recommendation,
  variant = "primary",
}: AIResponseCardProps) {
  const { jet, matchScore, summary, keyReasons } = recommendation
  const isPrimary = variant === "primary"

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 animate-scale-in",
        isPrimary && "border-primary/30 ring-1 ring-primary/10"
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {isPrimary && (
              <Badge className="mb-2 bg-primary/10 text-primary border-primary/20" variant="outline">
                Top Recommendation
              </Badge>
            )}
            <CardTitle className="font-serif text-lg">
              <Link
                href={`/jets/${jet.id}`}
                className="hover:text-primary transition-colors"
              >
                {jet.manufacturer} {jet.model}
              </Link>
            </CardTitle>
            <p className="text-xs text-muted-foreground">{jet.category}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                "font-serif text-2xl font-bold",
                matchScore >= 80
                  ? "text-chart-4"
                  : matchScore >= 60
                    ? "text-chart-3"
                    : "text-muted-foreground"
              )}
            >
              {matchScore}%
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Match
            </span>
          </div>
        </div>
        <Progress value={matchScore} className="h-1.5" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-1.5">
            <Navigation className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-foreground">
              {jet.range_nm.toLocaleString()} NM
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-foreground">
              {jet.max_passengers} pax
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-foreground">
              Mach {jet.cruise_mach}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-foreground">
              ${jet.price_new_million}M
            </span>
          </div>
        </div>

        {keyReasons.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Key Factors
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keyReasons.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-xs text-foreground"
                >
                  <Plane className="size-3 text-primary" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
