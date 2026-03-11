import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

export default function AdminLayout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('admin-theme') || 'light');

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <div className="admin" data-theme={theme}>
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader theme={theme} toggleTheme={toggleTheme} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
