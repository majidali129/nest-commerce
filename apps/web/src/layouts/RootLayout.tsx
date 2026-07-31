import { Outlet, ScrollRestoration } from "react-router"

import { Footer } from "#components/layout/Footer"
import { Header } from "#components/layout/Header"
import { Toaster } from "#components/ui/sonner"

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollRestoration />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
