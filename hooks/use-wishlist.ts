import { useState, useEffect } from 'react';
import { Product } from '@/hooks/use-products';
import { toast } from 'sonner';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('caffora-wishlist');
      if (stored) setWishlist(JSON.parse(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('caffora-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.info(`${product.title} removed from wishlist.`);
    } else {
      setWishlist([...wishlist, product]);
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return { wishlist, toggleWishlist, isInWishlist };
}
