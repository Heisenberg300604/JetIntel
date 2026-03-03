"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Plus, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { adminNavItems, getAdminPageTitle } from "@/components/admin/admin-nav"
import { cn } from "@/lib/utils"

export function AdminTopbar() {
  const pathname = usePathname()
  const pageTitle = getAdminPageTitle(pathname)

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-serif">
                  <ShieldCheck className="size-4 text-primary" />
                  Admin Navigation
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 space-y-1">
                {adminNavItems.map((item) => {
                  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
            </SheetContent>
          </Sheet>

          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Admin</p>
            <h1 className="font-serif text-base font-semibold leading-tight text-foreground sm:text-lg">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/admin/jets/new">
              <Plus className="size-4" />
              New Jet
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
