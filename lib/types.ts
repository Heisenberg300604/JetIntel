export type JetCategory =
  | "Light"
  | "Midsize"
  | "Super Midsize"
  | "Heavy"
  | "Ultra Long Range"

export interface Jet {
  id: string
  manufacturer: string
  model: string
  category: JetCategory
  range_nm: number
  cruise_knots: number
  cruise_mach: number
  max_passengers: number
  price_new_million: number
  price_used_million: number
  fuel_efficiency_lph: number
  cost_per_hour: number
  annual_cost_total: number
  annual_cost_fuel: number
  annual_cost_maintenance: number
  annual_cost_crew: number
  runway_required_ft: number
  year_introduced: number
  description: string
  tags: string[]
}

export interface Airport {
  iata: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
}

export interface AIRecommendation {
  jet: Jet
  matchScore: number
  summary: string
  keyReasons: string[]
}

export interface AIResponse {
  primary: AIRecommendation
  alternatives: AIRecommendation[]
  missionSummary: string
}
