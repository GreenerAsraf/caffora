import { ProductCard } from '@/components/cards/product-card';
import { Product } from '@/hooks/use-products';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products?.length) return null;

  return (
    <div className="mt-24">
      <h2 className="text-3xl font-playfair font-bold text-center mb-10">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
