import React, { useState, useRef } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import './AdminProductForm.css';

const categories = [
  { value: 'vitamins', label: 'Vitamins' },
  { value: 'protein', label: 'Protein' },
  { value: 'pre-workout', label: 'Pre-Workout' },
  { value: 'post-workout', label: 'Post-Workout' },
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'gut-health', label: 'Gut Health' },
  { value: 'bundles', label: 'Bundles' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
  'image/bmp',
  'image/tiff',
];

const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.gif,.webp,.svg,.avif,.bmp,.tiff,.tif';

const defaultProduct = {
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  compareAtPrice: '',
  category: 'vitamins',
  stock: '100',
  sku: '',
  image: '',
  status: 'active',
  featured: false,
  servingInstructions: '',
  warnings: '',
  tags: '',
  dietaryFlags: '',
};

export default function AdminProductForm({ initialData, onSubmit, submitLabel = 'Save Product' }) {
  const [form, setForm] = useState({
    ...defaultProduct,
    ...initialData,
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    dietaryFlags: Array.isArray(initialData?.dietaryFlags) ? initialData.dietaryFlags.join(', ') : (initialData?.dietaryFlags || ''),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError(`Unsupported file type: ${file.type}. Accepted: JPG, PNG, GIF, WEBP, SVG, AVIF, BMP, TIFF`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 5MB.');
      return;
    }

    setUploadError('');
    setUploading(true);

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error: uploadErr } = await supabaseAdmin.storage
        .from('product-images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(filePath);

      handleChange('image', urlData.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const removeImage = () => {
    handleChange('image', '');
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stock: Number(form.stock) || 0,
        images: form.image ? [form.image] : [],
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dietaryFlags: form.dietaryFlags ? form.dietaryFlags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="pf" onSubmit={handleSubmit}>
      <div className="pf-grid">
        {/* Left Column */}
        <div className="pf-main">
          <div className="pf-section">
            <h3 className="pf-section-title">Basic Information</h3>
            <label className="pf-label">
              Product Name *
              <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="pf-input" required />
            </label>
            <label className="pf-label">
              Description *
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="pf-textarea" rows={4} required />
            </label>
            <label className="pf-label">
              Short Description
              <input type="text" value={form.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} className="pf-input" placeholder="Brief one-line summary" />
            </label>
          </div>

          <div className="pf-section">
            <h3 className="pf-section-title">Pricing & Inventory</h3>
            <div className="pf-row">
              <label className="pf-label">
                Price ($) *
                <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => handleChange('price', e.target.value)} className="pf-input" required />
              </label>
              <label className="pf-label">
                Compare at Price ($)
                <input type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={(e) => handleChange('compareAtPrice', e.target.value)} className="pf-input" placeholder="Original price" />
              </label>
            </div>
            <div className="pf-row">
              <label className="pf-label">
                Stock *
                <input type="number" min="0" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} className="pf-input" required />
              </label>
              <label className="pf-label">
                SKU
                <input type="text" value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} className="pf-input" placeholder="e.g. VIT-CRE-001" />
              </label>
            </div>
          </div>

          <div className="pf-section">
            <h3 className="pf-section-title">Product Details</h3>
            <label className="pf-label">
              Serving Instructions
              <textarea value={form.servingInstructions} onChange={(e) => handleChange('servingInstructions', e.target.value)} className="pf-textarea" rows={3} />
            </label>
            <label className="pf-label">
              Warnings
              <textarea value={form.warnings} onChange={(e) => handleChange('warnings', e.target.value)} className="pf-textarea" rows={2} />
            </label>
            <label className="pf-label">
              Tags (comma-separated)
              <input type="text" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} className="pf-input" placeholder="e.g. creatine, muscle, strength" />
            </label>
            <label className="pf-label">
              Dietary Flags (comma-separated)
              <input type="text" value={form.dietaryFlags} onChange={(e) => handleChange('dietaryFlags', e.target.value)} className="pf-input" placeholder="e.g. gluten-free, vegan, soy-free" />
            </label>
          </div>

          <div className="pf-section">
            <h3 className="pf-section-title">Media</h3>

            {/* Image Upload Area */}
            {!form.image ? (
              <div
                className={`pf-upload-zone${dragActive ? ' pf-upload-zone--active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  onChange={handleFileSelect}
                  className="pf-upload-input"
                />
                {uploading ? (
                  <div className="pf-upload-loading">
                    <div className="pf-upload-spinner" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <>
                    <div className="pf-upload-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="pf-upload-text">
                      <span className="pf-upload-text-main">Drop image here or click to browse</span>
                      <span className="pf-upload-text-sub">JPG, PNG, GIF, WEBP, SVG, AVIF, BMP, TIFF — Max 5MB</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="pf-upload-preview">
                <div className="pf-upload-preview-img">
                  <img src={form.image} alt="Product" onError={(e) => { e.target.src = ''; e.target.alt = 'Failed to load'; }} />
                </div>
                <div className="pf-upload-preview-info">
                  <span className="pf-upload-preview-url" title={form.image}>
                    {form.image.length > 60 ? '...' + form.image.slice(-57) : form.image}
                  </span>
                  <div className="pf-upload-preview-actions">
                    <button
                      type="button"
                      className="pf-upload-change-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      className="pf-upload-remove-btn"
                      onClick={removeImage}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    onChange={handleFileSelect}
                    className="pf-upload-input"
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="pf-upload-error">{uploadError}</div>
            )}

            {/* Fallback: paste URL manually */}
            <div className="pf-upload-url-fallback">
              <span className="pf-upload-or">or paste image URL</span>
              <input
                type="text"
                value={form.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="pf-input"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="pf-sidebar">
          <div className="pf-section">
            <h3 className="pf-section-title">Category</h3>
            <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="pf-select">
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="pf-section">
            <h3 className="pf-section-title">Status</h3>
            <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="pf-select">
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <label className="pf-toggle-label" style={{ marginTop: '12px' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => handleChange('featured', e.target.checked)} className="pf-checkbox" />
              <span className="pf-toggle-text">Featured Product</span>
            </label>
          </div>

          <button type="submit" className="pf-submit" disabled={saving || uploading}>
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
