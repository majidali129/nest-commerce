import { Link } from "react-router"
import { Loader2 } from "lucide-react"

import { Button } from "#components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#components/ui/field"
import { Input } from "#components/ui/input"
import { useSignIn } from "./hooks/use-signin"
import { useSignUp } from "./hooks/use-signup"
import { signInPath, signUpPath } from "../../paths"

interface AuthFormProps {
  mode: "signup" | "signin"
}

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup"
  const { loginUser, isLoggingInUser } = useSignIn()
  const { createAccount, isCreatingAccount } = useSignUp()
  const isPending = isSignup ? isCreatingAccount : isLoggingInUser

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPending) return

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (isSignup) {
      const name = String(formData.get("name") ?? "").trim()
      createAccount({ name, email, password })
      return
    }

    loginUser({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="flex flex-col gap-4">
        {isSignup && (
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              name="name"
              required
              autoComplete="name"
              placeholder="Alex Morgan"
              disabled={isPending}
            />
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={isSignup ? 8 : undefined}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            disabled={isPending}
          />
        </Field>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin" data-icon="inline-start" />}
          {isPending
            ? isSignup
              ? "Creating account…"
              : "Signing in…"
            : isSignup
              ? "Create account"
              : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            to={isSignup ? signInPath() : signUpPath()}
            className="font-medium text-foreground underline-offset-4 hover:underline"
            aria-disabled={isPending}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
