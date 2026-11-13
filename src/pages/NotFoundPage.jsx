import { Link } from 'react-router-dom';
import { Cpu, Home } from 'lucide-react';
import Button from '../components/common/Button';
import './pages.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page" style={{
      minHeight: '65vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{
          fontSize: '72px',
          fontWeight: 800,
          color: 'var(--accent)',
          lineHeight: 1,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          4<Cpu size={56} style={{ strokeWidth: 1.5 }} />4
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '12px' }}>
          Circuit Open / Page Not Found
        </h1>
        <p style={{ color: 'var(--gray-600)', marginBottom: '28px', lineHeight: 1.6 }}>
          The page or component you were routing to cannot be reached or does not exist. Let's redirect you back to active circuits.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/">
            <Button variant="primary">
              <Home size={16} /> Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
