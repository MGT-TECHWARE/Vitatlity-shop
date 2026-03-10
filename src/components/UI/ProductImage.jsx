import React, { useState } from 'react';
import './ProductImage.css';

const categoryColors = {
  vitamins: { bg: '#2E8B57', label: 'VIT' },
  'weight-loss': { bg: '#B85450', label: 'WL' },
  protein: { bg: '#3D5A80', label: 'PRO' },
  'pre-workout': { bg: '#0097B2', label: 'PRE' },
  'post-workout': { bg: '#5A5080', label: 'POST' },
  'gut-health': { bg: '#4E7A9E', label: 'GUT' },
  bundles: { bg: '#8B7D3A', label: 'BDL' },
};

export default function ProductImage({ category, productName, image, className = '' }) {
  const [imgError, setImgError] = useState(false);
  const visual = categoryColors[category] || { bg: '#6366f1', label: '' };
  const initials = productName ? productName.slice(0, 2).toUpperCase() : '';

  return (
    <div
      className={`product-image ${className}`}
      style={{ backgroundColor: visual.bg }}
    >
      {image && !imgError ? (
        <img
          src={image}
          alt={productName}
          className="product-image-photo"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span className="product-image-fallback">{initials}</span>
      )}
    </div>
  );
}

export { categoryColors };
