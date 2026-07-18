'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Product } from '@/types'; // Use centralized Product type
import { cartApi } from '@/lib/api';
import { useAuth } from './auth-provider';

export interface CartItem {
  id: string; // The cart item's unique id (database ID when synced, or productId when local)
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  synced: boolean; // Indicates if the cart has been synced with the backend
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: string; product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string } // itemId or productId
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'INIT'; payload: { items: CartItem[]; synced: boolean } };

const initialState: CartState = {
  items: [],
  total: 0,
  synced: false,
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'INIT':
      return {
        items: action.payload.items,
        total: calculateTotal(action.payload.items),
        synced: action.payload.synced,
      };
    case 'ADD_ITEM': {
      // Find by productId
      const existingIndex = state.items.findIndex(i => i.product.id === action.payload.product.id);
      let newItems = [...state.items];
      
      if (existingIndex >= 0) {
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
          // Keep the server ID if it exists, otherwise use payload id
          id: newItems[existingIndex].id.startsWith('prod-') ? action.payload.id : newItems[existingIndex].id
        };
      } else {
        newItems.push({ 
          id: action.payload.id, 
          product: action.payload.product, 
          quantity: action.payload.quantity 
        });
      }
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }
    case 'REMOVE_ITEM': {
      // payload could be cartItemId or productId
      const newItems = state.items.filter(i => i.id !== action.payload && i.product.id !== action.payload);
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }
    case 'UPDATE_QTY': {
      if (action.payload.quantity <= 0) return state;
      const newItems = state.items.map(i =>
        (i.id === action.payload.id || i.product.id === action.payload.id) 
          ? { ...i, quantity: action.payload.quantity } 
          : i
      );
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }
    case 'CLEAR':
      return { ...initialState, synced: state.synced }; // preserve synced state
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { accessToken, status } = useAuth();
  const initRef = useRef(false);

  // Initial load from local storage
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    try {
      const stored = localStorage.getItem('caffora-cart');
      if (stored) {
        dispatch({ type: 'INIT', payload: { items: JSON.parse(stored), synced: false } });
      }
    } catch {
      localStorage.removeItem('caffora-cart');
    }
  }, []);

  // Sync with backend on auth state change
  useEffect(() => {
    let active = true;

    async function syncCart() {
      if (status === 'guest') {
        // Just rely on local storage
        return;
      }
      
      if (status === 'authenticated' && accessToken && !state.synced) {
        // Skip backend sync for demo users — they don't have real backend sessions
        if (accessToken.startsWith('demo-')) {
          dispatch({ type: 'INIT', payload: { items: state.items, synced: true } });
          return;
        }
        try {
          // Get local items that need to be merged
          const localItems = state.items;
          
          // If we have local items, push them to the server first (Merge strategy)
          if (localItems.length > 0) {
            for (const item of localItems) {
              await cartApi.addItem(item.product.id, item.quantity, accessToken).catch(e => console.error(e));
            }
          }
          
          // Pull fresh cart state from server
          const serverCart = await cartApi.get(accessToken);
          if (!active) return;
          
          if (serverCart && serverCart.items) {
            const mergedItems = serverCart.items.map((i: any) => ({
              id: i.id, // backend cart item id
              product: i.product,
              quantity: i.quantity
            }));
            
            dispatch({ type: 'INIT', payload: { items: mergedItems, synced: true } });
          }
        } catch (error: any) {
          // Gracefully ignore auth errors (stale token) — the auth provider will handle re-auth
          if (error?.status !== 401) {
            console.error("Failed to sync cart", error);
          }
        }
      }
    }

    syncCart();

    return () => {
      active = false;
    };
  }, [status, accessToken, state.synced]); // Note: excluding state.items to avoid infinite loop on merge

  // Persist to local storage whenever items change (as a backup/offline cache)
  useEffect(() => {
    if (initRef.current) {
      localStorage.setItem('caffora-cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
