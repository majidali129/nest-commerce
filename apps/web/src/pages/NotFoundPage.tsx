import { Link } from "react-router"
import { Compass } from "lucide-react"

import { Button } from "#components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#components/ui/empty"

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Compass />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">Page not found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist or may have been moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link to="/" />}>Back to Home</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
