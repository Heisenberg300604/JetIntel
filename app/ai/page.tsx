"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AIResponseCard } from "@/components/ai-response-card"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { getJetRecommendation } from "@/lib/api/recommend"
import type { AIResponse } from "@/lib/types"
import type { Jet } from "@/lib/types"
import { Brain, Sparkles } from "lucide-react"

export default function AIPage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResponse | null>(null)

  // Parse prompt to extract parameters
  function parsePrompt(text: string) {
    const passengerMatch = text.match(/(\d+)\s*(?:passenger|pax|people|person)/i)
    const passengers = passengerMatch ? parseInt(passengerMatch[1], 10) : 4

    const budgetMatch = text.match(/(?:under\s*)?[\$]?(\d+)M?(?:\s*(?:million|M))?/i)
    const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : 50

    // Try to extract airport codes or cities (simple heuristic)
    const airportMatch = text.match(/([A-Z]{3}|from\s+([A-Za-z\s]+?)\s+to|to\s+([A-Za-z\s]+?)[\.,])/gi)
    
    return {
      departure: "JFK",
      arrival: "LHR",
      passengers,
      budget,
    }
  }

  async function handleEvaluate() {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const params = parsePrompt(prompt)
      const jets = await getJetRecommendation(
        params.departure,
        params.arrival,
        params.passengers,
        params.budget
      )

      if (jets.length === 0) {
        setResult(null)
        return
      }

      // Transform API response to AIResponse format
      const primary = jets[0]
      const alternatives = jets.slice(1, 3)

      const response: AIResponse = {
        missionSummary: `Based on your requirements for ${params.passengers} passengers with a budget of $${params.budget}M, I've found ${jets.length} suitable aircraft in our fleet.`,
        primary: {
          id: primary.id,
          name: `${primary.manufacturer} ${primary.model}`,
          category: primary.category,
          match_score: 95,
          key_points: [
            `Range: ${primary.range_nm.toLocaleString()} NM`,
            `Cruise Speed: ${primary.cruise_knots} knots`,
            `Passengers: Up to ${primary.max_passengers}`,
            `Price: $${primary.price_new_million}M`,
          ],
          reason: `The ${primary.model} is an excellent fit for your mission requirements, offering the ideal balance of range, capacity, and operating costs.`,
        },
        alternatives: alternatives.map((jet) => ({
          id: jet.id,
          name: `${jet.manufacturer} ${jet.model}`,
          category: jet.category,
          match_score: 85,
          key_points: [
            `Range: ${jet.range_nm.toLocaleString()} NM`,
            `Cruise Speed: ${jet.cruise_knots} knots`,
            `Passengers: Up to ${jet.max_passengers}`,
            `Price: $${jet.price_new_million}M`,
          ],
          reason: `This aircraft offers comparable capabilities with different trade-offs in range and passenger capacity.`,
        })),
      }

      setResult(response)
    } catch (error) {
      console.error("Failed to get recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2 animate-fade-in">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="size-5 text-primary" />
                </div>
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl animate-slide-up">
                AI Mission Evaluation
              </h1>
              <p className="mt-3 text-muted-foreground animate-slide-up stagger-2">
                Describe your travel requirements and our AI will match you with the optimal aircraft from our fleet.
              </p>
            </div>
          </div>
        </section>

        {/* Input */}
        <section className="mx-auto max-w-3xl px-4 py-10 lg:px-6 animate-slide-up stagger-4">
          <div className="flex flex-col gap-4">
            <label htmlFor="mission-prompt" className="sr-only">
              Mission prompt
            </label>
            <Textarea
              id="mission-prompt"
              placeholder="8 passengers, 3000nm, under $20M, transatlantic capable."
              className="min-h-[120px] resize-none text-base leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleEvaluate()
                }
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {"Ctrl+Enter to submit"}
              </p>
              <Button
                onClick={handleEvaluate}
                disabled={!prompt.trim() || loading}
                size="lg"
                className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-1 size-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1 size-4" />
                    Evaluate Mission
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="mx-auto max-w-3xl px-4 pb-16 lg:px-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        {result && !loading && (
          <section className="mx-auto max-w-3xl px-4 pb-16 lg:px-6 animate-slide-up">
            <div className="flex flex-col gap-6">
              {/* Mission summary */}
              <div className="rounded-lg border border-border/60 bg-secondary/30 px-4 py-3 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  {result.missionSummary}
                </p>
              </div>

              {/* Primary recommendation */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
                  Top Match
                </p>
                <AIResponseCard
                  recommendation={result.primary}
                  variant="primary"
                />
              </div>

              {/* Alternatives */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Alternatives
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {result.alternatives.map((alt, i) => (
                    <AIResponseCard
                      key={i}
                      recommendation={alt}
                      variant="secondary"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
