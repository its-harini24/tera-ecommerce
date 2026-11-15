import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Headphones, RotateCcw, Star, ChevronRight, Mail, Check } from 'lucide-react';
import { categories, getBestsellers, getFeaturedKits, getNewArrivals, testimonials } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import HeroElectronicsVisual from '../components/home/HeroElectronicsVisual';
import './HomePage.css';

// ─── Hero Banner ────────────────────────────────────────────────────────────
function HeroBanner() {
  return (
    <section className="hero-section">
      {/* Subtle Background Circuit Trace Grid & Ambient Lights */}
      <div className="hero-bg-circuits" aria-hidden="true" />
      <div className="hero-ambient-glow-left" aria-hidden="true" />
      <div className="hero-ambient-glow-right" aria-hidden="true" />

      <div className="container hero-container">
        {/* Left Column: Text & CTA */}
        <div className="hero-left-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            <span>FOR THE MAKER IN YOU</span>
          </div>

          <h1 className="hero-headline">
            Big ideas.<br />
            Real-world builds.
          </h1>

          <p className="hero-description">
            From your first blinking LED to your next big invention.<br />
            Find the components, kits and know-how to make it real.
          </p>

          <div className="hero-ctas">
            <Link to="/products" className="btn-hero-shop">
              Shop Now <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/products?category=kits" className="btn-hero-kits">
              Explore Kits
            </Link>
          </div>

          {/* Three Trust Indicators */}
          <div className="hero-trust-indicators">
            <div className="hero-trust-item">
              <span className="trust-check-icon">
                <Check size={13} strokeWidth={2.6} />
              </span>
              <span>Tested components</span>
            </div>
            <div className="hero-trust-item">
              <span className="trust-check-icon">
                <Check size={13} strokeWidth={2.6} />
              </span>
              <span>Maker support</span>
            </div>
            <div className="hero-trust-item">
              <span className="trust-check-icon">
                <Check size={13} strokeWidth={2.6} />
              </span>
              <span>Ships across India</span>
            </div>
          </div>
        </div>

        {/* Right Column: Electronics Visuals */}
        <div className="hero-right-visual">
          <HeroElectronicsVisual />
        </div>
      </div>
    </section>
  );
}

// ─── Category Grid ───────────────────────────────────────────────────────────
function CategoryGrid() {
  return (
    <section className="section category-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore 10,000+ components organized for your next build</p>
          </div>
          <Link to="/products" className="view-all-link">
            All Categories <ChevronRight size={15} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="category-card"
            >
              <div className="category-icon-wrap" aria-hidden="true">
                <span className="category-icon">{cat.icon}</span>
              </div>
              <div className="category-text">
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.description}</p>
              </div>
              <span className="category-link-text">
                Explore <ChevronRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bestsellers Section ─────────────────────────────────────────────────────
function BestsellersSection() {
  const bestsellers = getBestsellers().slice(0, 8);
  return (
    <section className="section bestsellers-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Bestselling Products</h2>
            <p className="section-subtitle">Top rated components and dev boards trusted by engineers</p>
          </div>
          <Link to="/products" className="view-all-link">
            View All Products <ChevronRight size={15} />
          </Link>
        </div>
        <div className="products-grid">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promo Banner ────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <section className="section promo-section">
      <div className="container">
        <div className="promo-grid">
          {/* Banner 1: IoT & Microcontrollers Showcase */}
          <div className="promo-card promo-banner-navy">
            <div className="promo-ambient-glow promo-glow-cyan" aria-hidden="true" />
            <div className="promo-content">
              <span className="promo-tag promo-tag-cyan">⚡ Next-Gen Hardware</span>
              <h3 className="promo-title">IoT &amp; Wireless Modules</h3>
              <p className="promo-desc">
                High-range LoRa, dual-core ESP32 &amp; RP2040 microcontrollers in stock and ready to ship.
              </p>
              <Link to="/products?category=modules" className="btn-promo btn-promo-primary">
                Explore Modules <ChevronRight size={15} />
              </Link>
            </div>
            <div className="promo-visual-wrap">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg?width=600"
                alt="ESP32 Development Board"
                className="promo-product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-product.svg';
                }}
              />
              <span className="promo-floating-badge">From ₹249</span>
            </div>
          </div>

          {/* Banner 2: Maker Kits & STEM Bundles */}
          <div className="promo-card promo-banner-navy promo-banner-kits">
            <div className="promo-ambient-glow promo-glow-blue" aria-hidden="true" />
            <div className="promo-content">
              <span className="promo-tag promo-tag-amber">🎒 Maker Special</span>
              <h3 className="promo-title">Complete DIY Starter Kits</h3>
              <p className="promo-desc">
                Up to 30% off on all-in-one Arduino starter bundles, sensor packs &amp; robotics vehicle kits.
              </p>
              <Link to="/products?category=kits" className="btn-promo btn-promo-secondary">
                Shop Kits Sale <ChevronRight size={15} />
              </Link>
            </div>
            <div className="promo-visual-wrap">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Starter_Kit.jpg?width=600"
                alt="Arduino Electronics Starter Kit"
                className="promo-product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-product.svg';
                }}
              />
              <span className="promo-floating-badge promo-badge-discount">Up to 30% OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Featured Kits ───────────────────────────────────────────────────────────
