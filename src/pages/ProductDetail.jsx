import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IconArrowRight, IconShield } from '../components/icons';
import QuantitySelector from '../components/UI/QuantitySelector';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useProducts } from '../context/ProductsContext';
import './ProductDetail.css';

const categoryLabel = {
  vitamins: 'Vitamins & Supplements',
  'weight-loss': 'Weight Loss',
  protein: 'Protein',
  'pre-workout': 'Pre-Workout',
  'post-workout': 'Post-Workout',
  'gut-health': 'Gut Health',
  bundles: 'Bundles',
};

const categoryColor = {
  vitamins: '#2E8B57',
  'weight-loss': '#B85450',
  protein: '#3D5A80',
  'pre-workout': '#0097B2',
  'post-workout': '#5A5080',
  'gut-health': '#4E7A9E',
  bundles: '#8B7D3A',
};

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { products } = useProducts();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAdded(false);
    setQty(1);
  }, [id]);

  const product = useMemo(() => products.find((p) => p.id === id), [id, products]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id && p.inStock)
      .slice(0, 4);
  }, [product, products]);

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="pdp-back-home">Back to Shop</Link>
      </div>
    );
  }

  const isOOS = !product.inStock;

  const handleAdd = () => {
    if (isOOS) return;
    for (let i = 0; i < qty; i++) {
      dispatch({ type: 'ADD_ITEM', payload: product });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pdp">
      <div className="pdp-inner">
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb">
          <Link to="/">Home</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <Link to="/">Products</Link>
          <span className="pdp-breadcrumb-sep">/</span>
          <span className="pdp-breadcrumb-current">{product.name}</span>
        </nav>

        <div className="pdp-layout">
          {/* Image Column */}
          <div className="pdp-image-col">
            <div className="pdp-image-card">
              <div className="pdp-image-wrapper">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="pdp-image" />
                ) : (
                  <div className="pdp-image-placeholder" style={{ backgroundColor: categoryColor[product.category] || '#5A6B78' }}>
                    <span>{product.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>
              {isOOS && (
                <div className="pdp-image-oos-badge">Out of Stock</div>
              )}
            </div>

            <div className="pdp-trust-strip">
              <div className="pdp-trust-item">
                <IconShield width={14} height={14} />
                <span>Third-Party Tested</span>
              </div>
              <div className="pdp-trust-item">
                <span className="pdp-trust-dot" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="pdp-trust-item">
                <span className="pdp-trust-dot" />
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="pdp-info-col">
            <div className="pdp-top-meta">
              <span className="pdp-category-pill" style={{ backgroundColor: categoryColor[product.category] || '#5A6B78' }}>
                {categoryLabel[product.category] || product.category}
              </span>
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            {/* Price */}
            <div className="pdp-price-section">
              <span className="pdp-price">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && (
                <span className="pdp-compare-price">{formatCurrency(product.compareAtPrice)}</span>
              )}
              {product.inStock && (
                <span className="pdp-stock-badge">In Stock ({product.stock})</span>
              )}
            </div>

            {/* Description */}
            <div className="pdp-desc-section">
              <h3 className="pdp-section-heading">Description</h3>
              <p className="pdp-description">{product.description}</p>
            </div>

            {/* Serving Instructions */}
            {product.servingInstructions && (
              <div className="pdp-desc-section">
                <h3 className="pdp-section-heading">Serving Instructions</h3>
                <p className="pdp-description">{product.servingInstructions}</p>
              </div>
            )}

            {/* Dietary Flags */}
            {product.dietaryFlags?.length > 0 && (
              <div className="pdp-desc-section">
                <h3 className="pdp-section-heading">Dietary Information</h3>
                <div className="pdp-flags">
                  {product.dietaryFlags.map(flag => (
                    <span key={flag} className="pdp-flag-badge">{flag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {product.warnings && (
              <div className="pdp-desc-section">
                <h3 className="pdp-section-heading">Warnings</h3>
                <p className="pdp-description pdp-warnings">{product.warnings}</p>
              </div>
            )}

            {/* Specs */}
            <div className="pdp-specs">
              <h3 className="pdp-section-heading">Product Details</h3>
              <div className="pdp-spec-grid">
                <div className="pdp-spec">
                  <span className="pdp-spec-label">Category</span>
                  <span className="pdp-spec-value">{categoryLabel[product.category] || product.category}</span>
                </div>
                <div className="pdp-spec">
                  <span className="pdp-spec-label">SKU</span>
                  <span className="pdp-spec-value">{product.sku || '—'}</span>
                </div>
                <div className="pdp-spec">
                  <span className="pdp-spec-label">Availability</span>
                  <span className={`pdp-spec-value ${product.inStock ? 'pdp-val-in' : 'pdp-val-out'}`}>
                    {product.inStock ? `In Stock (${product.stock})` : 'Currently Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pdp-cta-section">
              {isOOS ? (
                <button className="pdp-btn pdp-btn--notify">
                  Notify Me When Available
                </button>
              ) : (
                <div className="pdp-add-row">
                  <QuantitySelector quantity={qty} onChange={(q) => setQty(Math.max(1, q))} />
                  <button className={`pdp-btn pdp-btn--add${added ? ' pdp-btn--added' : ''}`} onClick={handleAdd}>
                    {added ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pdp-related">
            <div className="pdp-related-header">
              <h2 className="pdp-related-title">You May Also Like</h2>
              <Link to="/" className="pdp-related-all">
                View All Products
                <IconArrowRight width={14} height={14} />
              </Link>
            </div>
            <div className="pdp-related-grid">
              {related.map((p) => (
                <Link to={`/product/${p.id}`} key={p.id} className="pdp-rcard">
                  <div className="pdp-rcard-img">
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <div className="pdp-rcard-placeholder" style={{ backgroundColor: categoryColor[p.category] || '#5A6B78' }}>
                        {p.name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="pdp-rcard-body">
                    <span className="pdp-rcard-cat">{categoryLabel[p.category] || p.category}</span>
                    <span className="pdp-rcard-name">{p.name}</span>
                    <span className="pdp-rcard-price">{formatCurrency(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
