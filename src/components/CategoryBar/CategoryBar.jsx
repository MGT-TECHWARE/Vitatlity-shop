import React from 'react';
import categories from '../../data/categories';
import { Icon } from '../icons';
import './CategoryBar.css';

export default function CategoryBar({ active = 'all', onSelect }) {
  return (
    <div className="category-bar">
      <div className="category-bar-inner">
        <div className="category-bar-fade-l" />
        <div className="category-bar-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill${active === cat.id ? ' active' : ''}`}
              onClick={() => onSelect?.(cat.id)}
            >
              <Icon name={cat.icon} />
              {cat.label}
            </button>
          ))}
        </div>
        <div className="category-bar-fade-r" />
      </div>
    </div>
  );
}
