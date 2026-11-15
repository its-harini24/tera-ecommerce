import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import teraLogo from '../../assets/tera-logo.png';
import './index.css';

const CATEGORIES = [
  'Microcontrollers',
  'Sensors',
  'Modules',
  'Displays',
  'Power',
  'Tools',
  'Kits',
  'Passives',
];

export default function Navbar() {
  const navigate = useNavigate();
  const { cart, wishlist } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className={`tera-navbar${scrolled ? ' tera-navbar--scrolled' : ''}`}>
      {/* Announcement Bar */}
      <div className="tera-announcement">
        <span>
          🚚 Free shipping on orders over ₹999!&nbsp;&nbsp;|&nbsp;&nbsp;Use code{' '}
          <strong>TERA10</strong> for 10% off
        </span>
      </div>

      {/* Main Nav */}
      <div className="tera-nav-main">
        <div className="tera-nav-container">
          {/* Logo */}
          <Link to="/" className="tera-logo-link" aria-label="TERA Home">
            <img src={teraLogo} alt="TERA" className="tera-logo-img" />
          </Link>

          {/* Search Bar */}
          <form className="tera-search" onSubmit={handleSearch} ref={searchRef}>
            <input
              type="text"
              className="tera-search__input"
              placeholder="Search products, categories, brands…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" className="tera-search__btn" aria-label="Submit search">
              <Search size={18} />
            </button>
          </form>

          {/* Action Icons */}
          <nav className="tera-nav-actions" aria-label="User actions">
            <Link to="/wishlist" className="tera-action-btn" aria-label={`Wishlist (${wishlistCount})`}>
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="tera-badge">{wishlistCount > 99 ? '99+' : wishlistCount}</span>
              )}
            </Link>
            <Link to="/cart" className="tera-action-btn" aria-label={`Cart (${cartCount})`}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="tera-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
            <Link
              to="/account"
              className="tera-action-btn"
              aria-label={user ? `Account (${user.name})` : 'Account'}
            >
              <User size={22} />
              {user && (
                <span
                  className="tera-badge"
                  style={{
                    width: '8px',
                    height: '8px',
                    padding: 0,
                    minWidth: 'unset',
                    background: '#10B981',
                    borderRadius: '50%',
                    top: '6px',
                    right: '6px',
                  }}
                  title={`Logged in as ${user.name}`}
                />
              )}
            </Link>
            <button
              className="tera-action-btn tera-hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="tera-category-nav" aria-label="Product categories">
        <div className="tera-nav-container tera-category-nav__inner">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="tera-category-nav__link"
              onClick={() => setMobileOpen(false)}
            >
              {cat}
            </Link>
          ))}
          <Link to="/products" className="tera-category-nav__link tera-category-nav__link--all">
            All Products <ChevronDown size={14} />
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="tera-mobile-menu" aria-label="Mobile navigation">
          <form className="tera-mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Mobile search"
            />
            <button type="submit" aria-label="Search">
              <Search size={18} />
            </button>
          </form>
          <div className="tera-mobile-links">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="tera-mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <hr className="tera-mobile-divider" />
            <Link to="/wishlist" className="tera-mobile-link" onClick={() => setMobileOpen(false)}>
              Wishlist {wishlistCount > 0 && <span className="tera-badge-inline">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="tera-mobile-link" onClick={() => setMobileOpen(false)}>
              Cart {cartCount > 0 && <span className="tera-badge-inline">{cartCount}</span>}
            </Link>
            <Link to="/account" className="tera-mobile-link" onClick={() => setMobileOpen(false)}>
              {user ? `Account (${user.name})` : 'Sign In / Account'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
