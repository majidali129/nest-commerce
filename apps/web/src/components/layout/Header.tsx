import { Link, NavLink } from "react-router"
import { Search, ShoppingBag, User, Zap } from "lucide-react"

import { Badge } from "#components/ui/badge"
import { Button } from "#components/ui/button"
import { MobileNav } from "#components/layout/MobileNav"
import { useCart } from "#components/cart/hooks/use-cart"
import { useCurrentUser } from "#hooks/use-current-user"
import { cn } from "#lib/utils"
import { cartPath, profilePath, signInPath } from "../../paths"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
]

export function Header() {
  const { isAuthenticated } = useCurrentUser()
  const { cart } = useCart()
  const cartCount = isAuthenticated ? (cart?.itemCount ?? 0) : 0

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-9xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileNav className="lg:hidden" />
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-3.5" />
          </span>
          Vantage
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
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
        <div className="ml-auto flex items-center gap-0.5 sm:gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search products"
            render={<Link to="/products" />}
          >
            <Search className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="relative"
            render={<Link to={cartPath()} />}
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 ? (
              <Badge className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full p-0 text-[9px]">
                {cartCount > 99 ? "99+" : cartCount}
              </Badge>
            ) : null}
          </Button>

          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Account"
              render={<Link to={profilePath()} />}
            >
              <User className="size-5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              render={<Link to={signInPath()} />}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
