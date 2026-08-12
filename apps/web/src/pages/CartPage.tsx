import { useState } from "react"
import { Link } from "react-router"
import { Trash2 } from "lucide-react"

import { Button } from "#components/ui/button"
import { Checkbox } from "#components/ui/checkbox"
import { Skeleton } from "#components/ui/skeleton"
import { CartLineItem } from "#components/cart/CartLineItem"
import { OrderSummary } from "#components/cart/OrderSummary"
import {
  useCart,
  useRemoveCartItem,
  useRemoveCartItems,
  useUpdateCartItem,
} from "#components/cart/hooks/use-cart"
import { checkoutShippingPath, productsPath } from "../paths"

export function CartPage() {
  const { cart, isLoadingCart } = useCart()
  const { updateCartItem } = useUpdateCartItem()
  const { removeCartItem } = useRemoveCartItem()
  const { removeCartItems, isRemovingCartItems } = useRemoveCartItems()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const items = cart?.items ?? []
  const allSelected = items.length > 0 && selectedIds.size === items.length
  const someSelected = selectedIds.size > 0 && !allSelected

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? new Set(items.map((item) => item.id)) : new Set())
  }

  function toggleItem(id: number, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function deleteSelected() {
    const itemIds = Array.from(selectedIds)
    if (!itemIds.length) return
    removeCartItems(
      { itemIds },
      {
        onSuccess: () => setSelectedIds(new Set()),
      },
    )
  }

  if (isLoadingCart) {
    return (
      <div className="mx-auto max-w-9xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-2 h-4 w-24" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  const itemCount = cart?.itemCount ?? 0
  const subtotal = cart?.subtotal ?? 0

  return (
    <div className="mx-auto max-w-9xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      <p className="mt-1 text-muted-foreground">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {items.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b pb-3">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                    aria-label="Select all items"
                  />
                  <span className="text-muted-foreground">
                    {allSelected ? "Deselect all" : "Select all"}
                  </span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={selectedIds.size === 0 || isRemovingCartItems}
                  onClick={deleteSelected}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                  Delete selected
                  {selectedIds.size > 0 ? ` (${selectedIds.size})` : null}
                </Button>
              </div>

              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    selected={selectedIds.has(item.id)}
                    onSelectedChange={(checked) => toggleItem(item.id, checked)}
                    onQuantityChange={(quantity) =>
                      updateCartItem({ itemId: item.id, input: { quantity } })
                    }
                    onRemove={() => {
                      removeCartItem(item.id, {
                        onSuccess: () =>
                          setSelectedIds((prev) => {
                            const next = new Set(prev)
                            next.delete(item.id)
                            return next
                          }),
                      })
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Button variant="outline" render={<Link to={productsPath()} />}>
                Browse products
              </Button>
            </div>
          )}
        </div>

        <OrderSummary subtotal={subtotal} className="h-fit lg:sticky lg:top-20">
          <Button
            size="lg"
            className="w-full"
            disabled={items.length === 0}
            render={<Link to={checkoutShippingPath()} />}
          >
            Checkout
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            render={<Link to={productsPath()} />}
          >
            Continue Shopping
          </Button>
        </OrderSummary>
      </div>
    </div>
  )
}
