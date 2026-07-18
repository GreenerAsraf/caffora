import { useCartContext } from '@/components/providers/cart-provider';
import { Product } from '@/types';
import { toast } from 'sonner';
import { cartApi } from '@/lib/api';
import { useAuth } from '@/components/providers/auth-provider';

export function useCart() {
  const { state, dispatch } = useCartContext();
  const { accessToken, status } = useAuth();

  const addItem = async (product: Product, quantity = 1) => {
    try {
      if (status === 'authenticated' && accessToken) {
        // Optimistic update
        dispatch({ type: 'ADD_ITEM', payload: { id: product.id, product, quantity } });
        
        // Sync to server
        const updatedCart = await cartApi.addItem(product.id, quantity, accessToken);
        // We could re-sync state here if needed, but optimistic update is usually fine
      } else {
        dispatch({ type: 'ADD_ITEM', payload: { id: product.id, product, quantity } });
      }
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error(error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      if (status === 'authenticated' && accessToken) {
        // For authenticated users, the ID should be the cartItem ID.
        // If it's a guest product ID, we need to find the correct cart item ID.
        const item = state.items.find(i => i.id === id || i.product.id === id);
        if (item && item.id && !item.id.startsWith('prod-')) {
           await cartApi.removeItem(item.id, accessToken);
        }
      }
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      toast.info('Item removed from cart.');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error(error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (status === 'authenticated' && accessToken) {
        const item = state.items.find(i => i.id === id || i.product.id === id);
        if (item && item.id && !item.id.startsWith('prod-')) {
           await cartApi.updateItem(item.id, quantity, accessToken);
        }
      }
      dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      if (status === 'authenticated' && accessToken) {
        await cartApi.clear(accessToken);
      }
      dispatch({ type: 'CLEAR' });
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error(error);
    }
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
