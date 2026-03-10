import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { getCartTotal, getCartCount } from '../utils/cartHelpers';

const CartContext = createContext(null);

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items
          .map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: Math.max(0, action.payload.quantity) }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(
    () => ({
      cartItems: state.items,
      cartCount: getCartCount(state.items),
      cartTotal: getCartTotal(state.items),
      dispatch,
    }),
    [state.items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
