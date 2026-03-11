import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useCategories } from '../../context/CategoriesContext';
import { formatCurrency } from '../../utils/formatCurrency';
import './Products.css';

function parseCats(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

export default function AdminProducts() {
  const { products, deleteProduct } = useProducts();
  const { categories: dbCategories, deleteCategory } = useCategories();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [confirmDeleteCat, setConfirmDeleteCat] = useState(null);
  const [deletingCat, setDeletingCat] = useState(false);

  const categoryLabel = useMemo(() => {
    const map = {};
    dbCategories.forEach(c => { map[c.slug] = c.name; });
    return map;
  }, [dbCategories]);

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      parseCats(p.category).forEach(slug => {
        counts[slug] = (counts[slug] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    if (catFilter !== 'all') {
      list = list.filter(p => parseCats(p.category).includes(catFilter));
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

  const handleDeleteCategory = async (id) => {
    setDeletingCat(true);
    try {
      await deleteCategory(id);
      if (confirmDeleteCat && catFilter === confirmDeleteCat.slug) {
        setCatFilter('all');
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setDeletingCat(false);
      setConfirmDeleteCat(null);
    }
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
            <option value="all">All Categories</option>
            {dbCategories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <button
            type="button"
            className={`ap-manage-cats-btn${showCategories ? ' ap-manage-cats-btn--active' : ''}`}
            onClick={() => setShowCategories(!showCategories)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Manage Categories
          </button>
        </div>
        <Link to="/admin/products/new" className="ap-add-btn">+ Add Product</Link>
      </div>

      {/* Category Management Panel */}
      {showCategories && (
        <div className="ap-cat-panel">
          <div className="ap-cat-panel-header">
            <h3>Categories</h3>
            <span className="ap-cat-panel-count">{dbCategories.length} total</span>
          </div>
          {dbCategories.length > 0 ? (
            <div className="ap-cat-panel-list">
              {dbCategories.map(c => (
                <div key={c.id} className="ap-cat-panel-item">
                  <span className="ap-cat-panel-name">{c.name}</span>
                  <span className="ap-cat-panel-slug">{c.slug}</span>
                  <span className="ap-cat-panel-products">{categoryCounts[c.slug] || 0} products</span>
                  <button
                    type="button"
                    className="ap-cat-panel-delete"
                    onClick={() => setConfirmDeleteCat(c)}
                    title={`Delete ${c.name}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M3 4h10M5.5 4V3a1 1 0 011-1h3a1 1 0 011 1v1M6.5 7v4M9.5 7v4M4.5 4l.5 8.5a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="ap-cat-panel-empty">No categories yet. Add them when creating a product.</p>
          )}
        </div>
      )}

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
              {filtered.map((p) => {
                const cats = parseCats(p.category);
                return (
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
                    <td>
                      <div className="ap-cat-badges">
                        {cats.map(slug => (
                          <span key={slug} className="ap-cat-badge">{categoryLabel[slug] || slug}</span>
                        ))}
                        {cats.length === 0 && <span className="ap-cat-badge ap-cat-badge--none">None</span>}
                      </div>
                    </td>
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
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="ap-empty">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Category Confirmation Modal */}
      {confirmDeleteCat && (
        <div className="ap-modal-overlay" onClick={() => !deletingCat && setConfirmDeleteCat(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="ap-modal-title">Delete Category</h3>
            <p className="ap-modal-text">
              Are you sure you want to delete <strong>{confirmDeleteCat.name}</strong>?
              {(categoryCounts[confirmDeleteCat.slug] || 0) > 0 && (
                <> This category is assigned to <strong>{categoryCounts[confirmDeleteCat.slug]}</strong> product{categoryCounts[confirmDeleteCat.slug] !== 1 ? 's' : ''}. Products won't be deleted, but they'll lose this category.</>
              )}
            </p>
            <div className="ap-modal-actions">
              <button
                className="ap-modal-btn ap-modal-btn--cancel"
                onClick={() => setConfirmDeleteCat(null)}
                disabled={deletingCat}
              >
                Cancel
              </button>
              <button
                className="ap-modal-btn ap-modal-btn--delete"
                onClick={() => handleDeleteCategory(confirmDeleteCat.id)}
                disabled={deletingCat}
              >
                {deletingCat ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
