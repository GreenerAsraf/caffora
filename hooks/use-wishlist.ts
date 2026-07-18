import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';
import { dashboardApi } from '@/lib/api';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { accessToken, status } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (status === 'authenticated' && accessToken) {
      setLoading(true);
      dashboardApi.getWishlist(accessToken)
        .then((res) => {
          if (active && res && res.products) {
            setWishlist(res.products);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch wishlist", err);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else if (status === 'guest') {
      try {
        const stored = localStorage.getItem('caffora-wishlist');
        if (stored) setWishlist(JSON.parse(stored));
      } catch {
        localStorage.removeItem('caffora-wishlist');
      }
    }

    return () => {
      active = false;
    };
  }, [accessToken, status]);

  // Sync to local storage only for guests
  useEffect(() => {
    if (status === 'guest') {
      localStorage.setItem('caffora-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, status]);

  const toggleWishlist = async (product: Product) => {
    // Optimistic update
    const exists = wishlist.some(item => item.id === product.id);
    let newWishlist;
    if (exists) {
      newWishlist = wishlist.filter(item => item.id !== product.id);
      setWishlist(newWishlist);
      toast.info(`${product.title} removed from wishlist.`);
    } else {
      newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      toast.success(`${product.title} added to wishlist!`);
    }

    if (status === 'authenticated' && accessToken) {
      try {
        await dashboardApi.toggleWishlist(product.id, accessToken);
      } catch (err) {
        console.error("Failed to toggle wishlist", err);
        // Rollback optimistic update
        setWishlist(wishlist);
        toast.error("Failed to update wishlist");
      }
    } else if (status === 'guest') {
      localStorage.setItem('caffora-wishlist', JSON.stringify(newWishlist));
    }
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return { wishlist, toggleWishlist, isInWishlist, loading };
}
