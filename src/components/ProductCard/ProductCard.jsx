import React from 'react';
import { Link } from 'react-router-dom';
import PriceTag from '../UI/PriceTag';
import ProductImage from '../UI/ProductImage';
import { IconEye } from '../icons';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const categoryLabel = {
  vitamins: 'Vitamins',
  'weight-loss': 'Weight Loss',
  protein: 'Protein',
  'pre-workout': 'Pre-Workout',
  'post-workout': 'Post-Workout',
  'gut-health': 'Gut Health',
  bundles: 'Bundles',
};

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const isOOS = !product.inStock;

  const handleAdd = () => {
    if (isOOS) return;
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className={`product-card${isOOS ? ' product-card--oos' : ''}`}>
      <Link to={`/product/${product.id}`} className="product-card-visual">
        <ProductImage
          category={product.category}
          productName={product.name}
          image={product.image}
        />
        {isOOS && (
          <div className="product-card-oos-overlay">
            <span>Out of Stock</span>
          </div>
        )}
        <div className="product-card-quickview">
          <IconEye />
          <span>Quick View</span>
        </div>
        {product.shortDescription && !isOOS && (
          <div className="product-card-tagline">{product.shortDescription}</div>
        )}
      </Link>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-card-cat">{categoryLabel[product.category] || product.category}</span>
        </div>

        <Link to={`/product/${product.id}`} className="product-card-name">{product.name}</Link>

        <div className="product-card-desc">{product.description}</div>

        <div className="product-card-footer">
          <div className="product-card-price-row">
            <PriceTag price={product.price} />
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="product-card-compare">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          {isOOS ? (
            <button className="product-card-notify">
              Notify Me
            </button>
          ) : (
            <button className="product-card-add" onClick={handleAdd}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
