"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle2, XCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { JetCategory, Jet } from "@/lib/types"
import { createJet, updateJet, uploadJetImage } from "@/lib/api/jets"

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
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialJet?.image_url || "")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [category, setCategory] = useState(initialJet?.category || "")

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const response = await uploadJetImage(file)
      setImageUrl(response.url)
      setSuccess("Image uploaded successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)

    try {
      const jetData = {
        id: formData.get("id") as string,
        manufacturer: formData.get("manufacturer") as string,
        model: formData.get("model") as string,
        category: category as JetCategory,
        range_nm: parseInt(formData.get("range_nm") as string),
        cruise_knots: parseInt(formData.get("cruise_knots") as string),
        cruise_mach: parseFloat(formData.get("cruise_mach") as string),
        max_passengers: parseInt(formData.get("max_passengers") as string),
        price_new_million: parseFloat(formData.get("price_new_million") as string),
        price_used_million: parseFloat(formData.get("price_used_million") as string),
        fuel_efficiency_lph: parseInt(formData.get("fuel_efficiency_lph") as string),
        cost_per_hour: parseInt(formData.get("cost_per_hour") as string),
        annual_cost_total: parseInt(formData.get("annual_cost_total") as string),
        annual_cost_fuel: parseInt(formData.get("annual_cost_fuel") as string),
        annual_cost_maintenance: parseInt(formData.get("annual_cost_maintenance") as string),
        annual_cost_crew: parseInt(formData.get("annual_cost_crew") as string),
        runway_required_ft: parseInt(formData.get("runway_required_ft") as string),
        year_introduced: parseInt(formData.get("year_introduced") as string),
        description: formData.get("description") as string,
        tags: (formData.get("tags") as string).split(",").map(t => t.trim()),
        image_url: imageUrl || "https://via.placeholder.com/800x600?text=Jet",
      }

      if (mode === "create") {
        await createJet(jetData)
        setSuccess("Jet created successfully!")
        setTimeout(() => {
          router.push("/admin/jets")
          router.refresh()
        }, 1000)
      } else if (initialJet) {
        const { id, ...updateData } = jetData
        await updateJet(initialJet.id, updateData)
        setSuccess("Jet updated successfully!")
        setTimeout(() => {
          router.push("/admin/jets")
          router.refresh()
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to save jet")
    } finally {
      setLoading(false)
    }
  }

  const submitLabel = mode === "create" ? "Create Jet" : "Save Changes"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="id">Jet Slug ID</Label>
          <Input
            id="id"
            name="id"
            placeholder="gulfstream-g700"
            defaultValue={initialJet?.id}
            required
            disabled={mode === "edit"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            name="manufacturer"
            placeholder="Gulfstream"
            defaultValue={initialJet?.manufacturer}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            placeholder="G700"
            defaultValue={initialJet?.model}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="range_nm">Range (NM)</Label>
          <Input
            id="range_nm"
            name="range_nm"
            type="number"
            defaultValue={initialJet?.range_nm}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cruise_knots">Cruise Speed (kts)</Label>
          <Input
            id="cruise_knots"
            name="cruise_knots"
            type="number"
            defaultValue={initialJet?.cruise_knots}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cruise_mach">Cruise Mach</Label>
          <Input
            id="cruise_mach"
            name="cruise_mach"
            type="number"
            step="0.01"
            defaultValue={initialJet?.cruise_mach}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="max_passengers">Max Passengers</Label>
          <Input
            id="max_passengers"
            name="max_passengers"
            type="number"
            defaultValue={initialJet?.max_passengers}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="runway_required_ft">Runway Required (ft)</Label>
          <Input
            id="runway_required_ft"
            name="runway_required_ft"
            type="number"
            defaultValue={initialJet?.runway_required_ft}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year_introduced">Year Introduced</Label>
          <Input
            id="year_introduced"
            name="year_introduced"
            type="number"
            defaultValue={initialJet?.year_introduced}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price_new_million">New Price ($M)</Label>
          <Input
            id="price_new_million"
            name="price_new_million"
            type="number"
            step="0.1"
            defaultValue={initialJet?.price_new_million}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_used_million">Used Price ($M)</Label>
          <Input
            id="price_used_million"
            name="price_used_million"
            type="number"
            step="0.1"
            defaultValue={initialJet?.price_used_million}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost_per_hour">Operating Cost / Hour ($)</Label>
          <Input
            id="cost_per_hour"
            name="cost_per_hour"
            type="number"
            defaultValue={initialJet?.cost_per_hour}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fuel_efficiency_lph">Fuel Burn (L/hr)</Label>
          <Input
            id="fuel_efficiency_lph"
            name="fuel_efficiency_lph"
            type="number"
            defaultValue={initialJet?.fuel_efficiency_lph}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual_cost_total">Annual Cost Total ($)</Label>
          <Input
            id="annual_cost_total"
            name="annual_cost_total"
            type="number"
            defaultValue={initialJet?.annual_cost_total}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="annual_cost_fuel">Annual Fuel Cost ($)</Label>
          <Input
            id="annual_cost_fuel"
            name="annual_cost_fuel"
            type="number"
            defaultValue={initialJet?.annual_cost_fuel}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual_cost_maintenance">Annual Maintenance Cost ($)</Label>
          <Input
            id="annual_cost_maintenance"
            name="annual_cost_maintenance"
            type="number"
            defaultValue={initialJet?.annual_cost_maintenance}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual_cost_crew">Annual Crew Cost ($)</Label>
          <Input
            id="annual_cost_crew"
            name="annual_cost_crew"
            type="number"
            defaultValue={initialJet?.annual_cost_crew}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          className="min-h-24"
          placeholder="Brief premium description of the aircraft"
          defaultValue={initialJet?.description}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jet-image">Jet Image</Label>
        <div className="flex items-center gap-3">
          <Input
            id="jet-image"
            type="file"
            accept="image/*"
            className="cursor-pointer"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {imageUrl && !uploading && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        </div>
        {imageUrl && (
          <p className="text-xs text-muted-foreground">
            Image URL: <span className="text-primary">{imageUrl}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Upload a high-quality image of the jet. Supported formats: JPG, PNG, WebP
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="Ultra Long Range, Flagship, Corporate"
          defaultValue={initialJet?.tags.join(", ")}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
