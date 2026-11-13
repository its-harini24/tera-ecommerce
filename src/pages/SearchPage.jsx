import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import './Products.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredProducts = products.filter((product) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const matchName = product.name.toLowerCase().includes(q);
    const matchCategory = product.category.toLowerCase().includes(q);
    const matchDesc = product.description.toLowerCase().includes(q);
    const matchTags = product.tags?.some((t) => t.toLowerCase().includes(q));
    return matchName || matchCategory || matchDesc || matchTags;
  });

  return (
    <div className="search-page">
      <div className="container" style={{ padding: '24px 20px' }}>
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: `Search: "${query}"` },
          ]}
        />

        <div className="page-header" style={{ margin: '16px 0 24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--gray-900)' }}>
            Search Results for &ldquo;{query}&rdquo;
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '15px' }}>
            Found {filteredProducts.length} matching electronic component{filteredProducts.length === 1 ? '' : 's'}.
          </p>
        </div>

        {filteredProducts.length === 0 ? (
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
              background: 'var(--gray-100)',
              color: 'var(--gray-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Search size={32} />
            </div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>No matching components found</h2>
            <p style={{ color: 'var(--gray-600)', maxWidth: '440px', margin: '0 auto 24px' }}>
              We couldn't find anything matching "{query}". Check your spelling or search for popular terms like "Arduino", "ESP32", "Sensors", or "OLED".
            </p>
            <Link to="/products">
              <Button variant="primary">Browse Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
