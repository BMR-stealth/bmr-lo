"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Loan Officer Portal</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
          )}
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <button
                onClick={() => logout()}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
