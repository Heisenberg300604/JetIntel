import Link from "next/link"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { getJets } from "@/lib/data/jets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminJetsPage() {
  const jets = getJets()

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Jet Inventory</h2>
          <p className="text-sm text-muted-foreground">Manage aircraft records and operational details.</p>
        </div>
        <Button asChild>
          <Link href="/admin/jets/new">
            <Plus className="size-4" />
            Add Jet
          </Link>
        </Button>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-serif text-lg">All Aircraft</CardTitle>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search jets..." className="pl-9" />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aircraft</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>New Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jets.map((jet) => (
                <TableRow key={jet.id}>
                  <TableCell>
                    <p className="font-medium">{jet.manufacturer} {jet.model}</p>
                    <p className="text-xs text-muted-foreground">{jet.id}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{jet.category}</Badge>
                  </TableCell>
                  <TableCell>{jet.range_nm.toLocaleString()} NM</TableCell>
                  <TableCell>{jet.max_passengers}</TableCell>
                  <TableCell>${jet.price_new_million}M</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/admin/jets/${jet.id}/edit`} aria-label={`Edit ${jet.model}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label={`Delete ${jet.model}`}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
