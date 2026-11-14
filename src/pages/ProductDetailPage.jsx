import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
} from 'lucide-react';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/common/Breadcrumb';
import StarRating from '../components/common/StarRating';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import './Products.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImg, setSelectedImg] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [mediaSelection, setMediaSelection] = useState({ productId: null, view: 'photo' });
  const [failedModel, setFailedModel] = useState({ productId: null, path: null });

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '16px 0 24px', color: 'var(--gray-600)' }}>
          The product you are looking for does not exist or may have been removed.
        </p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Browse All Products
        </Button>
      </div>
    );
  }

  const {
    name,
    category,
    price,
    originalPrice,
    rating,
    reviewCount,
    image,
    badge,
    stock = 100,
    description,
    specs = {},
  } = product;

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const relatedProducts = products
    .filter((p) => p.category === category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} × ${name} to cart!`, 'success');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      isWishlisted ? `Removed from wishlist` : `Added to wishlist!`,
      isWishlisted ? 'info' : 'success'
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    showToast('Link copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [image || '/placeholder-product.svg'];
  const activeMedia = mediaSelection.productId === product.id ? mediaSelection.view : 'photo';
  const modelFailed = failedModel.productId === product.id && failedModel.path === product.model3d;
  const hasModel = Boolean(product.model3d) && !modelFailed;

  return (
    <div className="product-detail-page">
      <div className="container" style={{ padding: '24px 20px' }}>
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: category.charAt(0).toUpperCase() + category.slice(1), href: `/products?category=${category}` },
            { label: name },
          ]}
        />

        <div className="product-detail-layout">
          {/* Left Column: Product Media */}
          <div className="product-gallery">
            {hasModel && (
              <div className="product-media-toggle" role="group" aria-label="Product media">
                <button
                  type="button"
                  className={`product-media-toggle-btn ${activeMedia === 'photo' ? 'active' : ''}`}
                  aria-pressed={activeMedia === 'photo'}
                  onClick={() => setMediaSelection({ productId: product.id, view: 'photo' })}
                >
                  Photos
                </button>
                <button
                  type="button"
                  className={`product-media-toggle-btn ${activeMedia === 'model' ? 'active' : ''}`}
                  aria-pressed={activeMedia === 'model'}
                  onClick={() => setMediaSelection({ productId: product.id, view: 'model' })}
                >
                  3D &amp; AR
                </button>
              </div>
            )}
            <div className="product-main-image-wrap">
              {activeMedia === 'model' && hasModel ? (
                <model-viewer
                  src={product.model3d}
                  alt={`3D model of ${name}`}
                  poster={image || images[0]}
                  camera-controls
                  auto-rotate
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  className="product-model-viewer"
                  onError={() => {
                    setFailedModel({ productId: product.id, path: product.model3d });
                    setMediaSelection({ productId: product.id, view: 'photo' });
                  }}
                />
              ) : (
                <img
                  src={images[selectedImg] || image || '/placeholder-product.svg'}
                  alt={name}
                  className="product-main-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-product.svg';
                  }}
                />
              )}
              {badge && <span className="product-detail-badge">{badge}</span>}
              {activeMedia === 'model' && (
                <span className="product-model-label">Illustrative model - not to scale</span>
              )}
            </div>
            <div className="product-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`product-thumb-btn ${selectedImg === idx ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedImg(idx);
                    setMediaSelection({ productId: product.id, view: 'photo' });
                  }}
                >
                  <img
                    src={img || '/placeholder-product.svg'}
                    alt={`${name} thumbnail ${idx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-product.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Information */}
          <div className="product-info-panel">
            <div className="product-header-row">
              <span className="product-category-pill">{category}</span>
              <button
                type="button"
                className="btn-share"
                onClick={handleShare}
                title="Share product"
              >
                <Share2 size={16} /> {isCopied ? 'Copied!' : 'Share'}
              </button>
            </div>

            <h1 className="product-title">{name}</h1>

            <div className="product-rating-bar">
              <StarRating rating={rating} reviewCount={reviewCount} size="md" />
              <span className="stock-status in-stock">
                <Check size={14} /> In Stock ({stock} units)
              </span>
            </div>

            <div className="product-price-section">
              <span className="current-price">₹{price.toFixed(2)}</span>
              {originalPrice && (
                <span className="original-price">₹{originalPrice.toFixed(2)}</span>
              )}
              {discountPercent && (
                <Badge variant="danger" size="sm">
                  {discountPercent}% OFF
                </Badge>
              )}
            </div>

            <p className="product-summary">{description}</p>

            {/* Quantity and Actions */}
            <div className="product-action-box">
              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="btn-add-cart"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} /> Add to Cart
              </Button>

              <button
                type="button"
                className={`btn-wishlist-detail ${isWishlisted ? 'wishlisted' : ''}`}
                onClick={handleToggleWishlist}
                aria-label="Toggle wishlist"
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Service & Guarantee Highlights */}
            <div className="product-perks">
              <div className="perk-item">
                <Truck size={18} />
                <div>
                  <strong>Free Express Shipping</strong>
                  <p>On orders above ₹999 across India</p>
                </div>
              </div>
              <div className="perk-item">
                <ShieldCheck size={18} />
                <div>
                  <strong>100% Genuine Components</strong>
                  <p>Direct from verified manufacturers</p>
                </div>
              </div>
              <div className="perk-item">
                <RotateCcw size={18} />
                <div>
                  <strong>7-Day Replacement</strong>
                  <p>Hassle-free replacement for defective items</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs: Specs, Details, Reviews */}
        <div className="product-tabs-section">
          <div className="product-tab-headers">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description &amp; Features
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          <div className="product-tab-content">
            {activeTab === 'specs' && (
              <div className="specs-table-container">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(specs).map(([key, value]) => (
                      <tr key={key}>
                        <td className="spec-name">{key}</td>
                        <td className="spec-value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="description-content">
                <p>{description}</p>
                <h4 style={{ margin: '16px 0 8px' }}>Key Highlights:</h4>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Industrial-grade reliability and tested before dispatch</li>
                  <li>Fully compatible with breadboards, custom PCBs, and standard dev setups</li>
                  <li>Includes access to online datasheets, pinout guides, and sample codes</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-summary">
                <div className="reviews-score-box">
                  <div className="score-number">{rating.toFixed(1)}</div>
                  <StarRating rating={rating} size="lg" />
                  <p>Based on {reviewCount} customer ratings</p>
                </div>
                <div className="mock-reviews-list">
                  <div className="mock-review-card">
                    <div className="review-author">Verified Maker</div>
                    <StarRating rating={5} size="sm" />
                    <p>Excellent quality component, packaged securely with anti-static wrap. Worked on first boot.</p>
                  </div>
                  <div className="mock-review-card">
                    <div className="review-author">Robotics Enthusiast</div>
                    <StarRating rating={4} size="sm" />
                    <p>Accurate specifications, fast shipping. Will definitely reorder for my next prototype.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-header-row">
              <h3>Related Electronics</h3>
              <Link to={`/products?category=${category}`} className="view-more-link">
                View More in {category} →
              </Link>
            </div>
            <div className="products-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
