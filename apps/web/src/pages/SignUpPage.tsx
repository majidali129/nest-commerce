import { Link } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { AuthForm } from "#components/auth/AuthForm"

export function SignUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Join Vantage for order tracking and faster checkout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm mode="signup" />
        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <Link to="#" className="underline underline-offset-4">
            Terms of Service
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
