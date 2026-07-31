import { Minus, Plus } from "lucide-react"

import { Button } from "#components/ui/button"
import { cn } from "#lib/utils"

interface QuantityStepperProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantityStepper({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Decrease quantity"
        disabled={!onChange || value <= min}
        onClick={() => onChange?.(Math.max(min, value - 1))}
      >
        <Minus />
      </Button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Increase quantity"
        disabled={!onChange || value >= max}
        onClick={() => onChange?.(Math.min(max, value + 1))}
      >
        <Plus />
      </Button>
    </div>
  )
}
