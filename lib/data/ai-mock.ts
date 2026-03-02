import type { AIResponse, Jet } from "@/lib/types"
import { jets } from "@/lib/data/jets"

/**
 * Parse keywords from a mission prompt and return mock AI recommendations.
 * Simulates a ~1.5s delay to mimic real AI latency.
 */
export async function getMockRecommendation(
  prompt: string
): Promise<AIResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const lower = prompt.toLowerCase()

  // Parse intent
  const passengers = extractNumber(lower, /(\d+)\s*(?:pax|passengers|people|seats)/i) ?? 8
  const range = extractNumber(lower, /(\d{3,5})\s*(?:nm|nautical|naut)/i) ?? 3000
  const budget = extractNumber(lower, /(?:under|\$|budget|max)\s*\$?(\d+)\s*(?:m|million)/i) ?? 50

  const wantsSpeed = /fast|speed|quick|time.?critical|urgent/i.test(lower)
  const wantsEfficiency = /efficien|fuel|low.?cost|economical|cheap/i.test(lower)
  const wantsLuxury = /luxury|comfort|spacious|premium|vip/i.test(lower)
  const wantsShortRunway = /short.?runway|unpaved|remote|small.?airport/i.test(lower)
  const wantsTransatlantic = /transatlantic|atlantic|europe|london|paris/i.test(lower)
  const wantsTranspac = /transpacific|pacific|asia|tokyo|hong.?kong|singapore/i.test(lower)

  // Score each jet
  const scored = jets
    .map((jet) => {
      let score = 50

      // Range match
      if (jet.range_nm >= range) score += 15
      if (jet.range_nm >= range * 1.2) score += 5
      if (jet.range_nm < range) score -= 30

      // Passenger match
      if (jet.max_passengers >= passengers) score += 10
      if (jet.max_passengers < passengers) score -= 25

      // Budget match
      if (jet.price_new_million <= budget) score += 15
      if (jet.price_new_million <= budget * 0.7) score += 5
      if (jet.price_new_million > budget) score -= 20

      // Preferences
      if (wantsSpeed && jet.cruise_mach >= 0.85) score += 10
      if (wantsEfficiency && jet.fuel_efficiency_lph < 250) score += 10
      if (wantsLuxury && (jet.category === "Heavy" || jet.category === "Ultra Long Range")) score += 10
      if (wantsShortRunway && jet.runway_required_ft < 4000) score += 10
      if (wantsTransatlantic && jet.range_nm >= 3500) score += 10
      if (wantsTranspac && jet.range_nm >= 6000) score += 10

      return { jet, score: Math.max(0, Math.min(100, score)) }
    })
    .sort((a, b) => b.score - a.score)

  const primary = scored[0]
  const alt1 = scored[1]
  const alt2 = scored[2]

  return {
    primary: {
      jet: primary.jet,
      matchScore: primary.score,
      summary: generateSummary(primary.jet, { passengers, range, budget, wantsSpeed, wantsLuxury }),
      keyReasons: generateReasons(primary.jet, { passengers, range, budget }),
    },
    alternatives: [
      {
        jet: alt1.jet,
        matchScore: alt1.score,
        summary: `Strong alternative with ${alt1.jet.range_nm} NM range and capacity for ${alt1.jet.max_passengers} passengers.`,
        keyReasons: generateReasons(alt1.jet, { passengers, range, budget }),
      },
      {
        jet: alt2.jet,
        matchScore: alt2.score,
        summary: `Budget-conscious option offering ${alt2.jet.range_nm} NM range at $${alt2.jet.price_new_million}M.`,
        keyReasons: generateReasons(alt2.jet, { passengers, range, budget }),
      },
    ],
    missionSummary: `Analyzed ${jets.length} aircraft for a ${passengers}-passenger mission of ${range} NM with a $${budget}M budget ceiling. The ${primary.jet.manufacturer} ${primary.jet.model} emerged as the optimal match.`,
  }
}

function extractNumber(text: string, regex: RegExp): number | null {
  const match = text.match(regex)
  return match ? parseInt(match[1], 10) : null
}

function generateSummary(
  jet: Jet,
  prefs: { passengers: number; range: number; budget: number; wantsSpeed: boolean; wantsLuxury: boolean }
): string {
  const parts: string[] = []
  parts.push(
    `The ${jet.manufacturer} ${jet.model} is the optimal aircraft for this mission.`
  )
  if (jet.range_nm >= prefs.range) {
    parts.push(
      `With a ${jet.range_nm} NM range, it comfortably exceeds the ${prefs.range} NM requirement.`
    )
  }
  if (jet.max_passengers >= prefs.passengers) {
    parts.push(
      `It accommodates up to ${jet.max_passengers} passengers in a ${jet.category.toLowerCase()} cabin configuration.`
    )
  }
  if (prefs.wantsSpeed) {
    parts.push(
      `Cruising at Mach ${jet.cruise_mach}, it prioritizes speed as requested.`
    )
  }
  if (prefs.wantsLuxury) {
    parts.push(
      `Its spacious cabin and premium amenities deliver the luxury experience specified.`
    )
  }
  return parts.join(" ")
}

function generateReasons(
  jet: Jet,
  prefs: { passengers: number; range: number; budget: number }
): string[] {
  const reasons: string[] = []
  if (jet.range_nm >= prefs.range) {
    reasons.push(`Range of ${jet.range_nm.toLocaleString()} NM exceeds requirement`)
  }
  if (jet.max_passengers >= prefs.passengers) {
    reasons.push(`Seats ${jet.max_passengers} passengers`)
  }
  if (jet.price_new_million <= prefs.budget) {
    reasons.push(`$${jet.price_new_million}M new price within budget`)
  }
  reasons.push(`Cruise speed: Mach ${jet.cruise_mach}`)
  reasons.push(`$${jet.cost_per_hour.toLocaleString()}/hr operating cost`)
  return reasons.slice(0, 5)
}
