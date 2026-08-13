import { Link, NavLink } from "react-router"
import { Home, Zap } from "lucide-react"

import { adminNavItems } from "#components/admin/admin-nav"
import { cn } from "#lib/utils"

export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {adminNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )
          }
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </>
  )
}

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <Link
        to="/admin/products"
        className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4"
      >
        <span className="flex size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Zap className="size-4" />
        </span>
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
          Vantage Admin
        </span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <AdminNavLinks />
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <Home className="size-4 shrink-0" />
          Back to storefront
        </Link>
      </div>
    </aside>
  )
}
