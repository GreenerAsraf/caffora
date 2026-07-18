import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/features/products/product-gallery';
import { ProductReviews } from '@/components/features/products/product-reviews';
import { RelatedProducts } from '@/components/features/products/related-products';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Info, Truck, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// This would normally fetch from our backend
const getProduct = async (id: string) => {
  // Mock mock mock
  if (id === 'not-found') return null;
  return {
    id,
    title: 'Premium Organic Coffee Beans',
    slug: id,
    description: 'Our most popular organic blend, sourced from the finest farms in Ethiopia. Perfect for espresso or pour-over with notes of jasmine, bergamot, and blueberry.',
    price: 24.99,
    comparePrice: 29.99,
    images: [
      'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    category: { name: 'Coffee Beans', slug: 'coffee-beans' },
    rating: 4.8,
    reviewCount: 124,
    featured: true,
  };
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

  // Mock related products
  const related = Array.from({ length: 4 }).map((_, i) => ({
    id: `related-${i}`,
    title: `Similar Blend ${i + 1}`,
    slug: `similar-blend-${i + 1}`,
    description: 'A great alternative coffee.',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80'],
    stock: 10,
    categoryId: 'cat-1',
    category: { name: 'Coffee Beans', slug: 'coffee-beans' },
    rating: 4.5,
    reviewCount: 30,
    featured: false,
  }));

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


