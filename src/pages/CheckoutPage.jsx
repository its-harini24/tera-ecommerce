import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import './pages.css';

export default function CheckoutPage() {
  const {
    cart,
    cartTotal,
    cartDispatch,
    appliedCoupon,
    discountAmount,
    shippingFee,
    taxAmount,
    grandTotal,
    removeCoupon,
  } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState(() => ({
    fullName: user?.name || 'Kavin',
    email: user?.email || 'kavin@example.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address?.addressLine ? `${user.address.addressLine}, ${user.address.area}` : 'Flat 4B, Kaveri Tech Enclave, 2nd Main Road, Anna Nagar West',
    city: user?.city || 'Chennai',
    state: user?.state || 'Tamil Nadu',
    pincode: user?.address?.pincode || '600040',
  }));

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [orderNumber, setOrderNumber] = useState('');

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingData.fullName || !shippingData.email || !shippingData.phone || !shippingData.address) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const generatedOrder = 'TERA-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(generatedOrder);
    cartDispatch({ type: 'CLEAR_CART' });
    removeCoupon();
    setStep(3);
    showToast('Order placed successfully!', 'success');
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ margin: '16px 0 24px', color: 'var(--gray-600)' }}>
          You don't have any items to checkout.
        </p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Shop Components
        </Button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-container">
        <Breadcrumb
          items={[
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        {/* Step Indicator */}
        <div className="checkout-steps-bar">
          <div className={`step-node ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Shipping Details</span>
          </div>
          <div className={`step-connector ${step >= 2 ? 'active' : ''}`} />
          <div className={`step-node ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Payment Method</span>
          </div>
          <div className={`step-connector ${step === 3 ? 'active' : ''}`} />
          <div className={`step-node ${step === 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">Order Confirmation</span>
          </div>
        </div>

        {step === 1 && (
          <div className="checkout-two-col">
            <form className="checkout-card" onSubmit={handleShippingSubmit}>
              <h2>1. Delivery Address</h2>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group half">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                  />
                </div>
                <div className="form-group half">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group full">
                  <label>Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat / House no, Building name, Street"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  />
                </div>
                <div className="form-group third">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Bangalore"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  />
                </div>
                <div className="form-group third">
                  <label>State *</label>
                  <input
                    type="text"
                    required
                    placeholder="Karnataka"
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                  />
                </div>
                <div className="form-group third">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="560001"
                    value={shippingData.pincode}
                    onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                  />
                </div>
              </div>
              <div className="checkout-form-actions">
                <Button type="submit" variant="primary" className="btn-submit-step">
                  Proceed to Payment <ArrowRight size={16} />
                </Button>
              </div>
            </form>

            <aside className="order-summary-sidebar">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item-row">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
                {discountAmount > 0 && (
                  <div className="row discount" style={{ color: '#16A34A', fontWeight: 600 }}>
                    <span>Coupon ({appliedCoupon})</span>
                    <span>−₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="row"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span></div>
                <div className="row"><span>GST (18%)</span><span>₹{taxAmount.toFixed(2)}</span></div>
                <div className="row total"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
              </div>
            </aside>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-two-col">
            <form className="checkout-card" onSubmit={handlePlaceOrder}>
              <h2>2. Payment Method</h2>

              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>UPI (Google Pay, PhonePe, Paytm)</strong>
                    <p>Instant contactless payment</p>
                  </div>
                </label>

                {paymentMethod === 'upi' && (
                  <div className="payment-subform">
                    <label>Enter UPI ID / VPA</label>
                    <input
                      type="text"
                      placeholder="username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                )}

                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <p>Visa, MasterCard, RuPay</p>
                  </div>
                </label>

                {paymentMethod === 'card' && (
                  <div className="payment-subform">
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    />
                    <div className="payment-card-inline-inputs">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength="4"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <p>Pay with cash upon receipt</p>
                  </div>
                </label>
              </div>

              <div className="checkout-form-actions">
                <Button variant="outline" onClick={() => setStep(1)} className="btn-back-step">
                  <ArrowLeft size={16} /> Back to Address
                </Button>
                <Button type="submit" variant="primary" className="btn-submit-step">
                  Pay ₹{grandTotal.toFixed(2)} &amp; Place Order
                </Button>
              </div>
            </form>

            <aside className="order-summary-sidebar">
              <h3>Delivery To</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--gray-700)' }}>
                <strong>{shippingData.fullName}</strong><br />
                {shippingData.address}<br />
                {shippingData.city}, {shippingData.state} - {shippingData.pincode}<br />
                Phone: {shippingData.phone}
              </p>
              <div className="summary-totals" style={{ marginTop: '20px' }}>
                <div className="row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
                {discountAmount > 0 && (
                  <div className="row discount" style={{ color: '#16A34A', fontWeight: 600 }}>
                    <span>Coupon ({appliedCoupon})</span>
                    <span>−₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="row"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span></div>
                <div className="row"><span>GST (18%)</span><span>₹{taxAmount.toFixed(2)}</span></div>
                <div className="row total"><span>Total Payable</span><span>₹{grandTotal.toFixed(2)}</span></div>
              </div>
            </aside>
          </div>
        )}

        {step === 3 && (
          <div className="order-success-card">
            <CheckCircle size={64} className="order-success-icon" />
            <h1>Order Confirmed!</h1>
            <p className="order-ref">Order ID: <strong>{orderNumber}</strong></p>
            <p className="order-message">
              Thank you for shopping at TERA. We have sent a confirmation email to <strong>{shippingData.email}</strong>.
              Your components will be packaged with anti-static protection and dispatched within 24 hours.
            </p>
            <div className="order-success-actions">
              <Button variant="primary" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
