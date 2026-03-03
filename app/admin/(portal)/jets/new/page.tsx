import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { JetForm } from "@/components/admin/jet-form"

export default function AdminNewJetPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-serif text-2xl font-semibold">Create New Jet</h2>
        <p className="text-sm text-muted-foreground">Prepare a new aircraft entry for the fleet catalog.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Aircraft Details</CardTitle>
          <CardDescription>
            Complete the fields below to stage a new jet record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JetForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
