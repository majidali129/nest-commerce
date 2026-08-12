import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import type { ApiError } from "../../../api/client"
import { authApi } from "../../../api/services/auth"
import { signInPath } from "../../../paths"
import { queryKeys } from "../../../query-keys"

function clearSession(queryClient: ReturnType<typeof useQueryClient>) {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")
  queryClient.setQueryData(queryKeys.users.current, null)
  queryClient.clear()
}

export const useSignOut = () => useLogout()

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: logout, isPending: isLoggingOut } = useMutation<
    null,
    ApiError,
    void
  >({
    mutationFn: () => authApi.logout(),
    onSettled: (_data, error) => {
      clearSession(queryClient)
      if (error) {
        toast.error(error.message || "Signed out locally")
      } else {
        toast.success("Logged out successfully")
      }
      navigate(signInPath(), { replace: true })
    },
  })

  return { logout, isLoggingOut } as const
}
