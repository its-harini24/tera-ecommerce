/* eslint-disable react-refresh/only-export-components */
// Barrel re-export – keeps any stale HMR or source-map reference to
// CartContext.jsx from causing a 404.  All logic lives in CartContext.js.
export {
  CartContext,
  COUPONS,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  cartReducer,
  wishlistReducer,
  useCart,
  default,
} from './CartContext.js';
