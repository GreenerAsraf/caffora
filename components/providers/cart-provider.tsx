'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/hooks/use-products';

export interface CartItem {
  id: string; // The cart item's unique id (could just be productId for now)
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'INIT'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  total: 0,
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'INIT':
      return {
        items: action.payload,
        total: calculateTotal(action.payload),
      };
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.payload.product.id);
      let newItems;
      if (existing) {
        newItems = state.items.map(i =>
          i.product.id === action.payload.product.id
            ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
            : i
        );
      } else {
        newItems = [...state.items, { id: action.payload.product.id, product: action.payload.product, quantity: action.payload.quantity || 1 }];
      }
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(i => i.id !== action.payload);
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'UPDATE_QTY': {
      if (action.payload.quantity <= 0) return state;
      const newItems = state.items.map(i =>
        i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
      );
      return { items: newItems, total: calculateTotal(newItems) };
    }
    case 'CLEAR':
      return initialState;
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('caffora-cart');
      if (stored) {
        dispatch({ type: 'INIT', payload: JSON.parse(stored) });
      }
    } catch {
      localStorage.removeItem('caffora-cart');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('caffora-cart', JSON.stringify(state.items));
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

