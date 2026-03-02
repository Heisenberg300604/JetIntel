"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AIResponseCard } from "@/components/ai-response-card"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { getMockRecommendation } from "@/lib/data/ai-mock"
import type { AIResponse } from "@/lib/types"
import { Brain, Sparkles } from "lucide-react"

export default function AIPage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResponse | null>(null)

  async function handleEvaluate() {
    if (!prompt.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await getMockRecommendation(prompt)
      setResult(response)
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
