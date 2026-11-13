import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './components.css';

/**
 * Breadcrumb navigation component.
 *
 * Usage:
 *   <Breadcrumb
 *     items={[
 *       { label: 'Home', href: '/' },
 *       { label: 'Microcontrollers', href: '/products?category=microcontrollers' },
 *       { label: 'Arduino Uno R3' },   // last item — no href needed
 *     ]}
 *   />
 */
const Breadcrumb = ({ items = [], showHome = true }) => {
  const allItems = showHome
    ? [{ label: 'Home', href: '/', icon: true }, ...items]
    : items;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li
              key={index}
              className={`breadcrumb__item${isLast ? ' breadcrumb__item--active' : ''}`}
            >
              {!isLast && item.href ? (
                <Link to={item.href} className="breadcrumb__link">
                  {item.icon ? <Home size={14} /> : null}
                  {item.icon ? <span className="sr-only">{item.label}</span> : item.label}
                </Link>
              ) : (
                <span className="breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight
                  size={14}
                  className="breadcrumb__separator"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
