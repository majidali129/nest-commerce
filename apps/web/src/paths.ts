// Auth (frontend routes)
export const signUpPath = () => "/auth/sign-up"
export const signInPath = () => "/auth/sign-in"
export const forgotPasswordPath = () => "/auth/forgot-password"
export const resetPasswordPath = () => "/auth/reset-password"
export const verifyEmailPath = () => "/auth/verify-email"
export const updatePasswordPath = () => "/auth/update-password"

// Shop
export const homePath = () => "/"
export const productsPath = () => "/products"
export const productDetailsPath = (id: string) => `/products/${id}`
export const categoriesPath = () => "/categories"
export const cartPath = () => "/cart"
export const checkoutShippingPath = () => "/checkout/shipping"
export const checkoutSuccessPath = () => "/success"
export const checkoutCancelPath = () => "/cancel"

// Profile
export const settingsPath = () => "/settings"
export const profilePath = () => "/profile"
export const profileAddressesPath = () => "/profile/addresses"

// Admin
export const adminPath = () => "/admin"
