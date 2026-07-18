import { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Product, Category } from '@/types';

export type { Product }; // Re-export for components relying on it

export function useProducts(params: Record<string, string | number | undefined>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Fetch categories once
  useEffect(() => {
    let active = true;
    categoriesApi.list().then((data) => {
      if (active && data) {
        setCategories(data);
      }
    }).catch(console.error);
    return () => { active = false; };
  }, []);

  // Fetch products when params change
  useEffect(() => {
    let active = true;
    setLoading(true);

    // Map frontend params to backend API params
    const apiParams: Record<string, string | number | undefined> = {
      q: params.q,
      category: params.category,
      minPrice: params.minPrice ? Number(params.minPrice) * 100 : undefined, // frontend uses dollars, backend uses cents
      maxPrice: params.maxPrice ? Number(params.maxPrice) * 100 : undefined,
      rating: params.rating,
      sort: params.sort,
      page: params.page,
      limit: params.pageSize,
    };

    productsApi.list(apiParams).then((response) => {
      if (!active) return;
      if (response) {
        setProducts(response.products || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching products:", error);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [params.q, params.category, params.minPrice, params.maxPrice, params.rating, params.sort, params.page, params.pageSize]);

  return { products, loading, pagination, categories };
}
