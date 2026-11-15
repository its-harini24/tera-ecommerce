import { createContext, useContext } from 'react';

export const CartContext = createContext(null);

export const COUPONS = {
  TERA10: 0.10,
  SAVE20: 0.20,
  NEWUSER: 0.15,
};

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      const stockLimit = typeof action.payload.stock === 'number' ? action.payload.stock : 100;
      if (existingIndex >= 0) {
        const currentQty = state.items[existingIndex].quantity || 1;
        const addQty = action.payload.quantity || 1;
        const newQty = Math.min(stockLimit, currentQty + addQty);
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return { ...state, items: updated };
      }
      const initialQty = Math.min(stockLimit, action.payload.quantity || 1);
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: initialQty }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.find(item => item.id === action.payload.id)) return state;
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'TOGGLE_WISHLIST': {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartWishlistProvider');
  return ctx;
}

export default CartContext;
