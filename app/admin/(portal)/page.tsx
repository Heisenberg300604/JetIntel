import Link from "next/link"
import { Activity, Plane, Users, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getJets } from "@/lib/data/jets"
import { adminActivity, adminUsers } from "@/lib/data/admin-mock"

export default function AdminDashboardPage() {
  const jets = getJets()
  const registeredUsers = adminUsers.filter((user) => user.role === "user").length

  const metrics = [
    {
      label: "Total Jets",
      value: jets.length.toString(),
      icon: Plane,
    },
    {
      label: "Registered Users",
      value: registeredUsers.toString(),
      icon: Users,
    },
    {
      label: "Recent Changes",
      value: adminActivity.length.toString(),
      icon: Activity,
    },
    {
      label: "Security Status",
      value: "Protected",
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border/60 bg-linear-to-r from-primary/8 via-secondary/40 to-transparent p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Control Center</p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">
          Fleet Operations Overview
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Monitor aircraft data quality, manage users, and maintain admin operations from one workspace.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/jets/new">Add New Jet</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users">Manage Team</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{metric.label}</p>
                <p className="mt-1 font-serif text-2xl font-semibold">{metric.value}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <metric.icon className="size-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
            <Badge variant="outline">Live Feed</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminActivity.map((item) => (
              <div key={item.id} className="rounded-lg border border-border/60 bg-secondary/20 p-3">
                <p className="text-sm font-medium text-foreground">{item.action}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.actor} • {item.entity}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Quick Access</CardTitle>
            <Badge variant="secondary">Admin Tools</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                href: "/admin/jets",
                title: "Jet Inventory",
                description: "Review, filter, and edit all aircraft entries.",
              },
              {
                href: "/admin/users",
                title: "User Directory",
                description: "View all users and the single admin account.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-lg border border-border/60 p-3 transition-all hover:border-primary/30 hover:bg-secondary/30"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
