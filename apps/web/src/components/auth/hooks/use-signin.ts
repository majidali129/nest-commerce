import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import {
  UserRole,
  type LoginUserInput,
  type LoginUserReturnType,
} from "@repo/contracts"

import type { ApiError } from "../../../api/client"
import { authApi } from "../../../api/services/auth"
import { adminPath, homePath } from "../../../paths"
import { queryKeys } from "../../../query-keys"

function resolvePostLoginPath(
  role: LoginUserReturnType["user"]["role"],
  nextParam: string | null,
) {
  const fallback = role === UserRole.ADMIN ? adminPath() : homePath()
  if (!nextParam) return fallback

  try {
    const next = decodeURIComponent(nextParam)
    if (!next.startsWith("/") || next.startsWith("//")) return fallback
    if (role === UserRole.ADMIN && next.startsWith("/admin")) return next
    if (role !== UserRole.ADMIN && !next.startsWith("/admin")) return next
    return fallback
  } catch {
    return fallback
  }
}

export const useSignIn = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const { mutate: loginUser, isPending: isLoggingInUser } = useMutation<
    LoginUserReturnType,
    ApiError,
    LoginUserInput
  >({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      toast.success("Login successfully")
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("user", JSON.stringify(data.user))
      queryClient.setQueryData(queryKeys.users.current, data.user)
      navigate(resolvePostLoginPath(data.user.role, searchParams.get("next")), {
        replace: true,
      })
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return { loginUser, isLoggingInUser }
}
