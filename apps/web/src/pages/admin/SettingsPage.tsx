import { toast } from "sonner"

import { AdminPageHeader } from "#components/admin/AdminPageHeader"
import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { Field, FieldGroup, FieldLabel } from "#components/ui/field"
import { Input } from "#components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select"
import { Switch } from "#components/ui/switch"

export function SettingsPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success("Settings saved (demo)")
  }

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Store preferences — demo only, nothing is persisted."
      />
      <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="store_name">Store name</FieldLabel>
                <Input id="store_name" name="store_name" defaultValue="Vantage" />
              </Field>
              <Field>
                <FieldLabel htmlFor="support_email">Support email</FieldLabel>
                <Input
                  id="support_email"
                  name="support_email"
                  type="email"
                  defaultValue="support@vantage.example"
                />
              </Field>
              <Field>
                <FieldLabel>Currency</FieldLabel>
                <Select name="currency" defaultValue="USD">
                  <SelectTrigger className="w-full" aria-label="Currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                      <SelectItem value="GBP">GBP — British Pound</SelectItem>
                      <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Timezone</FieldLabel>
                <Select name="timezone" defaultValue="America/Chicago">
                  <SelectTrigger className="w-full" aria-label="Timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="America/Chicago">
                        America/Chicago
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York
                      </SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Australia/Sydney">
                        Australia/Sydney
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="flex items-center justify-between gap-4 text-sm">
              <span>
                New order emails
                <span className="block text-xs text-muted-foreground">
                  Get notified when a customer places an order.
                </span>
              </span>
              <Switch name="notify_orders" defaultChecked />
            </label>
            <label className="flex items-center justify-between gap-4 text-sm">
              <span>
                Low stock alerts
                <span className="block text-xs text-muted-foreground">
                  Alert when a product drops below its threshold.
                </span>
              </span>
              <Switch name="notify_stock" defaultChecked />
            </label>
            <label className="flex items-center justify-between gap-4 text-sm">
              <span>
                Weekly summary
                <span className="block text-xs text-muted-foreground">
                  A digest of sales and traffic every Monday.
                </span>
              </span>
              <Switch name="notify_summary" />
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </div>
  )
}
