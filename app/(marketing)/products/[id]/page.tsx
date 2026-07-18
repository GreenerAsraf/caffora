import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/features/products/product-gallery';
import { ProductReviews } from '@/components/features/products/product-reviews';
import { RelatedProducts } from '@/components/features/products/related-products';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Info, Truck, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getProduct = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('Failed to fetch product', error);
    return null;
  }
};

const getRelated = async (categoryId: string, excludeId: string) => {
  try {
    const res = await fetch(`${API_URL}/products?category=${categoryId}&limit=5`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const products = json.data?.products || [];
    return products.filter((p: any) => p.id !== excludeId).slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch related products', error);
    return [];
  }
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.title} | Caffora`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const related = await getRelated(product.categoryId, product.id);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <ProductGallery images={product.images} title={product.title} />

          <div className="flex flex-col">
            <Badge className="w-fit mb-4">{product.category.name}</Badge>
            <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-foreground mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/50">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="flex-1 rounded-full text-base h-14">
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-14 h-14 shrink-0 px-0">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Features/Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-border">
              <div className="flex items-start gap-3 text-muted-foreground">
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Free Shipping</p>
                  <p className="text-sm">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Satisfaction Guaranteed</p>
                  <p className="text-sm">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <ProductReviews productId={product.id} />
          </div>
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-surface p-6 rounded-2xl border border-border">
               <h3 className="font-playfair font-semibold text-xl mb-4 flex items-center gap-2">
                 <Info className="w-5 h-5 text-primary" /> Need Help?
               </h3>
               <p className="text-muted-foreground text-sm mb-4">
                 Our coffee experts are here to help you find the perfect blend. Contact us anytime!
               </p>
               <Button variant="outline" className="w-full">Contact Support</Button>
             </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={related} />
        
      </div>
    </div>
  );
}


