import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const CATEGORY_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="dash-tooltip">
      <div className="dash-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="dash-tooltip-row">
          <span className="dash-tooltip-dot" style={{ background: p.color }} />
          <span className="dash-tooltip-name">{p.name}</span>
          <span className="dash-tooltip-value">${Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { products, loading: productsLoading } = useProducts();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [ordersRes, customersRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
    }
    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrders = orders.length;
  const inStock = products.filter(p => p.stock > 0).length;

  const categories = [...new Set(products.map(p => p.category))];
  const categoryData = categories.map((cat) => {
    const count = products.filter(p => p.category === cat).length;
    return { name: cat, value: count };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // Build revenue chart from real orders or show empty state
  const revenueByMonth = {};
  orders.forEach(o => {
    const date = new Date(o.created_at);
    const key = date.toLocaleString('default', { month: 'short' });
    revenueByMonth[key] = (revenueByMonth[key] || 0) + Number(o.total || 0);
  });
  const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }));

  const topProducts = products.slice(0, 5);

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 7l7-4 7 4-7 4-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 11l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 15l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      color: '#6366f1', bg: '#eef0ff',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="4" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 9h6M8 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
      color: '#10b981', bg: '#ecfdf5',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 17l4-5 4 3 4-6 4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
      color: '#3b82f6', bg: '#eff6ff',
    },
    {
      label: 'In Stock',
      value: inStock,
      icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/></svg>,
      color: '#f59e0b', bg: '#fffbeb',
    },
  ];

  return (
    <div className="dash">
      {/* Stats Grid */}
      <div className="dash-stats">
        {stats.map((s) => (
          <div key={s.label} className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="dash-stat-info">
              <div className="dash-stat-label">{s.label}</div>
              <div className="dash-stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="dash-charts-row">
        {/* Revenue Chart */}
        <div className="dash-card dash-card--chart">
          <div className="dash-card-header">
            <div className="dash-card-title-row">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="8" width="3" height="7" rx="1" fill="#6366f1" opacity="0.3"/><rect x="7.5" y="5" width="3" height="10" rx="1" fill="#6366f1" opacity="0.6"/><rect x="13" y="3" width="3" height="12" rx="1" fill="#6366f1"/></svg>
              <h2>Sales Revenue</h2>
            </div>
          </div>
          <div className="dash-chart-container">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3b4', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3b4', fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="dash-empty-chart">
                <p>Revenue data will appear here as orders come in.</p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Donut */}
        <div className="dash-card dash-card--categories">
          <div className="dash-card-header">
            <h2>Top Categories</h2>
            <Link to="/admin/products" className="dash-card-action">See All</Link>
          </div>
          {categoryData.length > 0 ? (
            <>
              <div className="dash-donut-container">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270} paddingAngle={3}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="dash-donut-center">
                  <div className="dash-donut-total">{totalProducts}</div>
                  <div className="dash-donut-label">Products</div>
                </div>
              </div>
              <div className="dash-category-list">
                {categoryData.map((cat, i) => (
                  <div key={cat.name} className="dash-category-item">
                    <span className="dash-category-dot" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                    <span className="dash-category-name">{cat.name}</span>
                    <span className="dash-category-count">{cat.value}</span>
                    <span className="dash-category-pct">{totalProducts ? Math.round((cat.value / totalProducts) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="dash-empty-chart">
              <p>Category data will appear once products are added.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dash-bottom-row">
        {/* Recent Orders */}
        <div className="dash-card dash-card--activity">
          <div className="dash-card-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="dash-card-action">See All</Link>
          </div>
          <div className="dash-activity-list">
            {orders.length > 0 ? orders.slice(0, 5).map(o => (
              <div key={o.id} className="dash-activity-item">
                <div className="dash-activity-dot" style={{ background: o.payment_status === 'paid' ? '#10b981' : o.status === 'pending' ? '#f59e0b' : '#6366f1' }} />
                <div className="dash-activity-info">
                  <div className="dash-activity-title">{o.customer_name || 'Customer'}</div>
                  <div className="dash-activity-desc">{formatCurrency(Number(o.total))} — {o.status}</div>
                </div>
                <div className="dash-activity-time">{new Date(o.created_at).toLocaleDateString()}</div>
              </div>
            )) : (
              <div className="dash-empty-state">
                <p>No orders yet. They will appear here as customers place orders.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="dash-card dash-card--products">
          <div className="dash-card-header">
            <h2>Top Products</h2>
            <Link to="/admin/products" className="dash-card-action">View All</Link>
          </div>
          {topProducts.length > 0 ? (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="dash-product-cell">
                          <div className="dash-product-img" style={{ background: `linear-gradient(135deg, ${CATEGORY_COLORS[0]}22, ${CATEGORY_COLORS[1]}22)` }}>
                            {p.image ? (
                              <img src={p.image} alt="" />
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5l5-3 5 3-5 3-5-3z" stroke="#6366f1" strokeWidth="1.2"/><path d="M3 8l5 3 5-3" stroke="#6366f1" strokeWidth="1.2"/></svg>
                            )}
                          </div>
                          <span className="dash-product-name">{p.name}</span>
                        </div>
                      </td>
                      <td><span className="dash-stock-value">{p.stock}</span></td>
                      <td><span className="dash-price-value">{formatCurrency(p.price)}</span></td>
                      <td><span className="dash-category-badge">{p.category}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dash-empty-state">
              <p>No products yet. Add your first product to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
