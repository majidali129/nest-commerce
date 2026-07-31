import { Link } from "react-router"

import { Button } from "#components/ui/button"
import { Field, FieldGroup, FieldLabel } from "#components/ui/field"
import { Input } from "#components/ui/input"

interface AuthFormProps {
  mode: "signup" | "signin"
}

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup"

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
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
              defaultValue="Alex Morgan"
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
            defaultValue="alex@example.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            defaultValue="password"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full">
          {isSignup ? "Create account" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            to={isSignup ? "/signin" : "/signup"}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
