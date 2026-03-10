import React, { useState } from 'react';
import CartItem from './CartItem';
import { IconX } from '../icons';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { supabase } from '../../lib/supabase';
import './Cart.css';

export default function CartDrawer({ open, onClose }) {
  const { cartItems, cartCount, cartTotal } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleCheckout = async () => {
    setError('');
    setCheckingOut(true);

    try {
      // Build items payload for the Edge Function
      const items = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.images?.[0] || null,
      }));

      const origin = window.location.origin;

      const { data, error: fnError } = await supabase.functions.invoke('create-checkout', {
        body: {
          items,
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/`,
        },
      });

      if (fnError) throw new Error(fnError.message || 'Checkout failed');
      if (data?.error) throw new Error(data.error);
      if (!data?.url) throw new Error('No checkout URL returned');

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} />
      <aside className="cart-drawer">
        <div className="cart-drawer-header">
          <div>
            <span className="cart-drawer-title">Your Bag</span>
            <span className="cart-drawer-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
          </div>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
            <IconX />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length > 0 ? (
            cartItems.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <div className="cart-drawer-empty">
              <div className="cart-drawer-empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
              </div>
              <div className="cart-drawer-empty-text">Your bag is empty</div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal">
              <span className="cart-drawer-subtotal-label">Subtotal</span>
              <span className="cart-drawer-subtotal-value">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="cart-drawer-note">Shipping & taxes calculated at checkout</div>
            {error && <div className="cart-drawer-error">{error}</div>}
            <button
              className="cart-drawer-checkout"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? (
                <>
                  <span className="cart-drawer-spinner" />
                  Redirecting to Checkout...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
