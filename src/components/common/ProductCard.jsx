import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import StarRating from './StarRating';
import Button from './Button';
import './components.css';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { showToast } = useToast();
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    category,
    image,
    price,
    originalPrice,
    rating,
    reviewCount,
    badge,
    stock = 100,
  } = product;

  const inStock = stock > 0;
  const isWishlisted = wishlist?.some((item) => item.id === id);
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(product, 1);
    setAddedToCart(true);
    showToast(`Added ${name} to cart`, 'success');
    setTimeout(() => setAddedToCart(false), 1200);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isWishlisted ? `Removed from wishlist` : `Added to wishlist`,
      isWishlisted ? 'info' : 'success'
    );
  };

  return (
    <div className="product-card">
      {/* Image Area */}
      <div className="product-card__image-container">
        <Link to={`/products/${id}`} className="product-card__image-link">
          <img
            src={image || '/placeholder-product.svg'}
            alt={name}
            className="product-card__image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.svg';
            }}
          />
        </Link>

        {/* Badge Overlay */}
        {badge && (
          <span className={`product-card__badge product-card__badge--${badge.toLowerCase().replace(/\s+/g, '-')}`}>
            {badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          className={`product-card__wishlist ${isWishlisted ? 'product-card__wishlist--active' : ''}`}
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Out of Stock Ribbon */}
        {!inStock && (
          <div className="product-card__out-of-stock">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="product-card__info">
        {category && (
          <span className="product-card__category">{category}</span>
        )}

        <Link to={`/products/${id}`} className="product-card__name-link" title={name}>
          <h3 className="product-card__name">{name}</h3>
        </Link>

        {/* Rating */}
        <div className="product-card__rating-row">
          <StarRating rating={rating || 0} reviewCount={reviewCount} size="sm" />
        </div>

        {/* Price Row */}
        <div className="product-card__price-row">
          <span className="product-card__price">
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="product-card__original-price">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="product-card__discount">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant={addedToCart ? 'secondary' : 'primary'}
          size="sm"
          className="product-card__cart-btn"
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label={!inStock ? `${name} is out of stock` : `Add ${name} to cart`}
        >
          <ShoppingCart size={14} />
          <span>{!inStock ? 'Out of Stock' : (addedToCart ? 'Added' : 'Add to Cart')}</span>
        </Button>
      </div>
    </div>
  );
}
