import { Link, Outlet, ScrollRestoration } from "react-router"

import { homePath } from "../paths"

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-muted/30">
      <ScrollRestoration />
      <header className="px-4 py-4 sm:px-6">
        <Link
          to={homePath()}
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Vantage
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
