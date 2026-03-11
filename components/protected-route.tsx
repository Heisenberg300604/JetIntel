"use client"

import { useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "user" | "admin" | "both"
}

export function ProtectedRoute({
  children,
  requiredRole = "both",
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // Check role requirements
    if (requiredRole === "admin" && !isAdmin) {
      router.push("/")
      return
    }
  }, [isAuthenticated, isAdmin, isLoading, router, pathname, requiredRole])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole === "admin" && !isAdmin) {
    return null
  }

  return <>{children}</>
}
