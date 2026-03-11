import React, { useState, useEffect, useMemo } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { formatCurrency } from '../../utils/formatCurrency';
import './Orders.css';

const statusColors = {
  delivered: 'ao-status--completed',
  processing: 'ao-status--processing',
  shipped: 'ao-status--shipped',
  pending: 'ao-status--pending',
  cancelled: 'ao-status--cancelled',
};

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setOrders(data);
    setLoading(false);
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (!error) {
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
    }
    setUpdatingId(null);
  };

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(o => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="ao">
      <div className="ao-toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ao-filter-select">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="ao-count">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="ao-table-card">
        <div className="ao-table-wrap">
          <table className="ao-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="ao-empty">Loading orders...</td>
                </tr>
              ) : filtered.length > 0 ? filtered.map((o) => (
                <tr key={o.id}>
                  <td className="ao-order-id">{o.id.slice(0, 8)}</td>
                  <td>
                    <div className="ao-customer">{o.customer_name}</div>
                    <div className="ao-email">{o.customer_email}</div>
                  </td>
                  <td className="ao-total">{formatCurrency(Number(o.total))}</td>
                  <td>
                    <span className={`ao-status ${o.payment_status === 'paid' ? 'ao-status--completed' : 'ao-status--pending'}`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      disabled={updatingId === o.id}
                      className={`ao-status-select ${statusColors[o.status] || ''}`}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="ao-date">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="ao-empty">No orders yet. Orders will appear here as customers make purchases.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
