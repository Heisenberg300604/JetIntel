"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JetCard } from "@/components/jet-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllJets } from "@/lib/api/jets";
import type { Jet, JetCategory } from "@/lib/types";
import {
  LayoutGrid,
  TableIcon,
  X,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories: JetCategory[] = [
  "Light",
  "Midsize",
  "Super Midsize",
  "Heavy",
  "Ultra Long Range",
];

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
  const [allJets, setAllJets] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxRange, setMaxRange] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxPassengers, setMaxPassengers] = useState(0);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sortField, setSortField] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedCategories, setSelectedCategories] = useState<JetCategory[]>(
    [],
  );
  const [minRange, setMinRange] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(0);
  const [minPassengers, setMinPassengers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadJets();
  }, []);

  const loadJets = async () => {
    try {
      const data = await getAllJets();
      setAllJets(data);
      const range = Math.max(...data.map((j) => j.range_nm));
      const price = Math.max(...data.map((j) => j.price_new_million));
      const passengers = Math.max(...data.map((j) => j.max_passengers));
      setMaxRange(range);
      setMaxPrice(price);
      setMaxPassengers(passengers);
      setMaxPriceFilter(price);
    } catch (error) {
      console.error("Failed to load jets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return allJets.filter((jet) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(jet.category)
      )
        return false;
      if (jet.range_nm < minRange) return false;
      if (jet.price_new_million > maxPriceFilter) return false;
      if (jet.max_passengers < minPassengers) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable =
          `${jet.manufacturer} ${jet.model} ${jet.category} ${jet.tags?.join(" ") ?? ""}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [
    allJets,
    selectedCategories,
    minRange,
    maxPriceFilter,
    minPassengers,
    searchQuery,
  ]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = (a as any)[sortField];
      const vb = (b as any)[sortField];
      if (typeof va === "string" && typeof vb === "string") {
        return va.localeCompare(vb);
      }
      return va - vb;
    });
    if (sortDir === "desc") arr.reverse();
    return arr;
  }, [filtered, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(
    () =>
      sorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [sorted, safePage],
  );

  // Reset to page 1 whenever filters / sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    minRange,
    maxPriceFilter,
    minPassengers,
    searchQuery,
    sortField,
    sortDir,
  ]);

  function toggleCategory(cat: JetCategory) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function resetFilters() {
    setSelectedCategories([]);
    setMinRange(0);
    setMaxPriceFilter(maxPrice);
    setMinPassengers(0);
    setSearchQuery("");
    setCurrentPage(1);
  }

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function sortIndicator(field: string) {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    minRange > 0 ||
    maxPriceFilter < maxPrice ||
    minPassengers > 0 ||
    searchQuery.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              Database
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-foreground">
              Fleet Search
            </h1>
            <p className="mt-1 text-muted-foreground">
              Filter, sort, and compare business jets across all categories.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* ── Filters Sidebar ──────────────────────────── */}
            <aside className="w-full shrink-0 lg:w-64">
              {/* Mobile toggle */}
              <Button
                variant="outline"
                className="mb-4 w-full lg:hidden"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <SlidersHorizontal className="mr-2 size-4" />
                {filtersOpen ? "Hide Filters" : "Show Filters"}
                {hasFilters && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {
                      [
                        selectedCategories.length > 0,
                        minRange > 0,
                        maxPriceFilter < maxPrice,
                        minPassengers > 0,
                        searchQuery.length > 0,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </Button>

              <div
                className={cn(
                  "flex flex-col gap-6",
                  !filtersOpen && "hidden lg:flex",
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
                          selectedCategories.includes(cat)
                            ? "default"
                            : "outline"
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

            {/* ── Results ──────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground shrink-0">
                  {loading
                    ? "Loading..."
                    : `${sorted.length} aircraft${totalPages > 1 ? ` · page ${safePage} of ${totalPages}` : ""}`}
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

              {/* Empty state */}
              {!loading && sorted.length === 0 && (
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
              )}

              {/* Loading skeleton */}
              {loading && (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              )}

              {/* Grid view */}
              {!loading && sorted.length > 0 && view === "grid" && (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paginated.map((jet) => (
                    <JetCard key={jet.id} jet={jet} />
                  ))}
                </div>
              )}

              {/* Table view */}
              {!loading && sorted.length > 0 && view === "table" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow className="bg-muted/30">
                        <TableHead
                          className="font-medium cursor-pointer select-none"
                          onClick={() => toggleSort("manufacturer")}
                        >
                          Aircraft{sortIndicator("manufacturer")}
                        </TableHead>
                        <TableHead
                          className="font-medium cursor-pointer select-none"
                          onClick={() => toggleSort("category")}
                        >
                          Category{sortIndicator("category")}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer select-none"
                          onClick={() => toggleSort("range_nm")}
                        >
                          Range{sortIndicator("range_nm")}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer select-none"
                          onClick={() => toggleSort("cruise_knots")}
                        >
                          Speed{sortIndicator("cruise_knots")}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer select-none"
                          onClick={() => toggleSort("max_passengers")}
                        >
                          Pax{sortIndicator("max_passengers")}
                        </TableHead>
                        <TableHead
                          className="text-right font-medium cursor-pointer select-none"
                          onClick={() => toggleSort("price_new_million")}
                        >
                          Price{sortIndicator("price_new_million")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginated.map((jet) => (
                        <TableRow
                          key={jet.id}
                          className="cursor-pointer transition-colors hover:bg-muted/20"
                        >
                          <TableCell className="font-medium">
                            <Link
                              href={`/jets/${jet.id}`}
                              className="hover:text-primary"
                            >
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

              {/* ── Pagination Controls ───────────────────── */}
              {!loading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {(safePage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(safePage * ITEMS_PER_PAGE, sorted.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {sorted.length}
                    </span>
                  </p>

                  <div className="flex items-center gap-1">
                    {/* Previous */}
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={safePage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (Math.abs(page - safePage) <= 1) return true;
                        return false;
                      })
                      .reduce<(number | "…")[]>((acc, page, idx, arr) => {
                        if (idx > 0 && typeof arr[idx - 1] === "number") {
                          const prev = arr[idx - 1] as number;
                          if (page - prev > 1) acc.push("…");
                        }
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "…" ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1 text-sm text-muted-foreground"
                          >
                            …
                          </span>
                        ) : (
                          <Button
                            key={item}
                            variant={item === safePage ? "default" : "outline"}
                            size="icon-sm"
                            onClick={() => setCurrentPage(item as number)}
                            aria-label={`Page ${item}`}
                            aria-current={
                              item === safePage ? "page" : undefined
                            }
                            className="min-w-[2rem]"
                          >
                            {item}
                          </Button>
                        ),
                      )}

                    {/* Next */}
                    <Button
                      variant="outline"
                      size="icon-sm"
                      disabled={safePage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      aria-label="Next page"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
