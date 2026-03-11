"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JetForm } from "@/components/admin/jet-form"
import { getJetById } from "@/lib/api/jets"
import type { Jet } from "@/lib/types"

export default function AdminEditJetPage() {
  const params = useParams()
  const id = params.id as string
  const [jet, setJet] = useState<Jet | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    loadJet()
  }, [id])

  const loadJet = async () => {
    try {
      const data = await getJetById(id)
      setJet(data)
    } catch (error: any) {
      if (error.status === 404) {
        setNotFoundError(true)
      }
      console.error("Failed to load jet:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notFoundError || !jet) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-serif text-2xl font-semibold">Edit Jet</h2>
        <p className="text-sm text-muted-foreground">
          Update technical and financial details for {jet.manufacturer} {jet.model}.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">{jet.manufacturer} {jet.model}</CardTitle>
          <CardDescription>Slug ID: {jet.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <JetForm mode="edit" initialJet={jet} />
        </CardContent>
      </Card>
    </div>
  )
}
