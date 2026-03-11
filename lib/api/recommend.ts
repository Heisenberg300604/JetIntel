import { api } from "./client"

export interface RecommendRequest {
  departure: string
  arrival: string
  passengers: number
  budget: number
}

export interface JetRecommendation {
  jet: string
  manufacturer: string
  flight_time_hours: number
  distance_nm: number
  estimated_cost: number
  image_url: string
}

/**
 * Get jet recommendation based on route, passengers, and budget
 * @param departure - Departure airport IATA code (e.g., "NYC")
 * @param arrival - Arrival airport IATA code (e.g., "LAX")
 * @param passengers - Number of passengers
 * @param budget - Budget in millions (e.g., 50 = $50M)
 */
export async function getJetRecommendation(
  params: RecommendRequest
): Promise<JetRecommendation> {
  const queryString = new URLSearchParams({
    departure: params.departure,
    arrival: params.arrival,
    passengers: params.passengers.toString(),
    budget: params.budget.toString(),
  }).toString()

  return api.get<JetRecommendation>(`/recommend?${queryString}`)
}
