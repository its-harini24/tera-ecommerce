import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import teraLogo from '../../assets/tera-logo.png';
import './index.css';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// 4 main footer sections: Quick Links, Customer Support, Categories, About TERA
const FOOTER_SECTIONS = [
  {
    id: 'quick-links',
    title: 'Quick Links',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'Featured Kits', to: '/products?category=Kits' },
      { label: 'Bestsellers', to: '/products' },
      { label: 'Track Order', to: '/track' },
      { label: 'Returns & Refunds', to: '/returns' },
    ],
  },
  {
    id: 'support',
    title: 'Customer Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Shipping Info', to: '/shipping' },
      { label: 'Returns & Exchanges', to: '/returns' },
      { label: 'Order Tracking', to: '/track' },
    ],
    contact: {
      email: 'hello@tera.in',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
    },
  },
  {
    id: 'categories',
    title: 'Categories',
    links: [
      { label: 'Microcontrollers', to: '/products?category=Microcontrollers' },
      { label: 'Sensors', to: '/products?category=Sensors' },
      { label: 'Modules', to: '/products?category=Modules' },
      { label: 'Displays', to: '/products?category=Displays' },
      { label: 'DIY Kits', to: '/products?category=Kits' },
    ],
  },
  {
    id: 'about',
    title: 'About TERA',
    links: [
      { label: 'About TERA', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Press & Media', to: '/press' },
    ],
  },
];

const SOCIAL = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com' },
  { icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com' },
  { icon: YoutubeIcon, label: 'YouTube', href: 'https://youtube.com' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="tera-footer">
      {/* Newsletter Strip */}
      <div className="tera-footer__newsletter">
        <div className="tera-footer__container">
          <div className="tera-newsletter__content">
            <div className="tera-newsletter__text">
              <h3>Stay in the loop</h3>
              <p>Get the latest products, project ideas &amp; exclusive deals delivered to your inbox.</p>
            </div>
            {subscribed ? (
              <div className="tera-newsletter__success">
                ✅ You're subscribed! Check your inbox.
              </div>
            ) : (
              <form className="tera-newsletter__form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email for newsletter"
                />
                <button type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="tera-footer__body">
        <div className="tera-footer__container tera-footer__grid">
          {/* Brand Column */}
          <div className="tera-footer__brand">
            <Link to="/" className="tera-logo-link tera-logo-link--footer" aria-label="TERA Home">
              <img src={teraLogo} alt="TERA" className="tera-logo-img tera-logo-img--footer" />
            </Link>
            <p className="tera-footer__tagline">Your electronics partner</p>
            <p className="tera-footer__desc">
              Empowering makers, engineers &amp; students with quality components and unbeatable service.
            </p>
            <div className="tera-footer__social">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="tera-social-btn"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Accordion / Column Links */}
          {FOOTER_SECTIONS.map((section) => {
            const isOpen = Boolean(openSections[section.id]);
            return (
              <div
                key={section.id}
                className={`tera-footer__col tera-footer__col--accordion ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="tera-footer__col-heading tera-footer__accordion-btn"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={`footer-section-${section.id}`}
                >
                  <span>{section.title}</span>
                  <ChevronDown className="tera-footer__chevron" size={16} />
                </button>

                <div
                  id={`footer-section-${section.id}`}
                  className="tera-footer__accordion-content"
                >
                  <ul className="tera-footer__col-list">
                    {section.links.map(({ label, to }) => (
                      <li key={label}>
                        <Link to={to} className="tera-footer__link">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {section.contact && (
                    <ul className="tera-footer__col-list tera-footer__contact-list">
                      <li>
                        <Mail size={14} />
                        <a href={`mailto:${section.contact.email}`} className="tera-footer__link">
                          {section.contact.email}
                        </a>
                      </li>
                      <li>
                        <Phone size={14} />
                        <a href="tel:+919876543210" className="tera-footer__link">
                          {section.contact.phone}
                        </a>
                      </li>
                      <li>
                        <MapPin size={14} />
                        <span>{section.contact.location}</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="tera-footer__bottom">
        <div className="tera-footer__container tera-footer__bottom-inner">
          <p className="tera-footer__copyright">
            © {new Date().getFullYear()} TERA Electronics. All rights reserved.
          </p>
          <div className="tera-footer__payments">
            <span className="tera-payment-badge">VISA</span>
            <span className="tera-payment-badge">Mastercard</span>
            <span className="tera-payment-badge">UPI</span>
            <span className="tera-payment-badge">COD</span>
          </div>
          <div className="tera-footer__legal">
            <Link to="/privacy" className="tera-footer__link">Privacy</Link>
            <Link to="/terms" className="tera-footer__link">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
