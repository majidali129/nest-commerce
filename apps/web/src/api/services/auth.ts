import type {
  CreateUserInput,
  CreateUserReturnType,
  LoginUserInput,
  LoginUserReturnType,
  RefreshTokenReturnType,
} from "@repo/contracts"
import { httpClient } from "../client"

export const authApi = {
  signUp: (input: CreateUserInput) =>
    httpClient.post<CreateUserReturnType>("/auth/sign-up", input),
  signIn: (input: LoginUserInput) =>
    httpClient.post<LoginUserReturnType>("/auth/sign-in", input),
  logout: () => httpClient.post<null>("/auth/sign-out"),
  refreshToken: () =>
    httpClient.post<RefreshTokenReturnType>("/auth/refresh-token"),
}
