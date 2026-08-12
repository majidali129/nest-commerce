// ─── Enums ───────────────────────────────────────────────────────────────────

export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AccountStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
} as const;
export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

export const PublicationStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
export type PublicationStatus =
  (typeof PublicationStatus)[keyof typeof PublicationStatus];

export const VariantStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;
export type VariantStatus = (typeof VariantStatus)[keyof typeof VariantStatus];

export const ProductSort = {
  NEWEST: 'newest',
  FEATURED: 'featured',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  STOCK_ASC: 'stock-asc',
  STOCK_DESC: 'stock-desc',
} as const;
export type ProductSort = (typeof ProductSort)[keyof typeof ProductSort];

export const CategorySort = {
  NEWEST: 'newest',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  PRODUCTS_ASC: 'products-asc',
  PRODUCTS_DESC: 'products-desc',
} as const;
export type CategorySort = (typeof CategorySort)[keyof typeof CategorySort];

export const StockStatusFilter = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
} as const;
export type StockStatusFilter =
  (typeof StockStatusFilter)[keyof typeof StockStatusFilter];

export const AddressType = {
  BILLING: 'billing',
  SHIPPING: 'shipping',
} as const;
export type AddressType = (typeof AddressType)[keyof typeof AddressType];

export const CartStatus = {
  ACTIVE: 'active',
  CHECKOUT_IN_PROGRESS: 'checkout_in_progress',
  CONVERTED: 'converted',
  EXPIRED: 'expired',
} as const;
export type CartStatus = (typeof CartStatus)[keyof typeof CartStatus];

export const OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentProvider = {
  PENDING: 'pending',
  STRIPE: 'stripe',
} as const;
export type PaymentProvider =
  (typeof PaymentProvider)[keyof typeof PaymentProvider];

export const ReservationStatus = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  RELEASED: 'released',
  FULFILLED: 'fulfilled',
} as const;
export type ReservationStatus =
  (typeof ReservationStatus)[keyof typeof ReservationStatus];

export const ReservationType = {
  CART: 'cart',
  CHECKOUT: 'checkout',
  PAYMENT_PROCESSING: 'payment_processing',
} as const;
export type ReservationType =
  (typeof ReservationType)[keyof typeof ReservationType];

export type OrderAddressSnapshot = {
  recipientName: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type OrderProductSnapshot = {
  productId: number;
  variantId?: number | null;
  name: string;
  sku?: string | null;
  imageUrl?: string | null;
  attributes?: VariantAttributes | null;
};

// ─── Shared ──────────────────────────────────────────────────────────────────

export type MediaAsset = {
  url: string;
  publicId: string;
  altText: string | null;
};

export type VariantAttributes = {
  size: string;
  color: string;
};

export type UserAvatar = {
  url: string;
  publicId: string;
};

export type ApiErrorPayload = Record<string, string[]> | string[] | string | null;

export type ApiResponse<T = unknown> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: ApiErrorPayload;
  timestamp: string;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginatedMeta;
};

// ─── Auth / users ────────────────────────────────────────────────────────────

export type UserReturnType = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: UserAvatar | null;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserReturnType = UserReturnType & {
  accountStatus: AccountStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

export type LoginUserReturnType = {
  accessToken: string;
  refreshToken: string;
  user: UserReturnType;
};

export type RefreshTokenReturnType = {
  accessToken: string;
  refreshToken: string;
};

// ─── Categories ──────────────────────────────────────────────────────────────

export type CategoryListItem = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoriesQuery = {
  q?: string;
  sort?: CategorySort;
  page?: number;
  limit?: number;
};

export type CategoriesReturnType = PaginatedResult<CategoryListItem>;

export type CategoryCreateInput = {
  name: string;
  description: string;
  imageUrl?: string | null;
};

export type CategoryUpdateInput = Partial<CategoryCreateInput>;

export type CategoryCreateReturnType = CategoryListItem;
export type CategoryUpdateReturnType = CategoryListItem;
export type CategoryDeleteReturnType = CategoryListItem;

export type CategoryRef = Pick<CategoryListItem, 'id' | 'name'>;

export type CloudinaryFolderKey = 'categories' | 'variants' | 'avatars';

export type CloudinarySignatureReturnType = {
  signature: string;
  timestamp: number;
  uploadUrl: string;
  cloudName: string;
  folderName: string;
  apiKey: string;
};

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  secureUrl: string;
};

