import { Link } from "react-router"

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
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import type { CartItem } from "#lib/types"

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
]

const cartItems: CartItem[] = [
  {
    id: "cart-1",
    product_id: "prod-001",
    title: "Aura Wireless Headphones",
    image_url: "https://picsum.photos/seed/aura-wireless-headphones-1/800/800",
    price: 129.99,
    quantity: 1,
    color: "Black",
  },
  {
    id: "cart-2",
    product_id: "prod-006",
    title: "Everyday Crew Tee",
    image_url: "https://picsum.photos/seed/everyday-crew-tee-1/800/800",
    price: 24.99,
    quantity: 2,
    color: "White",
    size: "M",
  },
]

const subtotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
)

export function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <form
          id="shipping-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <FieldGroup className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Shipping information</h2>
            <Field>
              <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
              <Input
                id="full_name"
                required
                autoComplete="name"
                defaultValue="Alex Morgan"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue="alex@example.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  defaultValue="555-123-4567"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Country</FieldLabel>
              <Select defaultValue="United States">
                <SelectTrigger className="w-full" aria-label="Country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
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
                  required
                  autoComplete="address-level2"
                  defaultValue="Austin"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="state">State</FieldLabel>
                <Input
                  id="state"
                  required
                  autoComplete="address-level1"
                  defaultValue="TX"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="zip_code">Zip Code</FieldLabel>
                <Input
                  id="zip_code"
                  required
                  autoComplete="postal-code"
                  defaultValue="78701"
                />
              </Field>
            </div>
          </FieldGroup>
        </form>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Cart</CardTitle>
            </CardHeader>
            <CardContent className="flex max-h-80 flex-col gap-5 overflow-y-auto">
              {cartItems.map((item) => (
                <CartLineItem key={item.id} item={item} readOnly />
              ))}
            </CardContent>
          </Card>

          <OrderSummary subtotal={subtotal} discount={17.99}>
            <div className="flex w-full gap-2">
              <Input
                placeholder="Discount code"
                aria-label="Discount code"
                defaultValue="WELCOME10"
              />
              <Button type="button" variant="outline">
                Apply
              </Button>
            </div>
            <Button
              size="lg"
              type="button"
              className="w-full"
              render={<Link to="/order-confirmation/VG-1041" />}
            >
              Pay Now
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}
