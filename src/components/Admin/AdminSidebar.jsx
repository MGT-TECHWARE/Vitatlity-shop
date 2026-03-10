import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const mainNav = [
  {
    to: '/admin', label: 'Dashboard', end: true,
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10.5L10 4l7 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 9.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  },
  {
    to: '/admin/products', label: 'Products',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 6l6-3 6 3-6 3-6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 10l6 3 6-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 14l6 3 6-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  },
  {
    to: '/admin/orders', label: 'Orders',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  },
  {
    to: '/admin/customers', label: 'Customers',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  },
];

const settingsNav = [
  {
    to: '/admin/settings', label: 'Settings',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 3v1.5M10 15.5V17M17 10h-1.5M4.5 10H3M14.95 5.05l-1.06 1.06M6.11 13.89l-1.06 1.06M14.95 14.95l-1.06-1.06M6.11 6.11L5.05 5.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  },
];

export default function AdminSidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <Link to="/admin" className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">N</div>
          <div>
            <div className="admin-sidebar-title">Nexora</div>
            <div className="admin-sidebar-subtitle">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-sidebar-section-label">MAIN</div>
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="admin-sidebar-link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="admin-sidebar-section-label" style={{ marginTop: '24px' }}>SETTINGS</div>
        {settingsNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="admin-sidebar-link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar-store-link">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 9h15M9 1.5c2 2.5 3 5 3 7.5s-1 5-3 7.5M9 1.5c-2 2.5-3 5-3 7.5s1 5 3 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          View Storefront
        </a>
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-user-name">{user?.user_metadata?.full_name || 'Admin'}</div>
            <div className="admin-sidebar-user-email">{user?.email || 'admin@store.com'}</div>
          </div>
          <button className="admin-sidebar-signout" onClick={signOut} title="Sign out">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 6l3 3-3 3M15 9H7M11 3H5a2 2 0 00-2 2v8a2 2 0 002 2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
