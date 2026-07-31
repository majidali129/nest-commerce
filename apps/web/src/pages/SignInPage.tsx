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
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
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
    </div>
  )
}
