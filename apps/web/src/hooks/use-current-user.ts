import { useQuery } from "@tanstack/react-query"
import type { UserReturnType } from "@repo/contracts"

import { queryKeys } from "../query-keys"

function readStoredUser(): UserReturnType | null {
  if (!localStorage.getItem("accessToken")) return null
  try {
    const raw = localStorage.getItem("user")
    if (!raw) return null
    return JSON.parse(raw) as UserReturnType
  } catch {
    return null
  }
}

export function useCurrentUser() {
  const query = useQuery<UserReturnType | null>({
    queryKey: queryKeys.users.current,
    queryFn: readStoredUser,
    initialData: readStoredUser,
    staleTime: Infinity,
    retry: false,
  })

  const user = query.data ?? null

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoadingUser: query.isLoading,
    role: user?.role ?? null,
  }
}
