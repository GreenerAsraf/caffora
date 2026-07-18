import { useState, useEffect } from 'react';

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
  category: { name: string; slug: string };
  rating: number;
  reviewCount: number;
  featured: boolean;
};

const CATEGORIES = [
  { id: 'cat-1', name: 'Coffee Beans', slug: 'coffee-beans' },
  { id: 'cat-2', name: 'Equipment', slug: 'equipment' },
  { id: 'cat-3', name: 'Accessories', slug: 'accessories' },
];

const MOCK_PRODUCTS: Product[] = Array.from({ length: 24 }).map((_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length];
  return {
    id: `prod-${i}`,
    title: `${category.name === 'Coffee Beans' ? 'Premium Coffee Blend' : category.name === 'Equipment' ? 'Precision Brew Kit' : 'Cafe Bar Accessory'} ${i + 1}`,
    slug: `caffora-product-${i + 1}`,
    description: 'A polished Caffora pick built for daily rituals, thoughtful gifting, and reliable home brewing.',
    price: 1899 + i * 250,
    comparePrice: i % 3 === 0 ? 2499 + i * 250 : undefined,
    images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80'],
    stock: 100 - i,
    categoryId: category.id,
    category,
    rating: 3.5 + (i % 4) * 0.4,
    reviewCount: 28 + i * 7,
    featured: i < 4,
  };
});

export function useProducts(params: Record<string, string | number | undefined>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (!active) return;

      let result = [...MOCK_PRODUCTS];

      if (params.q) {
        const query = String(params.q).toLowerCase();
        result = result.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }

      if (params.category) result = result.filter(p => p.categoryId === params.category);

      const minPrice = Number(params.minPrice || 0);
      const maxPrice = Number(params.maxPrice || 0);
      const rating = Number(params.rating || 0);
      const page = Math.max(1, Number(params.page || 1));
      const pageSize = Math.max(1, Number(params.pageSize || 8));

      if (minPrice > 0) result = result.filter(p => p.price >= minPrice * 100);
      if (maxPrice > 0) result = result.filter(p => p.price <= maxPrice * 100);
      if (rating > 0) result = result.filter(p => p.rating >= rating);

      if (params.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
      if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
      if (params.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
      if (params.sort === 'newest') result.sort((a, b) => Number(b.id.split('-')[1]) - Number(a.id.split('-')[1]));

      const total = result.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const currentPage = Math.min(page, totalPages);
      const start = (currentPage - 1) * pageSize;

      setProducts(result.slice(start, start + pageSize));
      setPagination({ page: currentPage, totalPages, total });
      setLoading(false);
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [params.q, params.category, params.minPrice, params.maxPrice, params.rating, params.sort, params.page, params.pageSize]);

  return { products, loading, pagination, categories: CATEGORIES };
}
