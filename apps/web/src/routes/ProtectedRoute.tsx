import { Navigate, Outlet, useLocation } from "react-router"
import { UserRole, type UserRole as UserRoleType } from "@repo/contracts"

import { useCurrentUser } from "#hooks/use-current-user"
import { Skeleton } from "#components/ui/skeleton"
import { adminPath, homePath, signInPath } from "../paths"

type ProtectedRouteProps = {
  roles?: UserRoleType[]
  guestOnly?: boolean
}

function homeForRole(role: UserRoleType | null | undefined) {
  return role === UserRole.ADMIN ? adminPath() : homePath()
}

export function ProtectedRoute({
  roles,
  guestOnly = false,
}: ProtectedRouteProps) {
  const location = useLocation()
  const { user, isAuthenticated, isLoadingUser, role } = useCurrentUser()

  if (isLoadingUser) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (guestOnly) {
    if (isAuthenticated) {
      return <Navigate to={homeForRole(role)} replace />
    }
    return <Outlet />
  }

  if (!isAuthenticated || !user) {
    const next = `${location.pathname}${location.search}`
    return (
      <Navigate
        to={`${signInPath()}?next=${encodeURIComponent(next)}`}
        replace
        state={{ from: location }}
      />
    )
  }

  if (roles?.length && (!role || !roles.includes(role))) {
    return <Navigate to={homeForRole(role)} replace />
  }

  return <Outlet />
}
