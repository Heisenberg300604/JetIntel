"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getAuthToken, removeAuthToken } from "../api/client"
import { getCurrentUser } from "../api/auth"

export interface User {
  id?: string
  email: string
  name?: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from token on mount
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      const currentUser = getCurrentUser()
      if (currentUser) {
        setUser(currentUser as User)
      }
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    removeAuthToken()
    setUser(null)
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
