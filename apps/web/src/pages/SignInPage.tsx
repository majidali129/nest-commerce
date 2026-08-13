import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { AuthForm } from "#components/auth/AuthForm"

export function SignInPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to view your orders and account details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm mode="signin" />
      </CardContent>
    </Card>
  )
}
