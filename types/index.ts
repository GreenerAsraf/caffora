// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: User
  accessToken: string
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description: string
  productCount?: number
  createdAt: string
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number           // in cents
  comparePrice?: number   // original price in cents (for discount display)
  images: string[]
  stock: number
  category: Category
  rating: number          // 0–5
  reviewCount: number
  soldCount: number
  tags: string[]
  specifications?: Record<string, string>
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductCard {
  id: string
  title: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  rating: number
  reviewCount: number
  category: { name: string; slug: string }
  stock: number
  featured: boolean
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  productId: string
  product: Pick<Product, "id" | "title" | "images" | "price" | "stock" | "slug">
  quantity: number
}

export interface Cart {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  itemCount: number
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  productId: string
  addedAt: string
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export interface OrderItem {
  id: string
  productId: string
  product: Pick<Product, "id" | "title" | "images" | "slug">
  quantity: number
  price: number // in cents, snapshot at time of order
}

export interface ShippingAddress {
  fullName: string
  street: string
  city: string
  state: string
  country: string
  zip: string
  phone?: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number // in cents
  status: OrderStatus
  paymentId?: string
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  userId: string
  productId: string
  user: Pick<User, "id" | "name" | "avatar">
  rating: number
  title?: string
  comment: string
  helpful: number
  createdAt: string
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  category: string
  image: string
  author: {
    name: string
    avatar: string
  }
  readTime: number
  date: string
  tags?: string[]
}

// ─── API Response ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// ─── Filter & Search ──────────────────────────────────────────────────────────

export interface ProductFilters {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sort?: string
  page?: number
  pageSize?: number
}

// ─── Dashboard Analytics ──────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  revenueGrowth: number    // percentage vs last period
  orderGrowth: number
  userGrowth: number
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  orders: number
}

export interface CategorySalesPoint {
  category: string
  sales: number
  percentage: number
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
}

// ─── Component Props Helpers ──────────────────────────────────────────────────

export interface WithClassName {
  className?: string
}

export interface WithChildren {
  children: React.ReactNode
}
