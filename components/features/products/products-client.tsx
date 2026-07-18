'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Filter, PackageSearch, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { useProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/cards/product-card';
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useWishlist } from '@/hooks/use-wishlist';

export function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedMin = useDebounce(minPrice, 500);
  const debouncedMax = useDebounce(maxPrice, 500);

  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (category !== 'all') params.set('category', category);
    if (debouncedMin) params.set('minPrice', debouncedMin);
    if (debouncedMax) params.set('maxPrice', debouncedMax);
    if (rating !== 'all') params.set('rating', rating);
    if (sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, category, debouncedMin, debouncedMax, rating, sort, page, router]);

  const { products, loading, pagination, categories } = useProducts({
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    rating: searchParams.get('rating') || undefined,
    sort: searchParams.get('sort') || 'newest',
    page,
    pageSize: 8,
  });

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete('page');
    else params.set('page', String(nextPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setRating('all');
    setSort('newest');
    router.push('/products', { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <aside className="w-full shrink-0 space-y-6 md:w-72" aria-label="Product filters">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 flex items-center gap-2 font-medium">
            <Filter className="h-4 w-4" aria-hidden="true" /> Filters
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="category-filter">Category</label>
              <Select value={category} onValueChange={(value) => setCategory(value || 'all')}>
                <SelectTrigger id="category-filter" aria-label="Filter by category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground" htmlFor="min-price">Min price</label>
                <Input id="min-price" inputMode="numeric" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground" htmlFor="max-price">Max price</label>
                <Input id="max-price" inputMode="numeric" placeholder="100" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="rating-filter">Minimum rating</label>
              <Select value={rating} onValueChange={(value) => setRating(value || 'all')}>
                <SelectTrigger id="rating-filter" aria-label="Filter by rating">
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any rating</SelectItem>
                  <SelectItem value="4">4 stars and up</SelectItem>
                  <SelectItem value="3">3 stars and up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="sort-products">Sort by</label>
              <Select value={sort} onValueChange={(value) => setSort(value || 'newest')}>
                <SelectTrigger id="sort-products" aria-label="Sort products">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full" onClick={resetFilters}>Reset filters</Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search products" placeholder="Search products..." className="bg-surface pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {loading ? <ProductGridSkeleton /> : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isWishlisted={isInWishlist(product.id)}
                  onToggleWishlist={() => toggleWishlist(product)}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <p className="text-sm text-muted-foreground">Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} products)</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setPage(pagination.page - 1)} disabled={pagination.page <= 1} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></Button>
                {Array.from({ length: pagination.totalPages }).map((_, index) => (
                  <Button key={index + 1} variant={pagination.page === index + 1 ? 'default' : 'outline'} size="icon" onClick={() => setPage(index + 1)} aria-label={`Page ${index + 1}`}>{index + 1}</Button>
                ))}
                <Button variant="outline" size="icon" onClick={() => setPage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} aria-label="Next page"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState icon={PackageSearch} title="No products found" description="Try a different search term, category, price range, or rating filter." />
        )}
      </main>
    </div>
  );
}
