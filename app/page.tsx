"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JetCard } from "@/components/jet-card";
import { PageTransition } from "@/components/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllJets } from "@/lib/api/jets";
import type { Jet } from "@/lib/types";
import {
  Brain,
  BarChart3,
  Navigation,
  Database,
  DollarSign,
  Target,
  ArrowRight,
  Plane,
  Zap,
  Globe2,
  Shield,
} from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "AI Evaluation",
    description:
      "GPT-powered mission analysis matching aircraft to your exact requirements.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Comprehensive speed, range, and efficiency metrics across the fleet.",
  },
  {
    icon: Navigation,
    title: "Distance Calculator",
    description:
      "Nautical mile route planning with airport-to-airport calculations.",
  },
  {
    icon: Database,
    title: "Fleet Intelligence",
    description:
      "Detailed specifications and data on the world's premier business jets.",
  },
  {
    icon: DollarSign,
    title: "Cost Analysis",
    description:
      "Annual operating costs, hourly rates, and fuel efficiency breakdowns.",
  },
  {
    icon: Target,
    title: "Mission Planning",
    description:
      "Match aircraft capabilities to specific route and passenger requirements.",
  },
];

const heroStats = [
  { icon: Plane, label: "Aircraft catalogued", value: "25+" },
  { icon: Globe2, label: "Range data points", value: "7,700 NM max" },
  { icon: Zap, label: "AI-powered analysis", value: "Real-time" },
  { icon: Shield, label: "Data accuracy", value: "Verified" },
];

export default function HomePage() {
  const [jets, setJets] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllJets()
      .then((data) => setJets(data.slice(0, 3)))
      .catch((err) => console.error("Failed to load jets:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <PageTransition>
        <main className="flex-1">
          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="relative overflow-hidden">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
            {/* Central soft glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/[0.10] blur-[140px]" />
            {/* Flanking accent orbs */}
            <div className="pointer-events-none absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-primary/[0.06] blur-[100px]" />
            <div className="pointer-events-none absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-primary/[0.05] blur-[90px]" />
            {/* Subtle dot-grid overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-6 lg:py-36">
              <div className="mx-auto max-w-3xl text-center">
                {/* Animated status badge */}
                <div className="mb-8 flex items-center justify-center animate-fade-in">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 shadow-sm shadow-primary/10 backdrop-blur-sm">
                    <span className="flex size-2 shrink-0 rounded-full bg-primary animate-pulse" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                      Aviation Intelligence Platform
                    </span>
                    <Plane className="size-3.5 text-primary" />
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.85rem] lg:leading-[1.08] animate-slide-up">
                  The Smartest Way to
                  <br />
                  <span className="relative text-primary">
                    Evaluate Any Jet.
                    {/* Underline accent */}
                    <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-primary/30" />
                  </span>
                </h1>

                {/* Subheading */}
                <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg animate-slide-up stagger-2">
                  The definitive platform for business aviation analysis.
                  Evaluate missions with AI, compare performance metrics, and
                  make informed decisions backed by comprehensive fleet data.
                </p>

                {/* CTA buttons */}
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-slide-up stagger-4">
                  <Button
                    asChild
                    size="lg"
                    className="min-w-[190px] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
                  >
                    <Link href="/ai">
                      Evaluate Mission
                      <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-w-[190px] transition-all duration-200 hover:scale-[1.02] hover:border-primary/40 active:scale-[0.98]"
                  >
                    <Link href="/search">Browse Fleet</Link>
                  </Button>
                </div>

                {/* Stats row */}
                <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-slide-up stagger-6">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="group flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/60 px-3 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-sm hover:shadow-primary/5"
                    >
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/15">
                        <stat.icon className="size-4 text-primary" />
                      </div>
                      <p className="font-serif text-sm font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-center text-[11px] leading-tight text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom fade into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </section>

          {/* ── Featured Jets ───────────────────────────────── */}
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
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground transition-all duration-200 hover:-translate-y-px"
                >
                  <Link href="/search">
                    View all
                    <ArrowRight className="ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <>
                    <Skeleton className="h-64 rounded-lg" />
                    <Skeleton className="h-64 rounded-lg" />
                    <Skeleton className="h-64 rounded-lg" />
                  </>
                ) : (
                  jets.map((jet, i) => (
                    <JetCard key={jet.id} jet={jet} index={i} />
                  ))
                )}
              </div>
            </div>
          </section>

          {/* ── Platform Capabilities ───────────────────────── */}
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

          {/* ── Bottom CTA ──────────────────────────────────── */}
          <section className="border-t border-border/40">
            <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 lg:px-6">
              {/* Background glow for CTA */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[100px]" />
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                  Ready to Evaluate Your Mission?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Describe your travel requirements and let our AI match you
                  with the optimal aircraft.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-8 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                >
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
  );
}
