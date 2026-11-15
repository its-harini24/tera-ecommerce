import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Package,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './CartPage.css';

const QUICK_CATEGORIES = [
  { label: 'Microcontrollers', path: '/products?category=microcontrollers' },
  { label: 'Sensors', path: '/products?category=sensors' },
  { label: 'Modules', path: '/products?category=modules' },
  { label: 'DIY Kits', path: '/products?category=kits' },
  { label: 'Tools', path: '/products?category=tools' },
];

export default function CartPage() {
  const {
    cart,
    cartTotal,
    cartDispatch,
    appliedCoupon,
    discountRate,
    discountAmount,
    shippingFee,
    taxAmount,
    grandTotal,
    applyCoupon: applyCouponCtx,
    removeCoupon: removeCouponCtx,
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const FREE_SHIPPING_THRESHOLD = 999;
  const shippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const updateQty = (id, qty) => {
    cartDispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: qty } });
  };

  const removeItem = (id, name) => {
    cartDispatch({ type: 'REMOVE_FROM_CART', payload: id });
    if (showToast) {
      showToast(name ? `Removed ${name} from cart` : 'Item removed from cart', 'info');
    }
  };

  const clearCart = () => {
    cartDispatch({ type: 'CLEAR_CART' });
    removeCouponCtx();
    if (showToast) {
      showToast('Cart cleared', 'info');
    }
  };

  const handleApplyCoupon = () => {
    const res = applyCouponCtx(couponInput);
    if (res.success) {
      setCouponError('');
      if (showToast) {
        showToast(`Coupon ${res.code} applied successfully!`, 'success');
      }
    } else {
      setCouponError(res.error);
    }
  };

  const handleRemoveCoupon = () => {
    removeCouponCtx();
    setCouponInput('');
    setCouponError('');
    if (showToast) {
      showToast('Coupon removed', 'info');
    }
  };

  // ─── Empty Cart State ───────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <nav className="cart-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span>Shopping Cart</span>
          </nav>

          <div className="empty-cart-container">
            <div className="empty-cart-icon-circle" aria-hidden="true">
              <ShoppingCart size={44} />
            </div>
            <h2 className="empty-cart-heading">Your Shopping Cart is Empty</h2>
            <p className="empty-cart-subtext">
              Looks like you haven't added any electronic components, developer boards or DIY kits yet.
              Explore our catalog and find the parts for your next build!
            </p>
            <Link to="/products" className="btn-start-shopping">
              Start Shopping <ArrowRight size={18} />
            </Link>

            <div className="empty-cart-quick-categories">
              <span className="quick-cat-label">Popular Categories:</span>
              {QUICK_CATEGORIES.map((cat) => (
                <Link key={cat.label} to={cat.path} className="quick-cat-pill">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active Cart State ──────────────────────────────────────────────────────
  const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="cart-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="cart-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span>Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="cart-header">
          <h1 className="cart-title">
            Shopping Cart
            <span className="cart-item-count-badge">
              ({totalItemCount} item{totalItemCount !== 1 ? 's' : ''})
            </span>
          </h1>
        </div>

        {/* Free Shipping Progress Banner */}
        <div className={`shipping-progress-banner ${cartTotal >= FREE_SHIPPING_THRESHOLD ? 'success' : ''}`}>
          <div className="shipping-progress-text">
            <Package size={17} />
            {cartTotal < FREE_SHIPPING_THRESHOLD ? (
              <span>
                Add <strong>₹{amountToFreeShipping.toFixed(2)}</strong> more to unlock{' '}
                <strong>FREE Shipping!</strong>
              </span>
            ) : (
              <span>
                🎉 Congratulations! You qualify for <strong>FREE Delivery</strong> across India.
              </span>
            )}
          </div>
          <div className="shipping-meter-track" role="progressbar" aria-valuenow={Math.round(shippingProgress)} aria-valuemin="0" aria-valuemax="100">
            <div className="shipping-meter-fill" style={{ width: `${shippingProgress}%` }} />
          </div>
        </div>

        {/* Cart Main Two-Column Layout */}
        <div className="cart-layout">
          {/* Left Column: Cart Items Card */}
          <div className="cart-items-card">
            {/* Table Header */}
            <div className="cart-table-head" aria-hidden="true">
              <span>Product Details</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <span></span>
            </div>

            {/* Item Rows */}
            <div className="cart-items-list" role="list">
              {cart.map((item) => {
                const itemPrice = item.price || 0;
                const itemQty = item.quantity || 1;
                const itemSubtotal = itemPrice * itemQty;

                return (
                  <div className="cart-item-row" key={item.id} role="listitem">
                    {/* Product Cell */}
                    <div className="cart-product-info-cell">
                      <Link to={`/products/${item.id}`} className="cart-thumb-wrap">
                        <img
                          src={item.image || '/placeholder-product.svg'}
                          alt={item.name}
                          className="cart-thumb-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-product.svg';
                          }}
                        />
                      </Link>
                      <div className="cart-details">
                        {item.category && (
                          <span className="cart-category-tag">{item.category}</span>
                        )}
                        <Link to={`/products/${item.id}`} className="cart-item-title" title={item.name}>
                          {item.name}
                        </Link>
                        <span className="cart-stock-status">✓ In Stock</span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="cart-unit-price">
                      ₹{itemPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    {/* Quantity Controls */}
                    <div className="cart-qty-ctrl-wrap">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, itemQty - 1)}
                        disabled={itemQty <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="cart-qty-number" aria-label={`Quantity: ${itemQty}`}>
                        {itemQty}
                      </span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, itemQty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="cart-item-subtotal">
                      ₹{itemSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    {/* Remove Action Button */}
                    <button
                      type="button"
                      className="cart-remove-action-btn"
                      onClick={() => removeItem(item.id, item.name)}
                      title="Remove item from cart"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="cart-footer-actions">
              <Link to="/products" className="btn-continue-shopping">
                ← Continue Shopping
              </Link>
              <button type="button" className="btn-clear-cart" onClick={clearCart}>
                <Trash2 size={14} /> Clear Cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <aside className="cart-summary-sidebar" aria-label="Order summary">
            <h2 className="summary-heading">Order Summary</h2>

            <div className="summary-details-list">
              <div className="summary-line-item">
                <span>Subtotal ({totalItemCount} item{totalItemCount !== 1 ? 's' : ''})</span>
                <span>₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-line-item discount-line">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="summary-line-item">
                <span>Estimated Shipping</span>
                <span className={shippingFee === 0 ? 'free-badge-text' : ''}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="summary-line-item">
                <span>GST Tax (18%)</span>
                <span>₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="summary-separator" />

              <div className="summary-total-line">
                <span>Total Amount</span>
                <span className="summary-total-amount">
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="coupon-box-wrap">
              {appliedCoupon ? (
                <div className="coupon-applied-badge">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} />
                    <span>
                      <strong>{appliedCoupon}</strong> Applied ({(discountRate * 100).toFixed(0)}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-coupon"
                    onClick={handleRemoveCoupon}
                    title="Remove coupon"
                    aria-label="Remove coupon"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      className="coupon-input-field"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      aria-label="Enter promo coupon code"
                    />
                    <button type="button" className="btn-apply-coupon" onClick={handleApplyCoupon}>
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="coupon-error-msg">{couponError}</p>}
                  <p className="coupon-available-hint">Available: TERA10 (10% off), SAVE20 (20% off)</p>
                </>
              )}
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              type="button"
              className="btn-proceed-checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>

            {/* Trust and Guarantee Perks */}
            <div className="cart-trust-perks">
              <div className="trust-perk-item">
                <ShieldCheck size={16} />
                <span>256-bit SSL Secure Checkout</span>
              </div>
              <div className="trust-perk-item">
                <Truck size={16} />
                <span>Fast Dispatch Within 24 Hours</span>
              </div>
              <div className="trust-perk-item">
                <RotateCcw size={16} />
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
