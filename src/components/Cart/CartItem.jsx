import React from 'react';
import QuantitySelector from '../UI/QuantitySelector';
import ProductImage from '../UI/ProductImage';
import { IconTrash } from '../icons';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { dispatch } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-thumb">
        <ProductImage category={item.category} productName={item.name} image={item.image} />
      </div>
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">{formatCurrency(item.price * item.quantity)}</div>
        <div className="cart-item-controls">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(q) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: q } })}
            size="sm"
          />
          <button
            className="cart-item-remove"
            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
            aria-label={`Remove ${item.name}`}
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
