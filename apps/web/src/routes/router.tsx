import { createBrowserRouter } from "react-router"
import { UserRole } from "@repo/contracts"

import { AdminLayout } from "#layouts/AdminLayout"
import { AuthLayout } from "#layouts/AuthLayout"
import { ProfileLayout } from "#layouts/ProfileLayout"
import { RootLayout } from "#layouts/RootLayout"
import { CartPage } from "#pages/CartPage"
import { CategoriesPage } from "#pages/CategoriesPage"
import { CheckoutCancelPage } from "#pages/CheckoutCancelPage"
import { CheckoutPage } from "#pages/CheckoutPage"
import { CheckoutSuccessPage } from "#pages/CheckoutSuccessPage"
import { HomePage } from "#pages/HomePage"
import { NotFoundPage } from "#pages/NotFoundPage"
import { OrderConfirmationPage } from "#pages/OrderConfirmationPage"
import { ProductDetailPage } from "#pages/ProductDetailPage"
import { ProductsPage } from "#pages/ProductsPage"
import { ProfileOrderDetailPage } from "#pages/ProfileOrderDetailPage"
import { ProfileOrdersPage } from "#pages/ProfileOrdersPage"
import { ProfilePage } from "#pages/ProfilePage"
import { ProfileAddressesPage } from "#pages/ProfileAddressesPage"
import { SignInPage } from "#pages/SignInPage"
import { SignUpPage } from "#pages/SignUpPage"
import { CategoriesListPage } from "#pages/admin/CategoriesListPage"
import { CategoryEditPage } from "#pages/admin/CategoryEditPage"
import { CategoryNewPage } from "#pages/admin/CategoryNewPage"
import { CustomerDetailPage } from "#pages/admin/CustomerDetailPage"
import { CustomersListPage } from "#pages/admin/CustomersListPage"
import { DashboardPage } from "#pages/admin/DashboardPage"
import { OrderDetailPage } from "#pages/admin/OrderDetailPage"
import { OrdersListPage } from "#pages/admin/OrdersListPage"
import { ProductEditPage } from "#pages/admin/ProductEditPage"
import { ProductNewPage } from "#pages/admin/ProductNewPage"
import { ProductsListPage } from "#pages/admin/ProductsListPage"
import { SettingsPage } from "#pages/admin/SettingsPage"
import { ProtectedRoute } from "#routes/ProtectedRoute"

export const router = createBrowserRouter([
  {
    path: "auth",
    element: <ProtectedRoute guestOnly />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
        ],
      },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:productId", element: <ProductDetailPage /> },
      {
        element: <ProtectedRoute roles={[UserRole.USER, UserRole.ADMIN]} />,
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "checkout/shipping", element: <CheckoutPage /> },
          { path: "success", element: <CheckoutSuccessPage /> },
          { path: "cancel", element: <CheckoutCancelPage /> },
          {
            path: "order-confirmation/:orderId",
            element: <OrderConfirmationPage />,
          },
          {
            path: "profile",
            element: <ProfileLayout />,
            children: [
              { index: true, element: <ProfilePage /> },
              { path: "orders", element: <ProfileOrdersPage /> },
              { path: "orders/:orderId", element: <ProfileOrderDetailPage /> },
              { path: "addresses", element: <ProfileAddressesPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "admin",
    element: <ProtectedRoute roles={[UserRole.ADMIN]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "products", element: <ProductsListPage /> },
          { path: "products/new", element: <ProductNewPage /> },
          { path: "products/:productId/edit", element: <ProductEditPage /> },
          { path: "categories", element: <CategoriesListPage /> },
          { path: "categories/new", element: <CategoryNewPage /> },
          {
            path: "categories/:categoryId/edit",
            element: <CategoryEditPage />,
          },
          { path: "orders", element: <OrdersListPage /> },
          { path: "orders/:orderId", element: <OrderDetailPage /> },
          { path: "customers", element: <CustomersListPage /> },
          { path: "customers/:customerId", element: <CustomerDetailPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
