import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  ShoppingCart,
  LogOut,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  Phone,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

export default function AccountPage() {
  const { user, isAuthenticated, logout, resetDemoUser, updateAvatar } = useAuth();
  const { cart, wishlist } = useCart();
  const { showToast } = useToast();

  const handleAvatarChange = (gender) => {
    if (updateAvatar) {
      updateAvatar(gender);
      showToast(
        `Profile avatar updated to ${gender === 'female' ? 'Female' : 'Male'}!`,
        'success'
      );
    }
  };

  const handleLogout = () => {
    logout();
    showToast('You have been logged out safely.', 'info');
  };

  const handleLoadDemo = () => {
    resetDemoUser();
    showToast('Loaded demo customer profile: Kavin', 'success');
  };

  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  // Guest State: when user is not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="account-page">
        <div className="account-container">
          <div className="account-guest-card">
            <div className="account-guest-icon">
              <User size={36} />
            </div>
            <h2>Sign in to your TERA Account</h2>
            <p>
              Track your shipments across India, manage saved shipping addresses in Tamil Nadu,
              and sync your hardware components wishlist.
            </p>
            <div className="account-guest-actions">
              <button
                type="button"
                className="auth-submit-btn"
                onClick={handleLoadDemo}
                style={{
                  minWidth: '200px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={16} color="#38BDF8" />
                <span>View Demo as Kavin</span>
              </button>
              <Link
                to="/login"
                className="auth-submit-btn"
                style={{
                  minWidth: '130px',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  borderColor: '#CBD5E1',
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Address data from user or fallback to standard demo address
  const address = user.address || {
    fullName: user.name || 'Kavin',
    addressLine: 'Flat 4B, Kaveri Tech Enclave, 2nd Main Road',
    area: 'Anna Nagar West',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    country: 'India',
    phone: user.phone || '+91 98765 43210',
  };

  const currentGender =
    user.avatarGender ||
    (user.avatar && user.avatar.toLowerCase().includes('female') ? 'female' : 'male');

  const avatarSrc =
    currentGender === 'female'
      ? '/avatar-female.svg'
      : (user.avatar || '/avatar-male.svg');

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Account Banner */}
        <div className="account-banner">
          <div className="account-profile-info">
            <div className="account-avatar-wrapper">
              <div className="account-avatar">
                <img
                  src={avatarSrc}
                  alt={user.name || 'Kavin'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/avatar-male.svg';
                  }}
                />
              </div>
            </div>
            <div className="account-details">
              <h1>{user.name || 'Kavin'}</h1>
              <p>{user.email || 'kavin@example.com'}</p>

              {/* Avatar Selector */}
              <div className="account-avatar-picker" role="radiogroup" aria-label="Select Profile Avatar">
                <span className="account-avatar-picker-label">Avatar:</span>
                <button
                  type="button"
                  className={`account-avatar-choice-btn ${currentGender === 'male' ? 'active' : ''}`}
                  onClick={() => handleAvatarChange('male')}
                  aria-pressed={currentGender === 'male'}
                  title="Select Male Avatar"
                >
                  <img src="/avatar-male.svg" alt="Male Avatar" className="choice-thumb" />
                  <span>Male</span>
                  {currentGender === 'male' && <Check size={12} className="choice-check" />}
                </button>
                <button
                  type="button"
                  className={`account-avatar-choice-btn ${currentGender === 'female' ? 'active' : ''}`}
                  onClick={() => handleAvatarChange('female')}
                  aria-pressed={currentGender === 'female'}
                  title="Select Female Avatar"
                >
                  <img src="/avatar-female.svg" alt="Female Avatar" className="choice-thumb" />
                  <span>Female</span>
                  {currentGender === 'female' && <Check size={12} className="choice-check" />}
                </button>
              </div>

              <span className="account-badge-pill" style={{ marginTop: '10px' }}>
                <ShieldCheck size={14} /> Verified Maker • Chennai, Tamil Nadu
              </span>
            </div>
          </div>

          <button
            type="button"
            className="account-logout-btn"
            onClick={handleLogout}
            aria-label="Log out of account"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="account-metrics-grid">
          <Link to="/products" className="account-metric-card">
            <div className="account-metric-icon">
              <Package size={24} />
            </div>
            <div className="account-metric-content">
              <h3>{user.ordersCount ?? 3}</h3>
              <p>Total Orders Placed</p>
            </div>
          </Link>

          <Link to="/wishlist" className="account-metric-card">
            <div className="account-metric-icon">
              <Heart size={24} />
            </div>
            <div className="account-metric-content">
              <h3>{wishlistCount}</h3>
              <p>Saved in Wishlist</p>
            </div>
          </Link>

          <Link to="/cart" className="account-metric-card">
            <div className="account-metric-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="account-metric-content">
              <h3>{cartCount}</h3>
              <p>Items in Cart</p>
            </div>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="account-content-grid">
          {/* Main Column: Orders & Addresses */}
          <div className="account-main-col">
            {/* Recent Orders Section */}
            <div className="account-section-card">
              <h2>
                <Package size={20} color="#3B82F6" />
                <span>Recent Orders</span>
              </h2>

              <div className="account-order-item">
                <div className="account-order-meta">
                  <span className="account-order-id">Order #TERA-89421</span>
                  <span className="account-order-date">
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Placed on Nov 10, 2026 • 3 items • ₹1,480
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Shipped to: Anna Nagar West, Chennai, Tamil Nadu - 600040
                  </span>
                </div>
                <span className="account-order-status account-order-status--delivered">
                  Delivered
                </span>
              </div>

              <div className="account-order-item">
                <div className="account-order-meta">
                  <span className="account-order-id">Order #TERA-87204</span>
                  <span className="account-order-date">
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Placed on Oct 28, 2026 • 1 item • ₹650
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Shipped to: Anna Nagar West, Chennai, Tamil Nadu - 600040
                  </span>
                </div>
                <span className="account-order-status account-order-status--delivered">
                  Delivered
                </span>
              </div>

              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Link
                  to="/products"
                  className="auth-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Browse Hardware Catalog <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Saved Shipping Addresses */}
            <div className="account-section-card">
              <h2>
                <MapPin size={20} color="#3B82F6" />
                <span>Default Shipping Address (Tamil Nadu)</span>
              </h2>

              <div
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '18px',
                  fontSize: '13.5px',
                  lineHeight: '1.7',
                  color: '#334155',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>
                    {address.fullName}
                  </strong>
                  <span
                    style={{
                      fontSize: '11px',
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontWeight: 600,
                    }}
                  >
                    Primary Address
                  </span>
                </div>
                <div>{address.addressLine}</div>
                <div>{address.area}</div>
                <div>
                  <strong>{address.city}</strong>, {address.state} -{' '}
                  <strong style={{ color: '#0F172A' }}>{address.pincode}</strong>
                </div>
                <div>{address.country}</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    color: '#0F172A',
                    fontWeight: 500,
                  }}
                >
                  <Phone size={14} color="#3B82F6" />
                  <span>{address.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Profile Details */}
          <div className="account-side-col">
            <div className="account-section-card">
              <h2>
                <User size={20} color="#3B82F6" />
                <span>Customer Profile</span>
              </h2>

              <div className="account-info-row">
                <span className="account-info-label">Customer Name</span>
                <span className="account-info-value">{user.name || 'Kavin'}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Avatar Choice</span>
                <div className="account-info-avatar-select">
                  <button
                    type="button"
                    className={`avatar-toggle-pill ${currentGender === 'male' ? 'active' : ''}`}
                    onClick={() => handleAvatarChange('male')}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={`avatar-toggle-pill ${currentGender === 'female' ? 'active' : ''}`}
                    onClick={() => handleAvatarChange('female')}
                  >
                    Female
                  </button>
                </div>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Email</span>
                <span className="account-info-value">{user.email || 'kavin@example.com'}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Phone</span>
                <span className="account-info-value">{user.phone || '+91 98765 43210'}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">City & State</span>
                <span className="account-info-value">
                  {user.city || 'Chennai'}, {user.state || 'Tamil Nadu'}
                </span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Country</span>
                <span className="account-info-value">{user.country || 'India'}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Currency</span>
                <span className="account-info-value" style={{ color: '#15803D' }}>
                  {user.currency || 'INR (₹)'}
                </span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Account Type</span>
                <span className="account-info-value">Maker / Prototyper</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Member Since</span>
                <span className="account-info-value">{user.memberSince || 'August 2026'}</span>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={handleLogout}
                  style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
