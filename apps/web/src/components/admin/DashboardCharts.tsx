import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "#components/ui/chart"
import { formatPrice } from "#lib/format"
import {
  ordersByStatus,
  revenueSeries,
  topProducts,
} from "#lib/mock-data"
import { formatOrderStatus } from "#lib/order-utils"

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-2)" },
  orders: { label: "Orders", color: "var(--chart-3)" },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue over time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="aspect-auto h-72">
          <BarChart data={revenueSeries} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => `$${value / 1000}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {name === "revenue" ? "Revenue" : "Orders"}
                      </span>
                      <span className="font-medium">
                        {name === "revenue"
                          ? formatPrice(Number(value))
                          : value}
                      </span>
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const statusColors: Record<string, string> = {
  paid: "var(--chart-1)",
  processing: "var(--chart-2)",
  shipped: "var(--chart-3)",
  delivered: "var(--chart-4)",
}

const statusConfig = {
  paid: { label: "Paid", color: "var(--chart-1)" },
  processing: { label: "Processing", color: "var(--chart-2)" },
  shipped: { label: "Shipped", color: "var(--chart-3)" },
  delivered: { label: "Delivered", color: "var(--chart-4)" },
} satisfies ChartConfig

export function OrdersByStatusChart() {
  const data = ordersByStatus.map((entry) => ({
    ...entry,
    label: formatOrderStatus(entry.status),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer config={statusConfig} className="aspect-auto h-52">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {formatOrderStatus(
                          name as Parameters<typeof formatOrderStatus>[0]
                        )}
                      </span>
                      <span className="font-medium">{value}</span>
                    </span>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={48}
              outerRadius={80}
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={statusColors[entry.status]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-2">
          {data.map((entry) => (
            <div key={entry.status} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: statusColors[entry.status] }}
              />
              <span className="text-muted-foreground">{entry.label}</span>
              <span className="ml-auto font-medium">{entry.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const topProductsConfig = {
  revenue: { label: "Revenue", color: "var(--chart-2)" },
} satisfies ChartConfig

export function TopProductsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top products by revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={topProductsConfig} className="aspect-auto h-72">
          <BarChart
            data={topProducts}
            layout="vertical"
            margin={{ left: 8, right: 8 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${value / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="title"
              tickLine={false}
              axisLine={false}
              width={140}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium">
                      {formatPrice(Number(value))}
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
