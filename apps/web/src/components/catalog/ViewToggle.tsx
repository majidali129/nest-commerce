import { LayoutGrid, List } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "#components/ui/toggle-group"

export function ViewToggle() {
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      defaultValue={["grid"]}
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
