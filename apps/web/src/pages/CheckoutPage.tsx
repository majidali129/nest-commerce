import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  AddressType,
  type AddressCreateInput,
} from "@repo/contracts"
import { toast } from "sonner"

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
import { Skeleton } from "#components/ui/skeleton"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import { useCart } from "#components/cart/hooks/use-cart"
import {
  useAddresses,
  useCreateAddress,
} from "#components/address/hooks/use-addresses"
import { useCurrentUser } from "#hooks/use-current-user"
import { useCreateCheckoutSession } from "#hooks/use-payments"
import { cartPath } from "../paths"

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
]

export function CheckoutPage() {
  const { user } = useCurrentUser()
  const { cart, isLoadingCart } = useCart()
  const { addresses, isLoadingAddresses } = useAddresses()
  const { createAddressAsync, isCreatingAddress } = useCreateAddress()
  const { createCheckoutSessionAsync, isCreatingCheckoutSession } =
    useCreateCheckoutSession()

  const shippingAddresses = useMemo(
    () => addresses.filter((a) => a.type === AddressType.SHIPPING),
    [addresses],
  )
  const defaultAddress =
    shippingAddresses.find((a) => a.isDefault) ?? shippingAddresses[0] ?? null

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  )
  const [country, setCountry] = useState("United States")

  const activeAddressId = selectedAddressId ?? defaultAddress?.id ?? null
  const items = cart?.items ?? []
  const subtotal = cart?.subtotal ?? 0

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (activeAddressId && activeAddressId > 0 && selectedAddressId !== -1) {
      toast.success("Shipping address selected")
      return
    }

    const input: AddressCreateInput = {
      recipientName: String(data.get("recipientName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      line1: String(data.get("line1") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
      state: String(data.get("state") ?? "").trim(),
      zipCode: String(data.get("zipCode") ?? "").trim(),
      country,
      type: AddressType.SHIPPING,
      isDefault: true,
    }

    const created = await createAddressAsync(input)
    setSelectedAddressId(created.id)
  }

  async function handlePlaceOrder() {
    if (!cart?.id) {
      toast.error("Cart not found")
      return
    }
    if (!activeAddressId || activeAddressId < 0) {
      toast.error("Select or save a shipping address first")
      return
    }

    try {
      const session = await createCheckoutSessionAsync({
        cartId: cart.id,
        addressId: activeAddressId,
      })

      if (!session.url) {
        toast.error("Unable to start Stripe checkout")
        return
      }

      window.location.assign(session.url)
    } catch {
      // Toast handled by useCreateCheckoutSession onError
    }
  }

  if (isLoadingCart || isLoadingAddresses) {
    return (
      <div className="mx-auto max-w-9xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-40" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-9xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-4" render={<Link to={cartPath()} />}>
          Back to cart
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-9xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <form id="shipping-form" onSubmit={handleSubmit}>
          <FieldGroup className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Shipping information</h2>

            {shippingAddresses.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Saved addresses</p>
                {shippingAddresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex cursor-pointer gap-3 rounded-lg border p-3 text-sm has-checked:border-primary"
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      className="mt-1"
                      checked={activeAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <span>
                      <span className="font-medium">{address.recipientName}</span>
                      {address.isDefault ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Default
                        </span>
                      ) : null}
                      <br />
                      {address.line1}, {address.city}, {address.state}{" "}
                      {address.zipCode}
                      <br />
                      {address.country} · {address.phone}
                    </span>
                  </label>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="self-start"
                  onClick={() => setSelectedAddressId(-1)}
                >
                  Use a new address
                </Button>
              </div>
            ) : null}

            {(shippingAddresses.length === 0 || selectedAddressId === -1) && (
              <>
                <Field>
                  <FieldLabel htmlFor="recipientName">Full Name</FieldLabel>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    required
                    autoComplete="name"
                    defaultValue={user?.name ?? ""}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      defaultValue={user?.email ?? ""}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="line1">Address</FieldLabel>
                  <Input
                    id="line1"
                    name="line1"
                    required
                    autoComplete="street-address"
                  />
                </Field>
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Select
                    value={country}
                    onValueChange={(value) => {
                      if (typeof value === "string") setCountry(value)
                    }}
                  >
                    <SelectTrigger className="w-full" aria-label="Country">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      id="city"
                      name="city"
                      required
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="state">State</FieldLabel>
                    <Input
                      id="state"
                      name="state"
                      required
                      autoComplete="address-level1"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="zipCode">Zip Code</FieldLabel>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      required
                      autoComplete="postal-code"
                    />
                  </Field>
                </div>
              </>
            )}

            {(shippingAddresses.length === 0 || selectedAddressId === -1) && (
              <Button
                type="submit"
                form="shipping-form"
                disabled={isCreatingAddress}
              >
                {isCreatingAddress ? "Saving…" : "Save shipping address"}
              </Button>
            )}
          </FieldGroup>
        </form>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Cart</CardTitle>
            </CardHeader>
            <CardContent className="flex max-h-80 flex-col gap-5 overflow-y-auto">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} readOnly />
              ))}
            </CardContent>
          </Card>

          <OrderSummary subtotal={subtotal}>
            <Button
              size="lg"
              type="button"
              className="w-full"
              disabled={
                !activeAddressId ||
                activeAddressId < 0 ||
                items.length === 0 ||
                isCreatingCheckoutSession
              }
              onClick={() => {
                void handlePlaceOrder()
              }}
            >
              {isCreatingCheckoutSession ? "Redirecting…" : "Place order"}
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}
