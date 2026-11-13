import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import './pages.css';

export default function WishlistPage() {
  const { wishlist, wishlistCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="wishlist-page">
      <div className="container" style={{ padding: '24px 20px' }}>
        <Breadcrumb items={[{ label: 'Wishlist' }]} />

        <div className="page-header" style={{ margin: '16px 0 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--gray-900)' }}>
            My Wishlist ({wishlistCount})
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '15px' }}>
            Saved electronic components, development kits, and prototyping tools.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state-card" style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gray-200)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Heart size={32} />
            </div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--gray-600)', maxWidth: '400px', margin: '0 auto 24px' }}>
              Explore our microcontrollers, sensors, and electronic kits, and click the heart icon to save your favorites.
            </p>
            <Button variant="primary" onClick={() => navigate('/products')}>
              <ShoppingBag size={18} /> Browse Products
            </Button>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
