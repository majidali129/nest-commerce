import { useState } from "react"
import { AddressType, type AddressCreateInput } from "@repo/contracts"
import { Trash2 } from "lucide-react"

import { Button } from "#components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card"
import { Field, FieldGroup, FieldLabel } from "#components/ui/field"
import { Input } from "#components/ui/input"
import { Skeleton } from "#components/ui/skeleton"
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "#components/address/hooks/use-addresses"

const emptyForm: AddressCreateInput = {
  recipientName: "",
  email: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  type: AddressType.SHIPPING,
  isDefault: false,
}

export function ProfileAddressesPage() {
  const { addresses, isLoadingAddresses } = useAddresses()
  const { createAddress, isCreatingAddress } = useCreateAddress()
  const { setDefaultAddress } = useSetDefaultAddress()
  const { deleteAddress } = useDeleteAddress()
  const [form, setForm] = useState<AddressCreateInput>(emptyForm)
  const [showForm, setShowForm] = useState(false)

  function updateField<K extends keyof AddressCreateInput>(
    key: K,
    value: AddressCreateInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    createAddress(form, {
      onSuccess: () => {
        setForm(emptyForm)
        setShowForm(false)
      },
    })
  }

  if (isLoadingAddresses) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Addresses</h1>
          <p className="text-sm text-muted-foreground">
            Manage your shipping addresses
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Add address"}
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>New address</CardTitle>
            <CardDescription>Saved for checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="recipientName">Full name</FieldLabel>
                  <Input
                    id="recipientName"
                    required
                    value={form.recipientName}
                    onChange={(e) =>
                      updateField("recipientName", e.target.value)
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input
                    id="phone"
                    required
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="line1">Street address</FieldLabel>
                  <Input
                    id="line1"
                    required
                    value={form.line1}
                    onChange={(e) => updateField("line1", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input
                    id="city"
                    required
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Input
                    id="state"
                    required
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="zipCode">Zip code</FieldLabel>
                  <Input
                    id="zipCode"
                    required
                    value={form.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    id="country"
                    required
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={isCreatingAddress}>
                    {isCreatingAddress ? "Saving…" : "Save address"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No addresses yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="flex items-start justify-between gap-4 pt-6">
                <div className="text-sm">
                  <p className="font-medium">
                    {address.recipientName}
                    {address.isDefault ? (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        Default
                      </span>
                    ) : null}
                  </p>
                  <p className="text-muted-foreground">
                    {address.line1}
                    <br />
                    {address.city}, {address.state} {address.zipCode}
                    <br />
                    {address.country}
                    <br />
                    {address.phone} · {address.email}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {!address.isDefault ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultAddress(address.id)}
                    >
                      Set default
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => deleteAddress(address.id)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
