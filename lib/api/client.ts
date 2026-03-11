/**
 * Base API client for JetIntel backend
 * Handles authentication, error handling, and common fetch operations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = "APIError"
  }
}

/**
 * Get the auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("jetintel_token")
}

/**
 * Set the auth token in localStorage
 */
export function setAuthToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("jetintel_token", token)
}

/**
 * Remove the auth token from localStorage
 */
export function removeAuthToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem("jetintel_token")
}

/**
 * Base fetch wrapper with auth and error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  // Add Content-Type for JSON unless it's FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = `${API_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle non-OK responses
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { detail: response.statusText }
      }

      throw new APIError(
        errorData.detail || `Request failed with status ${response.status}`,
        response.status,
        errorData
      )
    }

    // Parse JSON response
    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      error instanceof Error ? error.message : "Network request failed",
      0
    )
  }
}

/**
 * Helper methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
}
