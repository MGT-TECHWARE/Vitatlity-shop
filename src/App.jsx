import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/Admin/AdminRoute';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import ProductNew from './pages/admin/ProductNew';
import ProductEdit from './pages/admin/ProductEdit';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import AdminCategories from './pages/admin/Categories';
import CheckoutSuccess from './pages/CheckoutSuccess';
import './App.css';

export default function App() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin (protected) */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductNew />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
