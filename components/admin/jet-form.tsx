import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { JetCategory, Jet } from "@/lib/types"

const categories: JetCategory[] = [
  "Light",
  "Midsize",
  "Super Midsize",
  "Heavy",
  "Ultra Long Range",
]

interface JetFormProps {
  mode: "create" | "edit"
  initialJet?: Jet
}

export function JetForm({ mode, initialJet }: JetFormProps) {
  const submitLabel = mode === "create" ? "Create Jet" : "Save Changes"

  return (
    <form className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="id">Jet Slug ID</Label>
          <Input id="id" placeholder="gulfstream-g700" defaultValue={initialJet?.id} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select defaultValue={initialJet?.category}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input id="manufacturer" placeholder="Gulfstream" defaultValue={initialJet?.manufacturer} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" placeholder="G700" defaultValue={initialJet?.model} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="range_nm">Range (NM)</Label>
          <Input id="range_nm" type="number" defaultValue={initialJet?.range_nm} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cruise_knots">Cruise Speed (kts)</Label>
          <Input id="cruise_knots" type="number" defaultValue={initialJet?.cruise_knots} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cruise_mach">Cruise Mach</Label>
          <Input id="cruise_mach" type="number" step="0.01" defaultValue={initialJet?.cruise_mach} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="max_passengers">Max Passengers</Label>
          <Input id="max_passengers" type="number" defaultValue={initialJet?.max_passengers} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="runway_required_ft">Runway Required (ft)</Label>
          <Input id="runway_required_ft" type="number" defaultValue={initialJet?.runway_required_ft} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year_introduced">Year Introduced</Label>
          <Input id="year_introduced" type="number" defaultValue={initialJet?.year_introduced} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price_new_million">New Price ($M)</Label>
          <Input id="price_new_million" type="number" step="0.1" defaultValue={initialJet?.price_new_million} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_used_million">Used Price ($M)</Label>
          <Input id="price_used_million" type="number" step="0.1" defaultValue={initialJet?.price_used_million} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost_per_hour">Operating Cost / Hour ($)</Label>
          <Input id="cost_per_hour" type="number" defaultValue={initialJet?.cost_per_hour} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fuel_efficiency_lph">Fuel Burn (L/hr)</Label>
          <Input id="fuel_efficiency_lph" type="number" defaultValue={initialJet?.fuel_efficiency_lph} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual_cost_total">Annual Cost Total ($)</Label>
          <Input id="annual_cost_total" type="number" defaultValue={initialJet?.annual_cost_total} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="annual_cost_fuel">Annual Fuel Cost ($)</Label>
          <Input id="annual_cost_fuel" type="number" defaultValue={initialJet?.annual_cost_fuel} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual_cost_maintenance">Annual Maintenance Cost ($)</Label>
          <Input id="annual_cost_maintenance" type="number" defaultValue={initialJet?.annual_cost_maintenance} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual_cost_crew">Annual Crew Cost ($)</Label>
          <Input id="annual_cost_crew" type="number" defaultValue={initialJet?.annual_cost_crew} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          className="min-h-24"
          placeholder="Brief premium description of the aircraft"
          defaultValue={initialJet?.description}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="Ultra Long Range, Flagship, Corporate"
          defaultValue={initialJet?.tags.join(", ")}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          UI-only form for now. API integration can be connected next.
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="button">{submitLabel}</Button>
        </div>
      </div>
    </form>
  )
}
