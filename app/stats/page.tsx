"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getJets } from "@/lib/data/jets"
import {
  Database,
  Navigation,
  DollarSign,
  Gauge,
  Fuel,
} from "lucide-react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  Cell,
} from "recharts"

const jets = getJets()

// Summary computations
const totalJets = jets.length
const avgRange = Math.round(jets.reduce((s, j) => s + j.range_nm, 0) / totalJets)
const avgPrice = (jets.reduce((s, j) => s + j.price_new_million, 0) / totalJets).toFixed(1)
const fastest = jets.reduce((a, b) => (a.cruise_knots > b.cruise_knots ? a : b))
const mostEfficient = jets.reduce((a, b) =>
  a.fuel_efficiency_lph < b.fuel_efficiency_lph ? a : b
)

// Chart data
const rangeDistribution = jets
  .map((j) => ({
    name: `${j.manufacturer} ${j.model}`.length > 18
      ? `${j.model}`
      : `${j.manufacturer} ${j.model}`,
    range: j.range_nm,
    category: j.category,
  }))
  .sort((a, b) => b.range - a.range)

const priceVsRange = jets.map((j) => ({
  name: `${j.manufacturer} ${j.model}`,
  range: j.range_nm,
  price: j.price_new_million,
  passengers: j.max_passengers,
}))

const passengerVsCost = jets.map((j) => ({
  name: `${j.manufacturer} ${j.model}`,
  passengers: j.max_passengers,
  costPerHour: j.cost_per_hour,
}))

const yearTimeline = jets
  .map((j) => ({
    year: j.year_introduced,
    model: j.model,
    range: j.range_nm,
  }))
  .sort((a, b) => a.year - b.year)

const fuelEfficiency = jets
  .map((j) => ({
    name: j.model,
    efficiency: j.fuel_efficiency_lph,
  }))
  .sort((a, b) => a.efficiency - b.efficiency)

const rangeConfig: ChartConfig = {
  range: { label: "Range (NM)", color: "var(--chart-1)" },
}

const priceRangeConfig: ChartConfig = {
  price: { label: "Price ($M)", color: "var(--chart-2)" },
}

const passengerCostConfig: ChartConfig = {
  costPerHour: { label: "Cost/Hr ($)", color: "var(--chart-3)" },
}

const yearConfig: ChartConfig = {
  range: { label: "Range (NM)", color: "var(--chart-4)" },
}

const fuelConfig: ChartConfig = {
  efficiency: { label: "Fuel Burn (L/hr)", color: "var(--chart-5)" },
}

const chartBarColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export default function StatsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Fleet Analytics
            </h1>
            <p className="mt-1 text-muted-foreground">
              High-level intelligence across the entire fleet inventory.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={Database}
              label="Total Jets"
              value={totalJets.toString()}
            />
            <StatCard
              icon={Navigation}
              label="Avg Range"
              value={`${avgRange.toLocaleString()} NM`}
            />
            <StatCard
              icon={DollarSign}
              label="Avg Price"
              value={`$${avgPrice}M`}
            />
            <StatCard
              icon={Gauge}
              label="Fastest"
              value={`${fastest.cruise_knots} kts`}
              subtitle={`${fastest.manufacturer} ${fastest.model}`}
            />
            <StatCard
              icon={Fuel}
              label="Most Efficient"
              value={`${mostEfficient.fuel_efficiency_lph} L/hr`}
              subtitle={`${mostEfficient.manufacturer} ${mostEfficient.model}`}
            />
          </div>

          {/* Charts Grid */}
          <div className="hidden md:grid gap-6 lg:grid-cols-2">
            {/* Range Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-serif text-base">
                  Range Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={rangeConfig} className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                  <BarChart
                    data={rangeDistribution}
                    margin={{ top: 5, right: 10, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={40}
                      fontSize={10}
                    />
                    <YAxis fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="range" radius={[4, 4, 0, 0]}>
                      {rangeDistribution.map((_, index) => (
                        <Cell
                          key={index}
                          fill={chartBarColors[index % chartBarColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Price vs Range */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-base">
                  Price vs Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={priceRangeConfig} className="h-[250px] sm:h-[280px] w-full">
                  <ScatterChart margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" name="Range (NM)" fontSize={11} />
                    <YAxis dataKey="price" name="Price ($M)" fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Scatter data={priceVsRange} fill="var(--chart-2)">
                      {priceVsRange.map((_, index) => (
                        <Cell
                          key={index}
                          fill={chartBarColors[index % chartBarColors.length]}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Passenger vs Cost */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-base">
                  Passengers vs Cost/Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={passengerCostConfig}
                  className="h-[250px] sm:h-[280px] w-full"
                >
                  <ScatterChart margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="passengers" name="Passengers" fontSize={11} />
                    <YAxis dataKey="costPerHour" name="Cost/Hr ($)" fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Scatter data={passengerVsCost} fill="var(--chart-3)">
                      {passengerVsCost.map((_, index) => (
                        <Cell
                          key={index}
                          fill={chartBarColors[index % chartBarColors.length]}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Year Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-base">
                  Year Introduced Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={yearConfig} className="h-[250px] sm:h-[280px] w-full">
                  <AreaChart
                    data={yearTimeline}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" fontSize={11} />
                    <YAxis fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="range"
                      fill="var(--chart-4)"
                      fillOpacity={0.2}
                      stroke="var(--chart-4)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Fuel Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-base">
                  Fuel Efficiency Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={fuelConfig} className="h-[250px] sm:h-[280px] w-full">
                  <BarChart
                    data={fuelEfficiency}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" fontSize={11} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      fontSize={11}
                      width={55}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
                      {fuelEfficiency.map((_, index) => (
                        <Cell
                          key={index}
                          fill={chartBarColors[index % chartBarColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}