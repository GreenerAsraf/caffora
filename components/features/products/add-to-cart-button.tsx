'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(product, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button 
      size="lg" 
      className="flex-1 rounded-full text-base h-14"
      onClick={handleAddToCart}
      disabled={isAdding || product.stock === 0}
    >
      {isAdding ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5 mr-2" />
      )}
      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}
