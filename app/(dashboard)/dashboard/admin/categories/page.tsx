import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = ["Coffee Beans", "Equipment", "Accessories", "Subscriptions"]

export default function AdminCategoriesPage() {
  return <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Categories</CardTitle><Button className="rounded-full">Add category</Button></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{categories.map((category, index) => <div key={category} className="rounded-xl border border-border p-4"><p className="font-medium">{category}</p><p className="text-sm text-muted-foreground">{24 - index * 4} active products</p></div>)}</CardContent></Card>
}
