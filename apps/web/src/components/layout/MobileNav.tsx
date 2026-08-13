import { Link, NavLink } from "react-router"
import { Menu, Zap } from "lucide-react"

import { Button } from "#components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#components/ui/sheet"
import { useCurrentUser } from "#hooks/use-current-user"
import { cn } from "#lib/utils"
import { profilePath, signInPath } from "../../paths"

const baseLinks = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
  { to: "/cart", label: "Cart" },
]

export function MobileNav({ className }: { className?: string }) {
  const { isAuthenticated } = useCurrentUser()

  const navLinks = [
    ...baseLinks,
    isAuthenticated
      ? { to: profilePath(), label: "Account" }
      : { to: signInPath(), label: "Sign in" },
  ]

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open menu"
            className={className}
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="size-3.5" />
            </span>
            Vantage
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        {!isAuthenticated ? (
          <div className="mt-auto border-t p-4">
            <Button className="w-full" render={<Link to={signInPath()} />}>
              Sign in
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
