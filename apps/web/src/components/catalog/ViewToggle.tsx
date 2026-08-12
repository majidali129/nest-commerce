import { LayoutGrid, List } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "#components/ui/toggle-group"
import type { ViewMode } from "#lib/types"

interface ViewToggleProps {
  value?: ViewMode
  onValueChange?: (value: ViewMode) => void
}

export function ViewToggle({
  value = "grid",
  onValueChange,
}: ViewToggleProps) {
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      value={[value]}
      onValueChange={(next) => {
        const mode = next[0]
        if (mode === "grid" || mode === "list") onValueChange?.(mode)
      }}
      aria-label="Toggle product view"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
