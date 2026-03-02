"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  if (!mounted) {
    return (
      <div className="flex h-8 w-16 items-center rounded-full bg-secondary p-1">
        <div className="flex size-6 items-center justify-center rounded-full bg-card shadow-sm">
          <Sun className="size-3.5 text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-8 w-16 cursor-pointer items-center rounded-full bg-secondary p-1 transition-colors duration-300 hover:bg-secondary/80"
    >
      {/* Sun icon - left side */}
      <Sun
        className={`absolute left-2 size-3.5 transition-all duration-300 ${
          isDark
            ? "text-muted-foreground/40 scale-75"
            : "text-accent scale-100"
        }`}
      />

      {/* Moon icon - right side */}
      <Moon
        className={`absolute right-2 size-3.5 transition-all duration-300 ${
          isDark
            ? "text-primary scale-100"
            : "text-muted-foreground/40 scale-75"
        }`}
      />

      {/* Sliding knob */}
      <div
        className={`flex size-6 items-center justify-center rounded-full bg-card shadow-md ring-1 ring-border/50 transition-all duration-300 ease-out ${
          isDark ? "translate-x-8" : "translate-x-0"
        } group-hover:shadow-lg group-active:scale-90`}
      >
        {isDark ? (
          <Moon className="size-3 text-primary transition-all duration-300" />
        ) : (
          <Sun className="size-3 text-accent transition-all duration-300" />
        )}
      </div>
    </button>
  )
}
