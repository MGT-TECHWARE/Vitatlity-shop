import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import './Customers.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setCustomers(data);
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="ac">
      <div className="ac-toolbar">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ac-search"
        />
        <span className="ac-count">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="ac-table-card">
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="ac-empty">Loading customers...</td>
                </tr>
              ) : filtered.length > 0 ? filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="ac-name">{c.full_name || 'No name'}</div>
                    <div className="ac-email">{c.email}</div>
                  </td>
                  <td>
                    <span className={`ac-status ${c.role === 'admin' ? 'ac-status--active' : 'ac-status--inactive'}`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="ac-date">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="ac-empty">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
