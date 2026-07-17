// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS_PUBLIC = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const

export const NAV_LINKS_AUTH = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
] as const

export const PROFILE_DROPDOWN_ITEMS = [
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
  { label: "My Orders", href: "/dashboard/orders", icon: "Package" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: "Heart" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const

export const DASHBOARD_USER_NAV = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Orders", href: "/dashboard/orders", icon: "Package" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: "Heart" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const

export const DASHBOARD_ADMIN_NAV = [
  { label: "Overview", href: "/dashboard/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/dashboard/admin/products", icon: "ShoppingBag" },
  { label: "Categories", href: "/dashboard/admin/categories", icon: "Tag" },
  { label: "Users", href: "/dashboard/admin/users", icon: "Users" },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: "BarChart3" },
] as const

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    icon: "Laptop",
    color: "bg-blue-500",
    image: "/images/categories/electronics.jpg",
    description: "Gadgets, devices, and tech accessories",
    productCount: 142,
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    color: "bg-pink-500",
    image: "/images/categories/fashion.jpg",
    description: "Clothing, shoes, and accessories",
    productCount: 289,
  },
  {
    id: "home-living",
    name: "Home & Living",
    slug: "home-living",
    icon: "Home",
    color: "bg-green-500",
    image: "/images/categories/home.jpg",
    description: "Furniture, decor, and essentials",
    productCount: 198,
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    icon: "Dumbbell",
    color: "bg-orange-500",
    image: "/images/categories/sports.jpg",
    description: "Equipment, apparel, and accessories",
    productCount: 176,
  },
  {
    id: "beauty",
    name: "Beauty",
    slug: "beauty",
    icon: "Sparkles",
    color: "bg-purple-500",
    image: "/images/categories/beauty.jpg",
    description: "Skincare, makeup, and fragrances",
    productCount: 215,
  },
  {
    id: "books",
    name: "Books",
    slug: "books",
    icon: "BookOpen",
    color: "bg-amber-500",
    image: "/images/categories/books.jpg",
    description: "Bestsellers, textbooks, and more",
    productCount: 423,
  },
  {
    id: "toys",
    name: "Toys & Games",
    slug: "toys",
    icon: "Gamepad2",
    color: "bg-red-500",
    image: "/images/categories/toys.jpg",
    description: "Fun for all ages",
    productCount: 134,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    slug: "kitchen",
    icon: "UtensilsCrossed",
    color: "bg-teal-500",
    image: "/images/categories/kitchen.jpg",
    description: "Cookware, appliances, and tools",
    productCount: 87,
  },
] as const

// ─── Stats ────────────────────────────────────────────────────────────────────

export const SITE_STATS = [
  { label: "Products", value: 12500, suffix: "+" },
  { label: "Happy Customers", value: 48000, suffix: "+" },
  { label: "Orders Delivered", value: 93000, suffix: "+" },
  { label: "Satisfaction Rate", value: 98, suffix: "%" },
] as const

// ─── Features / USPs ─────────────────────────────────────────────────────────

export const SITE_FEATURES = [
  {
    icon: "Truck",
    title: "Free Shipping",
    description: "Free delivery on all orders over $50. Express options available.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: "Shield",
    title: "Secure Payments",
    description: "256-bit SSL encryption. Your data is always protected.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: "RefreshCcw",
    title: "Easy Returns",
    description: "30-day hassle-free returns. No questions asked.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    description: "Round-the-clock customer support via chat, email, or phone.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
] as const

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "Caffora completely changed how I shop online. The product quality is outstanding and delivery was faster than expected!",
    product: "Wireless Noise-Cancelling Headphones",
    date: "2025-06-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    text: "Best e-commerce experience I've had. The interface is beautiful, checkout is smooth, and the customer support is incredible.",
    product: "Smart Home Bundle",
    date: "2025-06-20",
  },
  {
    id: 3,
    name: "Amira Patel",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    text: "I love how easy it is to find what I need. The filters work perfectly and the product photos are accurate!",
    product: "Premium Skincare Set",
    date: "2025-07-01",
  },
  {
    id: 4,
    name: "David Müller",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 4,
    text: "Great selection of products at competitive prices. The wishlist feature is super handy for planning future purchases.",
    product: "Running Shoes Pro",
    date: "2025-07-05",
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    text: "Ordered for the first time last month and I'm hooked. The packaging is eco-friendly and every item was perfectly protected.",
    product: "Bamboo Kitchen Set",
    date: "2025-07-10",
  },
  {
    id: 6,
    name: "James Williams",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    text: "The dashboard is super intuitive for tracking orders. Got real-time updates throughout the whole delivery process.",
    product: "MacBook Pro Stand",
    date: "2025-07-12",
  },
] as const

