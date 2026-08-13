import type { CategoriesQuery, CloudinaryFolderKey, ProductsQuery } from "@repo/contracts"

export const queryKeys = {
  users: {
    current: ["users", "current"] as const,
  },
  shop: {
    products: {
      all: ["products"] as const,
      list: (query: ProductsQuery) => ["products", "list", query] as const,
      detail: (id: string) => ["products", "detail", id] as const,
      create: ["products", "create"] as const,
      update: (id: string | number) =>
        ["products", "update", String(id)] as const,
      delete: (id: string | number) =>
        ["products", "delete", String(id)] as const,
      variants: {
        byProduct: (productId: string | number) =>
          ["products", "variants", String(productId)] as const,
        create: (productId: string | number) =>
          ["products", "variants", "create", String(productId)] as const,
      },
    },
    categories: {
      all: ["categories"] as const,
      list: (query: CategoriesQuery) => ["categories", "list", query] as const,
      detail: (id: string) => ["categories", "detail", id] as const,
      create: ["categories", "create"] as const,
      update: (id: string | number) => ["categories", "update", String(id)] as const,
      delete: (id: string | number) => ["categories", "delete", String(id)] as const,
    },
    cart: ["cart"] as const,
    addresses: {
      all: ["addresses"] as const,
      list: ["addresses", "list"] as const,
    },
    payments: {
      all: ["payments"] as const,
      createSession: ["payments", "create-checkout-session"] as const,
    },
    orders: {
      all: ["orders"] as const,
      list: ["orders", "list"] as const,
      detail: (id: number | string) => ["orders", "detail", String(id)] as const,
      bySession: (sessionId: string) =>
        ["orders", "by-session", sessionId] as const,
      cancelCheckout: ["orders", "cancel-checkout"] as const,
      admin: {
        all: ["orders", "admin"] as const,
        list: ["orders", "admin", "list"] as const,
        detail: (id: number | string) =>
          ["orders", "admin", "detail", String(id)] as const,
        updateStatus: ["orders", "admin", "update-status"] as const,
      },
    },
  },
  cloudinary: {
    signature: (folderName: CloudinaryFolderKey) =>
      ["cloudinary", "signature", folderName] as const,
  },
}
