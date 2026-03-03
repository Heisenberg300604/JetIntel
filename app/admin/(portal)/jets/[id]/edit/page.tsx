import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JetForm } from "@/components/admin/jet-form"
import { getJetById, getJets } from "@/lib/data/jets"

export function generateStaticParams() {
  return getJets().map((jet) => ({ id: jet.id }))
}

export default async function AdminEditJetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const jet = getJetById(id)

  if (!jet) {
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
