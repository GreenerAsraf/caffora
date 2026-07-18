import { Heart } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  return <EmptyState icon={Heart} title="Wishlist ready" description="Saved products will appear here for the signed-in customer demo." action={<Button className="rounded-full">Browse products</Button>} />
}
