import { Suspense } from 'react';
import { ProductsClient } from '@/components/features/products/products-client';

export const metadata = {
  title: 'Explore Products | Caffora',
  description: 'Browse our premium selection of coffees, teas, and equipment.',
};

export default function ProductsPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-foreground">Explore Products</h1>
          <p className="mt-2 text-muted-foreground">Discover the perfect blend for your taste.</p>
        </div>
        
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading products...</div>}>
          <ProductsClient />
        </Suspense>
      </div>
    </div>
  );
}
