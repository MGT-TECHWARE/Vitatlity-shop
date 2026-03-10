import React, { useState, useMemo } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import FilterSidebar from '../FilterSidebar/FilterSidebar';
import { IconFilter } from '../icons';
import './ProductGrid.css';

export default function ProductGrid({ products, activeCategory }) {
  const [sort, setSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ priceMin: '', priceMax: '' });

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.priceMin) list = list.filter((p) => p.price >= Number(filters.priceMin));
    if (filters.priceMax) list = list.filter((p) => p.price <= Number(filters.priceMax));

    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'newest': list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: break;
    }

    // Move out-of-stock items to the end
    list.sort((a, b) => {
      if (a.inStock === b.inStock) return 0;
      return a.inStock ? -1 : 1;
    });

    return list;
  }, [products, sort, filters]);

  return (
    <section className="products-section" id="products">
      <div className="products-inner">
        {showFilters && (
          <FilterSidebar filters={filters} onChange={setFilters} onClose={() => setShowFilters(false)} />
        )}
        <div className="products-main">
          <div className="products-toolbar">
            <div className="products-toolbar-left">
              <div className="products-result-count">
                Showing <strong>{filtered.length}</strong> of {products.length} products
              </div>
            </div>
            <div className="products-toolbar-right">
              <select
                className="products-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <button
                className={`products-filter-toggle${showFilters ? ' active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <IconFilter />
                Filters
              </button>
            </div>
          </div>
          <div className="products-grid">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="products-empty">No products match your filters.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
