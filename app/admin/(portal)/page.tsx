"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Plane,
  Users,
  ArrowRight,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getAllJets } from "@/lib/api/jets";
import { getAdminUserCount } from "@/lib/api/auth";
import type { Jet } from "@/lib/types";

function MetricCard({
  label,
  value,
  icon: Icon,
  loading,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  loading?: boolean;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between pt-6 pb-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-16" />
          ) : (
            <p className="mt-1 font-serif text-2xl font-semibold">{value}</p>
          )}
          {sub && !loading && (
            <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [jets, setJets] = useState<Jet[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loadingJets, setLoadingJets] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    getAllJets()
      .then((data) => setJets(data))
      .catch((err) => console.error("Failed to load jets:", err))
      .finally(() => setLoadingJets(false));

    getAdminUserCount()
      .then((data) => setUserCount(data.count))
      .catch((err) => console.error("Failed to load user count:", err))
      .finally(() => setLoadingUsers(false));
  }, []);

  // Derived stats from jets
  const avgPrice =
    jets.length > 0
      ? (
          jets.reduce((s, j) => s + j.price_new_million, 0) / jets.length
        ).toFixed(1)
      : "—";

  const categories =
    jets.length > 0 ? [...new Set(jets.map((j) => j.category))].length : 0;

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <section className="rounded-xl border border-border/60 bg-gradient-to-r from-primary/8 via-secondary/40 to-transparent p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Control Center
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">
          Fleet Operations Overview
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Monitor aircraft data, manage users, and maintain admin operations
          from one workspace.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/jets/new">Add New Jet</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users">View Users</Link>
          </Button>
        </div>
      </section>

      {/* KPI Cards — only real data */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Jets"
          value={loadingJets ? "..." : jets.length.toString()}
          icon={Plane}
          loading={loadingJets}
          sub={loadingJets ? undefined : `${categories} categories`}
        />
        <MetricCard
          label="Registered Users"
          value={loadingUsers ? "..." : (userCount ?? 0).toString()}
          icon={Users}
          loading={loadingUsers}
        />
        <MetricCard
          label="Avg Fleet Price"
          value={loadingJets ? "..." : `$${avgPrice}M`}
          icon={DollarSign}
          loading={loadingJets}
        />
        <MetricCard
          label="Fleet Activity"
          value={loadingJets ? "..." : jets.length > 0 ? "Live" : "Empty"}
          icon={Activity}
          loading={loadingJets}
          sub="Data from MongoDB"
        />
      </section>

      {/* Quick Access + Fleet Summary */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Quick Access */}
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
                description:
                  "Review, filter, edit and delete aircraft entries.",
              },
              {
                href: "/admin/jets/new",
                title: "Add New Jet",
                description:
                  "Create a new aircraft record with Cloudinary image upload.",
              },
              {
                href: "/admin/users",
                title: "User Directory",
                description:
                  "View all registered users and their account details.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-lg border border-border/60 p-3 transition-all hover:border-primary/30 hover:bg-secondary/30"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Fleet Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">
              Fleet Breakdown
            </CardTitle>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent>
            {loadingJets ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-3"
                  >
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : jets.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">
                No jets in the database yet.
              </p>
            ) : (
              <div className="space-y-2">
                {(
                  Object.entries(
                    jets.reduce<Record<string, number>>((acc, jet) => {
                      acc[jet.category] = (acc[jet.category] || 0) + 1;
                      return acc;
                    }, {}),
                  ) as [string, number][]
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Plane className="size-3.5 text-primary" />
                        <p className="text-sm font-medium text-foreground">
                          {category}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {count}
                      </span>
                    </div>
                  ))}
                <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-3.5 text-primary" />
                    <p className="text-sm font-semibold text-foreground">
                      Total
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                    {jets.length}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
