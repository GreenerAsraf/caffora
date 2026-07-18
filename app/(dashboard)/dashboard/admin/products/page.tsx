import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

const products = [
  { name: "Ethiopian Sunrise Blend", category: "Coffee Beans", stock: 42, price: 2499 },
  { name: "Precision Pour Over Kit", category: "Equipment", stock: 12, price: 7499 },
  { name: "Caffora Travel Tumbler", category: "Accessories", stock: 88, price: 1899 },
]

export default function AdminProductsPage() {
  return <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Products</CardTitle><Button className="rounded-full">Add product</Button></CardHeader><CardContent className="space-y-3">{products.map(product => <div key={product.name} className="grid gap-2 rounded-xl border border-border p-4 md:grid-cols-4 md:items-center"><p className="font-medium">{product.name}</p><p className="text-sm text-muted-foreground">{product.category}</p><Badge className="w-fit">{product.stock} in stock</Badge><p className="font-semibold md:text-right">{formatPrice(product.price)}</p></div>)}</CardContent></Card>
}
