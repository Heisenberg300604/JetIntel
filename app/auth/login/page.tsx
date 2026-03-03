import Link from "next/link"
import { Plane, ShieldCheck, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <Card className="relative w-full max-w-md animate-slide-up">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="size-5 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="font-serif text-2xl">Sign In</CardTitle>
            <CardDescription className="mt-1">
              Single login for both user and admin accounts.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@jetintel.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button asChild>
              <Link href="/">Login as User</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Login as Admin</Link>
            </Button>
          </div>

          <div className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
            UI-only flow right now. API endpoints to connect next: POST /auth/login.
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <UserRound className="size-3.5" />
              <span>New here?</span>
            </div>
            <Link href="/auth/signup" className="text-primary hover:underline">
              Create account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Plane className="size-3.5" />
            <span>JetIntel Authentication Portal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
