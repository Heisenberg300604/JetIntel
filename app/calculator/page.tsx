"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  searchAirports,
  calculateDistanceNM,
  nmToKm,
  airports,
} from "@/lib/data/airports"
import { getJets } from "@/lib/data/jets"
import type { Airport } from "@/lib/types"
import {
  MapPin,
  ArrowRightLeft,
  Navigation,
  Plane,
  ChevronsUpDown,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

const allJets = getJets()

export default function CalculatorPage() {
  const [fromAirport, setFromAirport] = useState<Airport | null>(null)
  const [toAirport, setToAirport] = useState<Airport | null>(null)
  const [distance, setDistance] = useState<number | null>(null)

  function handleCalculate() {
    if (!fromAirport || !toAirport) return
    const nm = calculateDistanceNM(fromAirport, toAirport)
    setDistance(nm)
  }

  function handleSwap() {
    const temp = fromAirport
    setFromAirport(toAirport)
    setToAirport(temp)
    setDistance(null)
  }

  const capableJets = useMemo(() => {
    if (distance === null) return []
    return allJets
      .filter((j) => j.range_nm >= distance)
      .sort((a, b) => a.price_new_million - b.price_new_million)
  }, [distance])

  const categoryGroups = useMemo(() => {
    const groups: Record<string, number> = {}
    capableJets.forEach((j) => {
      groups[j.category] = (groups[j.category] || 0) + 1
    })
    return Object.entries(groups).sort((a, b) => b[1] - a[1])
  }, [capableJets])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Navigation className="size-5 text-primary" />
              </div>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Distance Calculator
            </h1>
            <p className="mt-2 text-muted-foreground">
              Calculate nautical mile distances between airports and find capable aircraft.
            </p>
          </div>

          {/* Calculator Card */}
          <Card>
            <CardContent className="flex flex-col gap-6 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* From */}
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    From
                  </label>
                  <AirportCombobox
                    value={fromAirport}
                    onChange={(a) => {
                      setFromAirport(a)
                      setDistance(null)
                    }}
                    placeholder="Departure airport..."
                  />
                </div>

                {/* Swap */}
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 self-center sm:self-end"
                  onClick={handleSwap}
                  aria-label="Swap airports"
                >
                  <ArrowRightLeft className="size-4" />
                </Button>

                {/* To */}
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    To
                  </label>
                  <AirportCombobox
                    value={toAirport}
                    onChange={(a) => {
                      setToAirport(a)
                      setDistance(null)
                    }}
                    placeholder="Arrival airport..."
                  />
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                disabled={!fromAirport || !toAirport}
                size="lg"
                className="w-full"
              >
                <MapPin className="mr-1 size-4" />
                Calculate Distance
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {distance !== null && fromAirport && toAirport && (
            <div className="mt-8 flex flex-col gap-6">
              {/* Distance display */}
              <Card>
                <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {fromAirport.iata} to {toAirport.iata}
                  </p>
                  <p className="font-serif text-5xl font-bold text-foreground">
                    {distance.toLocaleString()}
                  </p>
                  <p className="text-lg text-primary">Nautical Miles</p>
                  <p className="text-sm text-muted-foreground">
                    {nmToKm(distance).toLocaleString()} km
                  </p>
                </CardContent>
              </Card>

              {/* Capable categories */}
              {capableJets.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-base">
                      Capable Aircraft ({capableJets.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      {categoryGroups.map(([cat, count]) => (
                        <Badge key={cat} variant="secondary" className="text-sm px-3 py-1">
                          {cat} ({count})
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      {capableJets.map((jet) => (
                        <div
                          key={jet.id}
                          className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 transition-colors hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <Plane className="size-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {jet.manufacturer} {jet.model}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {jet.category} &middot;{" "}
                                {jet.range_nm.toLocaleString()} NM range
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              ${jet.price_new_million}M
                            </p>
                            <p className="text-xs text-muted-foreground">
                              +{(jet.range_nm - distance).toLocaleString()} NM margin
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {capableJets.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="font-serif text-lg text-foreground">
                    No aircraft in our fleet can cover this distance nonstop.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Consider a fuel stop or check for ultra-long-range options.
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function AirportCombobox({
  value,
  onChange,
  placeholder,
}: {
  value: Airport | null
  onChange: (airport: Airport | null) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const results = useMemo(() => {
    if (!search) return airports.slice(0, 10)
    return searchAirports(search)
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal"
        >
          {value ? (
            <span className="truncate">
              <span className="font-semibold">{value.iata}</span>
              {" - "}
              {value.city}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search airports..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No airports found.</CommandEmpty>
            <CommandGroup>
              {results.map((airport) => (
                <CommandItem
                  key={airport.iata}
                  value={airport.iata}
                  onSelect={() => {
                    onChange(airport)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value?.iata === airport.iata ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-semibold">{airport.iata}</span>
                  <span className="ml-1 text-muted-foreground">
                    {airport.city}, {airport.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
