import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (action.payload.quantity || 1),
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
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

const wishlistReducer = (state, action) => {
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

export function CartWishlistProvider({ children }) {
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [] });
  const [wishlistState, wishlistDispatch] = useReducer(wishlistReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tera-cart');
      if (savedCart) cartDispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      const savedWishlist = localStorage.getItem('tera-wishlist');
      if (savedWishlist) wishlistDispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('tera-cart', JSON.stringify(cartState.items));
  }, [cartState.items]);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('tera-wishlist', JSON.stringify(wishlistState.items));
  }, [wishlistState.items]);

  const cartTotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistState.items.length;

  const isInWishlist = (id) => !!wishlistState.items.find(item => item.id === id);
  const isInCart = (id) => !!cartState.items.find(item => item.id === id);

  const addToCart = (product, quantity = 1) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
  };

  const removeFromCart = (id) => {
    cartDispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id, quantity) => {
    cartDispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const toggleWishlist = (product) => {
    wishlistDispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  return (
    <CartContext.Provider value={{
      cart: cartState.items,
      cartTotal,
      cartCount,
      cartDispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      wishlist: wishlistState.items,
      wishlistCount,
      wishlistDispatch,
      toggleWishlist,
      isInWishlist,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartWishlistProvider');
  return ctx;
}

