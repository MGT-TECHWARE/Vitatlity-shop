import React from 'react';
import { useCategories } from '../../context/CategoriesContext';
import { Icon } from '../icons';
import './CategoryBar.css';

export default function CategoryBar({ active = 'all', onSelect }) {
  const { categories, loading } = useCategories();

  const allCategories = [
    { id: 'all', name: 'All Products', slug: 'all', icon: 'grid' },
    ...categories.map(c => ({ ...c, id: c.slug })),
  ];

  if (loading) return null;

  return (
    <div className="category-bar">
      <div className="category-bar-inner">
        <div className="category-bar-fade-l" />
        <div className="category-bar-scroll">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill${active === cat.id ? ' active' : ''}`}
              onClick={() => onSelect?.(cat.id)}
            >
              <Icon name={cat.icon} />
              {cat.name}
            </button>
          ))}
        </div>
        <div className="category-bar-fade-r" />
      </div>
    </div>
  );
}
