import { useReducer, useState, useEffect } from 'react';
import {
  CartContext,
  COUPONS,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  cartReducer,
  wishlistReducer,
} from './CartContext';

export function CartWishlistProvider({ children }) {
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [] });
  const [wishlistState, wishlistDispatch] = useReducer(wishlistReducer, { items: [] });

  // Persistent coupon state shared across Cart and Checkout
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('tera-applied-coupon');
      if (saved && COUPONS[saved.toUpperCase()]) {
        return saved.toUpperCase();
      }
      return null;
    } catch {
      return null;
    }
  });

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

  // Persist coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('tera-applied-coupon', appliedCoupon);
      } else {
        localStorage.removeItem('tera-applied-coupon');
      }
    } catch (e) {
      console.warn('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  // Calculations
  const cartTotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistState.items.length;

  const discountRate = appliedCoupon && COUPONS[appliedCoupon] ? COUPONS[appliedCoupon] : 0;
  const discountAmount = cartTotal > 0 && discountRate > 0 ? Number((cartTotal * discountRate).toFixed(2)) : 0;
  const taxableAmount = Math.max(0, Number((cartTotal - discountAmount).toFixed(2)));
  const shippingFee = cartTotal >= FREE_SHIPPING_THRESHOLD || cartTotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const taxAmount = cartTotal > 0 ? Number((taxableAmount * 0.18).toFixed(2)) : 0;
  const grandTotal = cartTotal > 0 ? Number((taxableAmount + shippingFee + taxAmount).toFixed(2)) : 0;

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

  const applyCoupon = (code) => {
    if (!code || !code.trim()) {
      return { success: false, error: 'Please enter a coupon code.' };
    }
    const upper = code.trim().toUpperCase();
    if (COUPONS[upper]) {
      setAppliedCoupon(upper);
      return { success: true, code: upper, discountRate: COUPONS[upper] };
    }
    return { success: false, error: 'Invalid coupon code. Try TERA10 or SAVE20' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
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
      // Coupon & Calculated Totals (Single Source of Truth)
      appliedCoupon,
      discountRate,
      discountAmount,
      taxableAmount,
      shippingFee,
      taxAmount,
      grandTotal,
      applyCoupon,
      removeCoupon,
      coupons: COUPONS,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartWishlistProvider;
