"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { adminNavItems } from "@/components/admin/admin-nav"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r border-border/50 bg-card/50 lg:flex lg:min-h-screen lg:w-64 lg:flex-col lg:justify-between lg:p-4">
      <div>
        <Link href="/admin" className="mb-6 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary/60">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <Plane className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-serif text-base font-semibold">JetIntel</p>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/70 px-3 py-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link href="/auth/login">
            <LogOut className="mr-1 size-4" />
            Sign out
          </Link>
        </Button>
      </div>
    </aside>
  )
}
