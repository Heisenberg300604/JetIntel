import { api, setAuthToken, removeAuthToken } from "./client";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", credentials);

  // Store the token
  setAuthToken(response.access_token);

  return response;
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);

  // Store the token
  setAuthToken(response.access_token);

  return response;
}

/**
 * Get current user info from server
 */
export async function getCurrentUserFromServer(): Promise<User> {
  return api.get<User>("/auth/me");
}

/**
 * Logout and clear token
 */
export function logout() {
  removeAuthToken();
  // Optionally redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("jetintel_token");
  return !!token;
}

/**
 * Get all registered users (admin only)
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  return api.get<AdminUser[]>("/admin/users");
}

/**
 * Get total user count (admin only)
 */
export async function getAdminUserCount(): Promise<{ count: number }> {
  return api.get<{ count: number }>("/admin/users/count");
}

/**
 * Get current user from token (basic JWT decode)
 * For production, validate token with backend
 */
export function getCurrentUser(): { email: string; role: string } | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("jetintel_token");
  if (!token) return null;

  try {
    // Basic JWT decode (payload is the middle part)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      email: payload.sub || payload.email,
      role: payload.role || "user",
    };
  } catch {
    return null;
  }
}