// ─── Variants ────────────────────────────────────────────────────────────────

export type Variant = {
  id: number;
  productId: number;
  price: number;
  discountPercentage: number;
  status: VariantStatus;
  sku: string;
  stock: number;
  media: MediaAsset | null;
  isDefault: boolean;
  attributes: VariantAttributes | null;
};

export type VariantsReturnType = Variant[];

export type VariantCreateInput = {
  productId: number;
  price: number;
  sku: string;
  stockOnHand?: number;
  discountPercentage?: number;
  status?: VariantStatus;
  attributes?: VariantAttributes | null;
  media?: MediaAsset | null;
  isDefault?: boolean;
};

export type VariantUpdateInput = Partial<
  Omit<VariantCreateInput, 'productId'>
>;

export type VariantCreateReturnType = Variant;
export type VariantUpdateReturnType = Variant;

// ─── Products ────────────────────────────────────────────────────────────────

export type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  category: CategoryRef;
  publicationStatus: PublicationStatus;
  isFeatured: boolean;
  variant: Variant | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductsQuery = {
  q?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  publicationStatus?: PublicationStatus;
  stockStatus?: StockStatusFilter;
  sort?: ProductSort;
  page?: number;
  limit?: number;
};

export type ProductsReturnType = PaginatedResult<ProductListItem>;

export type ProductDetailsReturnType = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: CategoryRef;
  publicationStatus: PublicationStatus;
  isFeatured: boolean;
  variants: VariantsReturnType;
  createdAt: string;
  updatedAt: string;
};

export type ProductCreateInput = {
  name: string;
  shortDescription: string;
  description: string;
  categoryId: number;
  publicationStatus?: PublicationStatus;
  isFeatured?: boolean;
};

export type ProductUpdateInput = Partial<ProductCreateInput>;

export type ProductCreateReturnType = ProductDetailsReturnType;
export type ProductUpdateReturnType = ProductDetailsReturnType;

// ─── Cart ────────────────────────────────────────────────────────────────────

export type CartLineItem = {
  id: number;
  variantId: number;
  productId: number;
  quantity: number;
  title: string;
  imageUrl: string | null;
  price: number;
  stock: number;
  sku: string;
  color: string | null;
  size: string | null;
};

export type CartReturnType = {
  id: number;
  status: CartStatus;
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
};

export type AddToCartInput = {
  variantId: number;
  quantity: number;
};

export type UpdateCartItemInput = {
  quantity: number;
};

export type RemoveCartItemsInput = {
  itemIds: number[];
};

// ─── Addresses ───────────────────────────────────────────────────────────────

export type AddressReturnType = {
  id: number;
  recipientName: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: AddressType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressCreateInput = {
  recipientName: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type?: AddressType;
  isDefault?: boolean;
};

export type AddressUpdateInput = Partial<AddressCreateInput>;

export type AddressesReturnType = AddressReturnType[];

// ─── Orders / payments ───────────────────────────────────────────────────────

export type CreateCheckoutSessionInput = {
  cartId: number;
  addressId: number;
};

export type CreateCheckoutSessionReturnType = {
  url: string | null;
  sessionId: string;
  clientSecret: string | null;
  orderId: number;
};

export type OrderItemReturnType = {
  id: number;
  variantId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot: OrderProductSnapshot;
};

export type OrderReturnType = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  shippingAddress: OrderAddressSnapshot;
  billingAddress: OrderAddressSnapshot | null;
  items: OrderItemReturnType[];
  payment: PaymentReturnType | null;
  stripeCheckoutSessionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderListItem = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
  itemCount: number;
  previewImageUrl: string | null;
};

export type AdminOrderListItem = OrderListItem & {
  userId: number;
  customerName: string;
  customerEmail: string;
};

export type AdminOrdersReturnType = {
  items: AdminOrderListItem[];
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};

export type OrdersReturnType = {
  items: OrderListItem[];
};

export type PaymentReturnType = {
  id: number;
  orderId: number;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  failureMessage: string | null;
  createdAt: string;
  paidAt: string | null;
  refundedAmount: number;
};

// ─── Store settings ──────────────────────────────────────────────────────────

export type StoreSettings = {
  name: string;
  email: string;
  currency: string;
  timeZone: string;
  notifications: {
    orderEmail: boolean;
    lowStockAlert: boolean;
    weeklySummary: boolean;
  };
};
