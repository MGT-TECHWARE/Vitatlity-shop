import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useCategories } from '../../context/CategoriesContext';
import { formatCurrency } from '../../utils/formatCurrency';
import './Products.css';

export default function AdminProducts() {
  const { products, deleteProduct } = useProducts();
  const { categories: dbCategories } = useCategories();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const categoryLabel = useMemo(() => {
    const map = {};
    dbCategories.forEach(c => { map[c.slug] = c.name; });
    return map;
  }, [dbCategories]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ['all', ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    if (catFilter !== 'all') {
      list = list.filter(p => p.category === catFilter);
    }
    return list;
  }, [products, search, catFilter]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
    setConfirmDelete(null);
  };

  return (
    <div className="ap">
      <div className="ap-toolbar">
        <div className="ap-toolbar-left">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ap-search"
          />
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="ap-filter-select">
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : (categoryLabel[c] || c)}</option>
            ))}
          </select>
        </div>
        <Link to="/admin/products/new" className="ap-add-btn">+ Add Product</Link>
      </div>

      <div className="ap-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>

      <div className="ap-table-card">
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="ap-product-cell">
                      {p.image && <img src={p.image} alt="" className="ap-product-thumb" />}
                      <div>
                        <div className="ap-product-name">{p.name}</div>
                        <div className="ap-product-brand">{p.sku || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="ap-cat-badge">{categoryLabel[p.category] || p.category}</span></td>
                  <td className="ap-price-cell">{formatCurrency(p.price)}</td>
                  <td>
                    <span className={p.stock > 0 ? '' : 'ap-out-of-stock'}>{p.stock}</span>
                  </td>
                  <td>
                    <span className={`ap-status ${p.status === 'active' ? 'ap-status--in' : 'ap-status--out'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="ap-actions">
                      <Link to={`/admin/products/${p.id}/edit`} className="ap-action-btn ap-action-edit">Edit</Link>
                      {confirmDelete === p.id ? (
                        <div className="ap-confirm-delete">
                          <button className="ap-action-btn ap-action-confirm" onClick={() => handleDelete(p.id)}>Yes</button>
                          <button className="ap-action-btn ap-action-cancel" onClick={() => setConfirmDelete(null)}>No</button>
                        </div>
                      ) : (
                        <button className="ap-action-btn ap-action-delete" onClick={() => setConfirmDelete(p.id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="ap-empty">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
