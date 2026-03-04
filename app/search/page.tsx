"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JetCard } from "@/components/jet-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getJets } from "@/lib/data/jets"
import type { Jet, JetCategory } from "@/lib/types"
import {
  LayoutGrid,
  TableIcon,
  X,
  Search,
  SlidersHorizontal,
  Check,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categories: JetCategory[] = [
  "Light",
  "Midsize",
  "Super Midsize",
  "Heavy",
  "Ultra Long Range",
]

const allJets = getJets()
const maxRange = Math.max(...allJets.map((j) => j.range_nm))
const maxPrice = Math.max(...allJets.map((j) => j.price_new_million))
const maxPassengers = Math.max(...allJets.map((j) => j.max_passengers))

export default function SearchPage() {
  const [view, setView] = useState<"grid" | "table">("grid")
  const [sortField, setSortField] = useState<string>("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [selectedCategories, setSelectedCategories] = useState<JetCategory[]>([])
  const [minRange, setMinRange] = useState(0)
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxPrice)
  const [minPassengers, setMinPassengers] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    return allJets.filter((jet) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(jet.category)
      )
        return false
      if (jet.range_nm < minRange) return false
      if (jet.price_new_million > maxPriceFilter) return false
      if (jet.max_passengers < minPassengers) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const searchable =
          `${jet.manufacturer} ${jet.model} ${jet.category}`.toLowerCase()
        if (!searchable.includes(q)) return false
      }
      return true
    })
  }, [selectedCategories, minRange, maxPriceFilter, minPassengers, searchQuery])

  const sorted = useMemo(() => {
    if (!sortField) return filtered
    const arr = [...filtered]
    arr.sort((a, b) => {
      const va = (a as any)[sortField]
      const vb = (b as any)[sortField]
      if (typeof va === "string" && typeof vb === "string") {
        return va.localeCompare(vb)
      }
      return va - vb
    })
    if (sortDir === "desc") arr.reverse()
    return arr
  }, [filtered, sortField, sortDir])

  function toggleCategory(cat: JetCategory) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function resetFilters() {
    setSelectedCategories([])
    setMinRange(0)
    setMaxPriceFilter(maxPrice)
    setMinPassengers(0)
    setSearchQuery("")
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    minRange > 0 ||
    maxPriceFilter < maxPrice ||
    minPassengers > 0 ||
    searchQuery.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Fleet Search
            </h1>
            <p className="mt-1 text-muted-foreground">
              Filter and compare business jets across all categories.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Filters - Sidebar on desktop */}
            <aside className="w-full shrink-0 lg:w-64">
              {/* Mobile toggle */}
              <Button
                variant="outline"
                className="mb-4 w-full lg:hidden"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <SlidersHorizontal className="mr-2 size-4" />
                {filtersOpen ? "Hide Filters" : "Show Filters"}
              </Button>

              <div
                className={cn(
                  "flex flex-col gap-6",
                  !filtersOpen && "hidden lg:flex"
                )}
              >
                {/* Search */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search aircraft..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Category
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant={
                          selectedCategories.includes(cat) ? "default" : "outline"
                        }
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Min Range */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Min Range: {minRange.toLocaleString()} NM
                  </Label>
                  <Slider
                    value={[minRange]}
                    min={0}
                    max={maxRange}
                    step={100}
                    onValueChange={(v) => setMinRange(v[0])}
                  />
                </div>

                {/* Max Price */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Max Price: ${maxPriceFilter}M
                  </Label>
                  <Slider
                    value={[maxPriceFilter]}
                    min={0}
                    max={maxPrice}
                    step={1}
                    onValueChange={(v) => setMaxPriceFilter(v[0])}
                  />
                </div>

                {/* Min Passengers */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Min Passengers: {minPassengers}
                  </Label>
                  <Slider
                    value={[minPassengers]}
                    min={0}
                    max={maxPassengers}
                    step={1}
                    onValueChange={(v) => setMinPassengers(v[0])}
                  />
                </div>

                {/* Reset */}
                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground"
                  >
                    <X className="mr-1 size-3.5" />
                    Reset Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {sorted.length} aircraft
                </p>
                <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
                  <Button
                    variant={view === "grid" ? "secondary" : "ghost"}
                    size="icon-sm"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="size-4" />
                  </Button>
                  <Button
                    variant={view === "table" ? "secondary" : "ghost"}
                    size="icon-sm"
                    onClick={() => setView("table")}
                    aria-label="Table view"
                  >
                    <TableIcon className="size-4" />
                  </Button>
                </div>
              </div>

              {sorted.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12">
                  <p className="font-serif text-lg text-foreground">
                    No aircraft match your criteria.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="mt-4"
                  >
                    Reset Filters
                  </Button>
                </Card>
              ) : view === "grid" ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {sorted.map((jet) => (
                    <JetCard key={jet.id} jet={jet} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-10"></TableHead>
                        <TableHead
                          className="font-medium cursor-pointer"
                          onClick={() => {
                            if (sortField === 'manufacturer') {
                              setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                            } else {
                              setSortField('manufacturer')
                              setSortDir('asc')
                            }
                          }}
                        >
                          Aircraft {sortField === 'manufacturer' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </TableHead>
                        <TableHead
                          className="font-medium cursor-pointer"
                          onClick={() => {
                            if (sortField === 'category') {
                              setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                            } else {
                              setSortField('category')
                              setSortDir('asc')
                            }
                          }}
                        >
                          Category {sortField === 'category' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer"
                          onClick={() => {
                            if (sortField === 'range_nm') {
                              setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                            } else {
                              setSortField('range_nm')
                              setSortDir('asc')
                            }
                          }}
                        >
                          Range {sortField === 'range_nm' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer"
                          onClick={() => {
                            if (sortField === 'cruise_knots') {
                              setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                            } else {
                              setSortField('cruise_knots')
                              setSortDir('asc')
                            }
                          }}
                        >
                          Speed {sortField === 'cruise_knots' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer"
                          onClick={() => {
                            if (sortField === 'max_passengers') {
                              setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                            } else {
                              setSortField('max_passengers')
                              setSortDir('asc')
                            }
                          }}
                        >
                          Pax {sortField === 'max_passengers' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer"
                          onClick={() => {
                            if (sortField === 'price_new_million') {
                              setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                            } else {
                              setSortField('price_new_million')
                              setSortDir('asc')
                            }
                          }}
                        >
                          Price {sortField === 'price_new_million' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sorted.map((jet) => (
                        <TableRow
                          key={jet.id}
                          className="cursor-pointer transition-colors hover:bg-muted/20"
                        >
                          <TableCell className="w-10"></TableCell>
                          {/* <TableCell className="p-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggle(jet.id)
                              }}
                              className="p-2"
                            >
                              {selectedIds.includes(jet.id) ? (
                                <Check className="size-4 text-primary" />
                              ) : (
                                <Plus className="size-4 text-muted-foreground" />
                              )}
                            </button>
                          </TableCell> */}
                          <TableCell className="font-medium">
                            <Link href={`/jets/${jet.id}`} className="hover:text-primary">
                              {jet.manufacturer} {jet.model}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {jet.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {jet.range_nm.toLocaleString()} NM
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {jet.cruise_knots} kts
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {jet.max_passengers}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            ${jet.price_new_million}M
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
