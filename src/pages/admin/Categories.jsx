import React, { useState } from 'react';
import { useCategories } from '../../context/CategoriesContext';
import './Categories.css';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    try {
      const slug = newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await addCategory({ name: newName.trim(), slug });
      setNewName('');
    } catch (err) {
      setError(err.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    setError('');
    try {
      const slug = editName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await updateCategory(id, { name: editName.trim(), slug });
      setEditingId(null);
      setEditName('');
    } catch (err) {
      setError(err.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteCategory(id);
    } catch (err) {
      setError(err.message || 'Failed to delete category. It may still be in use by products.');
    }
    setConfirmDelete(null);
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  return (
    <div className="ac">
      <div className="ac-header">
        <h2 className="ac-title">Categories</h2>
        <span className="ac-count">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</span>
      </div>

      {error && <div className="ac-error">{error}</div>}

      <form className="ac-add-form" onSubmit={handleAdd}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="ac-add-input"
        />
        <button type="submit" className="ac-add-btn" disabled={adding || !newName.trim()}>
          {adding ? 'Adding...' : '+ Add Category'}
        </button>
      </form>

      <div className="ac-table-card">
        <table className="ac-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="ac-edit-input"
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                      autoFocus
                    />
                  ) : (
                    <span className="ac-cat-name">{cat.name}</span>
                  )}
                </td>
                <td><span className="ac-cat-slug">{cat.slug}</span></td>
                <td>
                  <div className="ac-actions">
                    {editingId === cat.id ? (
                      <>
                        <button className="ac-action-btn ac-action-save" onClick={() => handleUpdate(cat.id)}>Save</button>
                        <button className="ac-action-btn ac-action-cancel" onClick={() => { setEditingId(null); setEditName(''); }}>Cancel</button>
                      </>
                    ) : confirmDelete === cat.id ? (
                      <>
                        <button className="ac-action-btn ac-action-confirm" onClick={() => handleDelete(cat.id)}>Yes, Delete</button>
                        <button className="ac-action-btn ac-action-cancel" onClick={() => setConfirmDelete(null)}>No</button>
                      </>
                    ) : (
                      <>
                        <button className="ac-action-btn ac-action-edit" onClick={() => startEdit(cat)}>Edit</button>
                        <button className="ac-action-btn ac-action-delete" onClick={() => setConfirmDelete(cat.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="ac-empty">No categories yet. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