function FeaturedKits() {
  const kits = getFeaturedKits().slice(0, 4);
  return (
    <section className="section featured-kits-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Electronics Kits</h2>
            <p className="section-subtitle">Complete starter kits for robotics, IoT &amp; STEM learning</p>
          </div>
          <Link to="/products?category=kits" className="view-all-link">
            View All Kits <ChevronRight size={15} />
          </Link>
        </div>
        <div className="products-grid">
          {kits.map((kit) => (
            <ProductCard key={kit.id} product={kit} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust Badges ────────────────────────────────────────────────────────────
const trustBadges = [
  { icon: Package, label: '10,000+ Products', desc: 'Massive component catalogue' },
  { icon: Truck, label: 'Fast Delivery', desc: 'Ships within 24 hours' },
  { icon: Headphones, label: 'Expert Support', desc: 'Technical assistance' },
  { icon: RotateCcw, label: 'Easy Returns', desc: '30-day returns' },
];

function TrustBadges() {
  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-grid">
          {trustBadges.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="trust-card">
              <div className="trust-icon-wrap">
                <Icon size={24} className="trust-icon" />
              </div>
              <div className="trust-text">
                <h4 className="trust-label">{label}</h4>
                <p className="trust-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── New Arrivals Section ────────────────────────────────────────────────────
function NewArrivalsSection() {
  const arrivals = getNewArrivals();
  return (
    <section className="section new-arrivals-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">
              Discover newly added dev boards, breakout sensors &amp; IoT modules fresh in stock
            </p>
          </div>
          <Link to="/products" className="view-all-link">
            Explore All New Arrivals <ChevronRight size={15} />
          </Link>
        </div>
        <div className="products-grid">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-header centered">
          <h2 className="section-title">What Our Makers Say</h2>
          <p className="section-subtitle">Trusted by 50,000+ engineers and hobbyists</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < t.rating ? '#F59E0B' : 'none'}
                    color={i < t.rating ? '#F59E0B' : '#CBD5E1'}
                  />
                ))}
              </div>
              <p className="testimonial-comment">"{t.comment}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ──────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-pattern" aria-hidden="true" />
      <div className="container newsletter-content">
        <div className="newsletter-icon-wrap">
          <Mail size={36} className="newsletter-icon" />
        </div>
        <h2 className="newsletter-title">Join 50,000+ Makers</h2>
        <p className="newsletter-subtitle">
          Get exclusive deals, new product alerts, and project inspiration delivered to your inbox.
        </p>
        {subscribed ? (
          <div className="newsletter-success">
            🎉 You're subscribed! Welcome to the TERA community.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        )}
        <p className="newsletter-note">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

// ─── HomePage (root) ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="home-page">
      <HeroBanner />
      <TrustBadges />
      <CategoryGrid />
      <BestsellersSection />
      <NewArrivalsSection />
      <PromoBanner />
      <FeaturedKits />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
