import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CheckoutSuccess.css';

export default function CheckoutSuccess() {
  const { dispatch } = useCart();

  useEffect(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return (
    <div className="checkout-success">
      <div className="checkout-success-card">
        <div className="checkout-success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1 className="checkout-success-title">Order Confirmed!</h1>
        <p className="checkout-success-text">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
        <div className="checkout-success-actions">
          <Link to="/" className="checkout-success-btn checkout-success-btn--primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
