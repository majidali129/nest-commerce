import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "#components/ui/card"
import { formatPrice } from "#lib/format"
import type { DashboardStat } from "#lib/types"

interface StatCardProps {
  stat: DashboardStat
  icon: LucideIcon
}

export function StatCard({ stat, icon: Icon }: StatCardProps) {
  const value =
    stat.format === "currency"
      ? formatPrice(stat.value)
      : stat.value.toLocaleString("en-US")

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{stat.label}</span>
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{stat.delta}</span>{" "}
            {stat.subtext}
          </span>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  )
}
