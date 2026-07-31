import { Outlet, ScrollRestoration } from "react-router"

import { AdminSidebar } from "#components/admin/AdminSidebar"
import { AdminTopBar } from "#components/admin/AdminTopBar"
import { Toaster } from "#components/ui/sonner"

export function AdminLayout() {
  return (
    <div className="flex min-h-dvh">
      <ScrollRestoration />
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}
