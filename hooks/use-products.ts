import { useState, useEffect } from 'react';

// Mock product type (should be imported from a shared types folder later)
export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  categoryId: string;
  category: { name: string };
  rating: number;
  reviewCount: number;
  featured?: boolean;
};

// Mock data until backend is fully hooked up
const MOCK_PRODUCTS: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `prod-${i}`,
  title: `Premium Coffee Blend ${i + 1}`,
  slug: `premium-coffee-blend-${i + 1}`,
  description: 'A rich and smooth coffee blend for your morning routine.',
  price: 19.99 + i,
  comparePrice: i % 3 === 0 ? 24.99 + i : undefined,
  images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80'],
  stock: 100,
  categoryId: 'cat-1',
  category: { name: 'Coffee Beans' },
  rating: 4 + (i % 2) * 0.5,
  reviewCount: 42 + i * 5,
  featured: i === 0,
}));

export function useProducts(params: Record<string, string | number | undefined>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (!active) return;
      
      let result = [...MOCK_PRODUCTS];

      if (params.q) {
        const query = String(params.q).toLowerCase();
        result = result.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }

      if (params.category) {
        result = result.filter(p => p.categoryId === params.category);
      }

      setProducts(result);
      setLoading(false);
    }, 500);

    return () => {
      active = false;
    };
  }, [params.q, params.category, params.sort, params.page]);

  return { products, loading };
}
