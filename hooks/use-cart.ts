import { useCartContext } from '@/components/providers/cart-provider';
import { Product } from '@/hooks/use-products';
import { toast } from 'sonner';

export function useCart() {
  const { state, dispatch } = useCartContext();

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast.success(`${product.title} added to cart!`);
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.info('Item removed from cart.');
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  return {
    items: state.items,
    total: state.total,
    itemCount: state.items.reduce((acc, item) => acc + item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
