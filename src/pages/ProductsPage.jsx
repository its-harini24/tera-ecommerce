import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [ratingFilters, setRatingFilters] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const categoryParam = searchParams.get('category') || '';
  const qParam = searchParams.get('q') || searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(qParam);
  const [prevQParam, setPrevQParam] = useState(qParam);

  // Synchronize local search input when URL query changes (render-phase state adjustment per React guidelines)
  if (prevQParam !== qParam) {
    setPrevQParam(qParam);
    setLocalSearch(qParam);
  }

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      params.set('q', localSearch.trim());
      params.delete('search');
    } else {
      params.delete('q');
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleRatingFilter = (val) => {
    setRatingFilters(prev =>
      prev.includes(val) ? prev.filter(r => r !== val) : [...prev, val]
    );
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceMin('');
    setPriceMax('');
    setRatingFilters([]);
    setInStockOnly(false);
    setLocalSearch('');
    setSortBy('featured');
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter (case-insensitive for both category ID and category name)
    if (categoryParam) {
      const catLower = categoryParam.toLowerCase();
      result = result.filter(p => p.category.toLowerCase() === catLower);
    }

    // Search filter
    if (qParam) {
      const q = qParam.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    if (priceMin !== '') {
      result = result.filter(p => p.price >= parseFloat(priceMin));
    }
    if (priceMax !== '') {
      result = result.filter(p => p.price <= parseFloat(priceMax));
    }

    // Rating filter
    if (ratingFilters.length > 0) {
      const minRating = Math.min(...ratingFilters);
      result = result.filter(p => p.rating >= minRating);
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [categoryParam, qParam, priceMin, priceMax, ratingFilters, inStockOnly, sortBy]);

  const activeCategory = categories.find(
    c => c.id.toLowerCase() === categoryParam.toLowerCase() || c.name.toLowerCase() === categoryParam.toLowerCase()
  );
  const activeCategoryName = activeCategory ? activeCategory.name : (categoryParam || null);
  const hasActiveFilters = categoryParam || qParam || priceMin || priceMax || ratingFilters.length > 0 || inStockOnly;

  return (
    <div className="products-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="products-breadcrumb-wrap">
          <Breadcrumb
            items={
              activeCategoryName
                ? [
                    { label: 'Products', href: '/products' },
                    { label: activeCategoryName },
                  ]
                : [{ label: 'All Products' }]
            }
          />
        </div>

        {/* Top Header & Controls Bar */}
        <div className="products-top-bar">
          <div className="products-title-group">
            <h1 className="products-title">
              {activeCategoryName || (qParam ? `Search: "${qParam}"` : 'All Electronic Components')}
            </h1>
            <span className="products-count-badge">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="products-controls-group">
            {/* Inline Compact Search */}
            <form className="compact-search-form" onSubmit={handleSearchSubmit}>
              <Search size={15} className="compact-search-icon" />
              <input
                type="text"
                placeholder="Filter results..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="compact-search-input"
              />
              {localSearch && (
                <button
                  type="button"
                  className="compact-search-clear"
                  onClick={() => {
                    setLocalSearch('');
                    const params = new URLSearchParams(searchParams);
                    params.delete('q');
                    params.delete('search');
                    setSearchParams(params);
                  }}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </form>

            {/* Sort Select */}
            <div className="sort-select-wrapper">
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="sort-chevron" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              className="filter-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {hasActiveFilters && <span className="filter-active-dot" />}
            </button>
          </div>
        </div>

        {/* Mobile Quick Category Scroll Bar */}
        <div className="mobile-categories-scroll" role="navigation" aria-label="Quick Category Filter">
          <button
            type="button"
            className={`mobile-cat-pill ${!categoryParam ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All Components
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`mobile-cat-pill ${categoryParam.toLowerCase() === cat.id.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              <span className="mobile-cat-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Layout with Sidebar + Product Grid */}
        <div className="products-layout">
          {/* Sidebar */}
          <aside className={`products-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
              <span className="sidebar-title">Filters</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  className="sidebar-close-btn"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Category</h3>
              <div className="filter-options">
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="category"
                    checked={!categoryParam}
                    onChange={() => handleCategoryChange('')}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="filter-radio">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryParam === cat.id}
                      onChange={() => handleCategoryChange(cat.id)}
                    />
                    <span>{cat.icon} {cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <h3 className="filter-title">Price Range (₹)</h3>
              <div className="price-range-inputs">
                <div className="price-input-group">
                  <span className="price-currency">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    min="0"
                    onChange={e => setPriceMin(e.target.value)}
                    className="price-input"
                  />
                </div>
                <span className="price-dash">—</span>
                <div className="price-input-group">
                  <span className="price-currency">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    min="0"
                    onChange={e => setPriceMax(e.target.value)}
                    className="price-input"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
              <h3 className="filter-title">Rating</h3>
              <div className="filter-options">
                {[4, 3].map(rating => (
                  <label key={rating} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={ratingFilters.includes(rating)}
                      onChange={() => handleRatingFilter(rating)}
                    />
                    <span>
                      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                      <span className="rating-label"> {rating}+ Stars</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="filter-section">
              <label className="toggle-label">
                <span className="filter-title" style={{ marginBottom: 0 }}>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="stock-toggle-checkbox"
                />
              </label>
            </div>

            {/* Mobile Sidebar Footer */}
            <div className="sidebar-mobile-footer">
              <button
                type="button"
                className="btn btn--primary btn--block"
                style={{ width: '100%', padding: '10px 16px', fontSize: '13px', fontWeight: 600 }}
                onClick={() => setSidebarOpen(false)}
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </div>
          </aside>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Main Grid Content */}
          <main className="products-main">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No components found</h3>
                <p>Try clearing your filters or searching for another term.</p>
                <button className="btn btn--primary btn--sm" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
