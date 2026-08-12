import type { ReactNode } from "react"

import { Button } from "#components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog"
import { cn } from "#lib/utils"

type AdminDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  /** Wider panel for rich entities (products, orders). */
  size?: "md" | "lg" | "xl"
}

const sizeClass = {
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
} as const

/**
 * Shared admin details shell — reuse for products, categories, orders, customers.
 */
export function AdminDetailDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "lg",
}: AdminDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[min(90vh,880px)] grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0",
          sizeClass[size],
        )}
      >
        <DialogHeader className="border-b px-4 py-4 pr-12 sm:px-5">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-5">
          {children}
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-none">
          {footer}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
