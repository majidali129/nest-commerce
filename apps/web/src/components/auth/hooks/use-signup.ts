
import type { CreateUserInput, CreateUserReturnType } from "@repo/contracts";
import type { ApiError } from "../../../api/client";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../../api/services/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { signInPath } from "../../../paths";


export const useSignUp = () => {
    const navigate = useNavigate();
    const { mutate: createAccount, isPending: isCreatingAccount } = useMutation<CreateUserReturnType, ApiError, CreateUserInput>({
        mutationFn: authApi.signUp,
        onSuccess: () => {
          toast.success("Account created successfully");
          setTimeout(() => {
            navigate(signInPath(), { replace: true });
          }, 1500);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      });
    return { createAccount, isCreatingAccount };
}