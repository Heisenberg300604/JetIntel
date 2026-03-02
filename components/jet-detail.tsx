"use client"

import { useState } from "react"
import type { Jet } from "@/lib/types"

export function FinancialCard({
  jet,
  costBreakdown,
}: {
  jet: Jet
  costBreakdown: { label: string; value: number; color: string }[]
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <span className="text-sm text-muted-foreground">New Price</span>
        <div className="font-medium text-foreground">${jet.price_new_million}M</div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Used Price</span>
        <div className="font-medium text-foreground">${jet.price_used_million}M</div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Cost / hr</span>
        <div className="font-medium text-foreground">
          ${jet.cost_per_hour.toLocaleString()}
        </div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Fuel eff. (L/hr)</span>
        <div className="font-medium text-foreground">
          {jet.fuel_efficiency_lph}
        </div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Annual Cost</span>
        <div className="font-medium text-foreground">
          ${(jet.annual_cost_total / 1000000).toFixed(1)}M
        </div>
      </div>

      <div className="col-span-full">
        <button
          onClick={() => setShow((v) => !v)}
          className="text-sm text-primary underline"
        >
          {show ? "Hide" : "Show"} breakdown
        </button>

        {show && (
          <div className="mt-3 space-y-2">
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              {costBreakdown.map((item) => (
                <div
                  key={item.label}
                  className={item.color}
                  style={{
                    width: `${(item.value / jet.annual_cost_total) * 100}%`,
                  }}
                />
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {costBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-sm ${item.color}`} />
                    <span className="text-muted-foreground">
                      {item.label}
                    </span>
                  </div>

                  <span className="font-medium text-foreground">
                    ${(item.value / 1000).toLocaleString()}K
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}