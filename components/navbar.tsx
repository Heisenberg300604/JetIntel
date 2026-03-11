"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plane, LogOut, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/lib/contexts/auth";

const baseNavLinks = [
  { href: "/", label: "Fleet" },
  { href: "/ai", label: "AI Evaluator" },
  { href: "/search", label: "Search" },
  { href: "/stats", label: "Stats" },
  { href: "/calculator", label: "Calculator" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Build nav links based on auth state
  const navLinks = [
    ...baseNavLinks,
    ...(isAdmin ? [{ href: "/admin", label: "Dashboard" }] : []),
    ...(!isAuthenticated ? [{ href: "/auth/login", label: "Login" }] : []),
  ];

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md animate-slide-down">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plane className="size-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            JetIntel
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:-translate-y-px active:translate-y-0",
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary animate-scale-in" />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Authenticated User Menu (Desktop) */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  aria-label="User menu"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                    <User className="size-3.5 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="font-medium">
                    {user?.name || user?.email}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                  <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium capitalize text-primary">
                    {user?.role}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-serif">
                  <Plane className="size-4 text-primary" />
                  JetIntel
                </SheetTitle>
              </SheetHeader>

              {/* User info in mobile menu */}
              {isAuthenticated && (
                <div className="mx-2 mb-2 mt-4 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium capitalize text-primary">
                    {user?.role}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1 px-2 mt-2">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1",
                      pathname === link.href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                    )}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Sign out in mobile menu */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10 hover:translate-x-1 text-left"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
