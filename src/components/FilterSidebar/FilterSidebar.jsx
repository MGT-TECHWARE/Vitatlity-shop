import React from 'react';
import { IconX } from '../icons';
import './FilterSidebar.css';

export default function FilterSidebar({ filters, onChange, onClose }) {
  const setFilter = (key, value) => onChange({ ...filters, [key]: value });

  const clearAll = () => onChange({ priceMin: '', priceMax: '' });

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-inner">
        <div className="filter-sidebar-header">
          <span className="filter-sidebar-title">Filters</span>
          <button className="filter-sidebar-close" onClick={onClose} aria-label="Close filters">
            <IconX width={16} height={16} />
          </button>
        </div>

        <div className="filter-group">
          <div className="filter-group-label">Price Range</div>
          <div className="filter-price-inputs">
            <input
              type="number"
              className="filter-price-input"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => setFilter('priceMin', e.target.value)}
              min="0"
            />
            <span className="filter-price-sep">—</span>
            <input
              type="number"
              className="filter-price-input"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => setFilter('priceMax', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <button className="filter-clear" onClick={clearAll}>Clear All Filters</button>
      </div>
    </aside>
  );
}
