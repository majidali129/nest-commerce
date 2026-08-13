import { useState } from "react"
import { LogOut, Menu, Search, Zap } from "lucide-react"

import { Avatar, AvatarFallback } from "#components/ui/avatar"
import { Button } from "#components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu"
import { Input } from "#components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#components/ui/sheet"
import { AdminNavLinks } from "#components/admin/AdminSidebar"
import { useLogout } from "#components/auth/hooks/use-signout"
import { useCurrentUser } from "#hooks/use-current-user"

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function AdminTopBar() {
  const [open, setOpen] = useState(false)
  const { user } = useCurrentUser()
  const { logout, isLoggingOut } = useLogout()

  const displayName = user?.name ?? "Admin"
  const initials = initialsFromName(displayName)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open admin menu"
              className="lg:hidden"
            />
          }
        >
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 gap-0 bg-sidebar">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
              <span className="flex size-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Zap className="size-3.5" />
              </span>
              Vantage Admin
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4">
            <AdminNavLinks onNavigate={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search…"
          aria-label="Search admin"
          className="pl-8"
        />
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="gap-2 px-2"
                aria-label="Admin account menu"
              />
            }
          >
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:block">
              {displayName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <p className="font-medium">{displayName}</p>
                {user?.email ? (
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                ) : null}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoggingOut}
              className="text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
