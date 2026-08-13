import { Link } from "react-router"
import { Package, LogOut } from "lucide-react"

import { useLogout } from "#components/auth/hooks/use-signout"
import { Avatar, AvatarFallback } from "#components/ui/avatar"
import { Button } from "#components/ui/button"
import { Card, CardContent } from "#components/ui/card"
import { useCurrentUser } from "#hooks/use-current-user"

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ProfilePage() {
  const { user } = useCurrentUser()
  const { logout, isLoggingOut } = useLogout()

  const name = user?.name ?? "Account"
  const email = user?.email ?? ""
  const initials = initialsFromName(name)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile and preferences.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            {email ? (
              <p className="text-sm text-muted-foreground">{email}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          className="h-auto justify-start gap-3 px-4 py-4"
          render={<Link to="/profile/orders" />}
        >
          <Package className="size-5 shrink-0" />
          <div className="text-left">
            <p className="font-medium">Order history</p>
            <p className="text-xs text-muted-foreground">
              View past purchases and track shipments
            </p>
          </div>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-auto justify-start gap-3 px-4 py-4 text-destructive hover:text-destructive"
          disabled={isLoggingOut}
          onClick={() => logout()}
        >
          <LogOut className="size-5 shrink-0" />
          <div className="text-left">
            <p className="font-medium">
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </p>
            <p className="text-xs text-muted-foreground">
              Sign out of your account
            </p>
          </div>
        </Button>
      </div>
    </div>
  )
}
