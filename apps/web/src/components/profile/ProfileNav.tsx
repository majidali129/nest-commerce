import { NavLink } from "react-router"

import { cn } from "#lib/utils"

const navItems = [
  { to: "/profile", label: "Overview", end: true },
  { to: "/profile/orders", label: "Orders", end: false },
  { to: "#", label: "Addresses", end: false, disabled: true },
  { to: "#", label: "Payment Methods", end: false, disabled: true },
]

export function ProfileNav() {
  return (
    <>
      <nav className="hidden w-52 shrink-0 flex-col gap-1 lg:flex">
        {navItems.map((item) =>
          item.disabled ? (
            <span
              key={item.label}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground/60"
            >
              {item.label}
              <span className="ml-1 text-xs">(Coming soon)</span>
            </span>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          )
        )}
      </nav>
      <nav className="flex gap-1 overflow-x-auto pb-2 lg:hidden">
        {navItems
          .filter((item) => !item.disabled)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </>
  )
}
