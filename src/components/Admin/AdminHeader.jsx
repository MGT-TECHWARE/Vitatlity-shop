import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AdminHeader.css';

const titles = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/settings': 'Settings',
};

const subtitles = {
  '/admin': 'Welcome back! Here\'s what\'s happening with your store.',
  '/admin/products': 'Manage your product catalog.',
  '/admin/products/new': 'Create a new product listing.',
  '/admin/orders': 'Track and manage customer orders.',
  '/admin/customers': 'View and manage your customers.',
  '/admin/settings': 'Configure your store preferences.',
};

export default function AdminHeader() {
  const location = useLocation();
  const path = location.pathname;
  const [search, setSearch] = useState('');

  let title = titles[path];
  let subtitle = subtitles[path];
  if (!title) {
    if (path.includes('/products/') && path.includes('/edit')) {
      title = 'Edit Product';
      subtitle = 'Update product information.';
    } else {
      title = 'Admin';
      subtitle = '';
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1 className="admin-header-title">{title}</h1>
        {subtitle && <p className="admin-header-subtitle">{subtitle}</p>}
      </div>
      <div className="admin-header-right">
        <div className="admin-header-search">
          <svg className="admin-header-search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-header-search-input"
          />
          <span className="admin-header-search-shortcut">Ctrl+K</span>
        </div>
        <button className="admin-header-icon-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3a5 5 0 015 5v2.5l1.5 2.5H3.5L5 10.5V8a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="admin-header-badge">3</span>
        </button>
      </div>
    </header>
  );
}