// ─── Blog Posts (seed data) ───────────────────────────────────────────────────

export const BLOG_POSTS = [
  {
    id: "1",
    title: "Top 10 Tech Gadgets to Watch in 2025",
    slug: "top-10-tech-gadgets-2025",
    excerpt: "From AI-powered earbuds to foldable displays — here are the must-have tech gadgets defining this year.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    author: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/40?img=15" },
    readTime: 5,
    date: "2025-07-01",
  },
  {
    id: "2",
    title: "How to Build a Sustainable Wardrobe on a Budget",
    slug: "sustainable-wardrobe-budget",
    excerpt: "Smart shopping strategies to look great while being kind to your wallet and the planet.",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
    author: { name: "Maya Osei", avatar: "https://i.pravatar.cc/40?img=16" },
    readTime: 7,
    date: "2025-07-08",
  },
  {
    id: "3",
    title: "5 Home Décor Trends Dominating 2025",
    slug: "home-decor-trends-2025",
    excerpt: "Earthy textures, bold colors, and multi-functional furniture are reshaping how we design our living spaces.",
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    author: { name: "Lena Hoffmann", avatar: "https://i.pravatar.cc/40?img=17" },
    readTime: 4,
    date: "2025-07-14",
  },
] as const

// ─── Sort Options ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Selling", value: "sales" },
] as const

// ─── Price Ranges ─────────────────────────────────────────────────────────────

export const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 2500 },
  { label: "$25 – $50", min: 2500, max: 5000 },
  { label: "$50 – $100", min: 5000, max: 10000 },
  { label: "$100 – $200", min: 10000, max: 20000 },
  { label: "Over $200", min: 20000, max: null },
] as const

// ─── Order Statuses ───────────────────────────────────────────────────────────

export const ORDER_STATUSES = {
  PENDING:    { label: "Pending",    color: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30" },
  CONFIRMED:  { label: "Confirmed",  color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30" },
  SHIPPED:    { label: "Shipped",    color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30" },
  DELIVERED:  { label: "Delivered",  color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30" },
  CANCELLED:  { label: "Cancelled",  color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30" },
} as const

// ─── Site Info ────────────────────────────────────────────────────────────────

export const SITE_INFO = {
  name: "Caffora",
  tagline: "Premium Shopping, Delivered",
  description: "Discover thousands of premium products across electronics, fashion, home & more. Fast delivery, secure checkout, and world-class support.",
  email: "hello@caffora.com",
  phone: "+1 (555) 123-4567",
  address: "123 Market Street, San Francisco, CA 94103",
  social: {
    twitter:   "https://twitter.com/caffora",
    instagram: "https://instagram.com/caffora",
    facebook:  "https://facebook.com/caffora",
    linkedin:  "https://linkedin.com/company/caffora",
    youtube:   "https://youtube.com/@caffora",
  },
} as const

// ─── Footer Links ─────────────────────────────────────────────────────────────

export const FOOTER_LINKS = {
  company: [
    { label: "About Us",  href: "/about" },
    { label: "Blog",      href: "/blog" },
    { label: "Contact",   href: "/contact" },
    { label: "Careers",   href: "/careers" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Track Order", href: "/orders" },
    { label: "Returns",     href: "/returns" },
    { label: "Shipping",    href: "/shipping" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use",   href: "/terms" },
    { label: "Cookie Policy",  href: "/cookies" },
  ],
} as const

// ─── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12
export const PAGE_SIZE_OPTIONS = [12, 24, 48] as const

// ─── Image Placeholders ───────────────────────────────────────────────────────

export const PLACEHOLDER_PRODUCT_IMAGE = "/images/placeholder-product.png"
export const PLACEHOLDER_AVATAR = "/images/placeholder-avatar.png"
