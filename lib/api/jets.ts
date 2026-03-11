import { api } from "./client"
import type { Jet } from "@/lib/types"

export interface JetCreateRequest extends Omit<Jet, "id"> {
  id: string
}

export interface JetUpdateRequest extends Partial<Omit<Jet, "id">> {}

export interface ImageUploadResponse {
  message: string
  url: string
  public_id: string
}

export interface BulkUploadResponse {
  message: string
  summary: {
    total_provided: number
    created: number
    skipped: number
    errors: number
  }
  created_jets: Jet[]
  skipped_jets: Array<{ id: string; reason: string }>
  errors: Array<{ id: string; error: string }>
}

/**
 * Get all jets (public endpoint)
 */
export async function getAllJets(): Promise<Jet[]> {
  return api.get<Jet[]>("/jets")
}

/**
 * Get a single jet by ID (public endpoint)
 */
export async function getJetById(jetId: string): Promise<Jet> {
  return api.get<Jet>(`/jets/${jetId}`)
}

/**
 * Create a new jet (admin only)
 */
export async function createJet(jetData: JetCreateRequest): Promise<{ message: string; jet: Jet }> {
  return api.post<{ message: string; jet: Jet }>("/admin/jets", jetData)
}

/**
 * Update an existing jet (admin only)
 */
export async function updateJet(
  jetId: string,
  jetData: JetUpdateRequest
): Promise<{ message: string; jet: Jet }> {
  return api.put<{ message: string; jet: Jet }>(`/admin/jets/${jetId}`, jetData)
}

/**
 * Delete a jet (admin only)
 */
export async function deleteJet(jetId: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/admin/jets/${jetId}`)
}

/**
 * Upload a jet image to Cloudinary (admin only)
 */
export async function uploadJetImage(file: File): Promise<ImageUploadResponse> {
  const formData = new FormData()
  formData.append("file", file)

  return api.post<ImageUploadResponse>("/admin/jets/upload-image", formData)
}

/**
 * Bulk upload multiple jets (admin only)
 */
export async function bulkUploadJets(jets: JetCreateRequest[]): Promise<BulkUploadResponse> {
  return api.post<BulkUploadResponse>("/admin/jets/bulk-upload", jets)
}
