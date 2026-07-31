import { Search } from "lucide-react"

import { Input } from "#components/ui/input"
import { cn } from "#lib/utils"

interface SearchBarProps {
  placeholder?: string
  className?: string
  defaultValue?: string
}

export function SearchBar({
  placeholder = "Search products…",
  className,
  defaultValue = "",
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="pl-8"
        aria-label={placeholder}
      />
    </div>
  )
}
