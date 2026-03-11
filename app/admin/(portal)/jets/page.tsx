"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { getAllJets, deleteJet } from "@/lib/api/jets"
import type { Jet } from "@/lib/types"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminJetsPage() {
  const [jets, setJets] = useState<Jet[]>([])
  const [filteredJets, setFilteredJets] = useState<Jet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadJets()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = jets.filter(jet =>
        jet.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jet.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jet.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredJets(filtered)
    } else {
      setFilteredJets(jets)
    }
  }, [searchQuery, jets])

  const loadJets = async () => {
    try {
      const data = await getAllJets()
      setJets(data)
      setFilteredJets(data)
    } catch (error) {
      console.error("Failed to load jets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      await deleteJet(deleteId)
      await loadJets()
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete jet:", error)
      alert("Failed to delete jet")
    } finally {
      setDeleting(false)
    }
  }

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
            <Input
              placeholder="Search jets..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
                {filteredJets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No jets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJets.map((jet) => (
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
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${jet.model}`}
                            onClick={() => setDeleteId(jet.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Jet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this jet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
