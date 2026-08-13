enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
}

enum AddressType {
    BILLING = 'billing',
    SHIPPING = 'shipping',
}

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    refreshToken: string;
    role: UserRole;
    accountStatus: AccountStatus;
    isVerified: boolean;
    avatar: {
        url: string;
        publicId: string;
    }
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};

enum PublicationStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

enum VariantStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ARCHIVED = 'archived',
}

enum CartStatus {
    ACTIVE = 'active',
    CONVERTED = 'converted',
    EXPIRED = 'expired',
}

type ProductCategory = {
    id: number;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    productCount: number;
}

type Variant = {
    id: number;
    price: number;
    status: VariantStatus;
    discountPercentage: number;
    media: {
        url: string;
        publicId: string;
        altText: string;
    }
    sku: string;
    stockOnHand: number;
    reservedStock: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

type Product = {
    id: number;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    category: ProductCategory;
    publicationStatus: PublicationStatus;
    variants: Variant[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

type Address = {
    id: number;
    userId: number;
    recipientName: string;
    phone: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email: string;
    type: AddressType;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

type Carts = {
    id: number;
    userId: number;
    status: CartStatus;
    convertedOrderId: number; // ref to orders table
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

type CartItem = {
    id: number;
    cartId: number; // ref to carts table
    variantId: number; // ref to variants table
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}