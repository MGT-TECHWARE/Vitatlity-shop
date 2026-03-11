import React, { useState, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { supabase } from '../../lib/supabase';
import './Settings.css';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState('');

  const [storeName, setStoreName] = useState('Nexora');
  const [storeEmail, setStoreEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('8.25');
  const [shippingFlat, setShippingFlat] = useState('5.99');
  const [freeShippingMin, setFreeShippingMin] = useState('75');

  const [stripeConnected, setStripeConnected] = useState(false);
  const [onboardingIncomplete, setOnboardingIncomplete] = useState(false);
  const [stripeData, setStripeData] = useState(null);
  const [stripeDataLoading, setStripeDataLoading] = useState(false);

  const fetchStripeStatus = useCallback(async () => {
    setStripeDataLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-connect', {
        body: { action: 'account_status' },
      });
      if (!error && data?.connected) {
        setStripeConnected(true);
        setOnboardingIncomplete(false);
        setStripeData(data);
      } else if (!error && data?.onboarding_incomplete) {
        setOnboardingIncomplete(true);
        setStripeConnected(false);
      }
    } catch {
      // Stripe data fetch failed silently
    } finally {
      setStripeDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabaseAdmin
      .from('store_settings')
      .select('*')
      .limit(1)
      .single();

    if (!error && data) {
      setStoreName(data.store_name || 'Nexora');
      setStoreEmail(data.store_email || '');
      setCurrency(data.currency || 'USD');
      setTaxRate(String(data.tax_rate ?? '8.25'));
      setShippingFlat(String(data.shipping_flat ?? '5.99'));
      setFreeShippingMin(String(data.free_shipping_min ?? '75'));
      setStripeConnected(data.stripe_connected || false);
      if (data.stripe_account_id) {
        fetchStripeStatus();
      }
    }
    setLoading(false);
  };

  const handleConnectStripe = async () => {
    setConnecting(true);
    setConnectError('');
    try {
      const returnUrl = `${window.location.origin}/admin/settings`;
      const { data, error } = await supabase.functions.invoke('stripe-connect', {
        body: { action: 'create_account_link', return_url: returnUrl },
      });

      if (error || data?.error) {
        setConnectError(data?.error || error?.message || 'Failed to start Stripe setup.');
        setConnecting(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      setConnectError('Failed to start Stripe setup. Please try again.');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setStripeDataLoading(true);
    try {
      await supabase.functions.invoke('stripe-connect', {
        body: { action: 'disconnect' },
      });
      setStripeConnected(false);
      setOnboardingIncomplete(false);
      setStripeData(null);
    } catch {
      // disconnect failed silently
    } finally {
      setStripeDataLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { data: existing } = await supabaseAdmin
      .from('store_settings')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      await supabaseAdmin
        .from('store_settings')
        .update({
          store_name: storeName,
          store_email: storeEmail,
          currency,
          tax_rate: Number(taxRate) || 0,
          shipping_flat: Number(shippingFlat) || 0,
          free_shipping_min: Number(freeShippingMin) || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const formatAmount = (amount, curr = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
    }).format(amount / 100);
  };

  const formatDate = (ts) => {
    return new Date(ts * 1000).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="as-loading">Loading settings...</div>;
  }

  return (
    <div className="as">
      {/* Stripe Payments Section */}
      <div className="as-section">
        <div className="as-section-header">
          <h3 className="as-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Payments
          </h3>
          {stripeConnected && (
            <span className="as-badge as-badge--success">
              <span className="as-badge-dot" />
              Connected
            </span>
          )}
        </div>

        {connecting && (
          <div className="as-stripe-dash-loading">
            <span className="as-spinner" /> Setting up Stripe...
          </div>
        )}

        {connectError && (
          <div className="as-notice as-notice--warn">{connectError}</div>
        )}

        {stripeConnected ? (
          <div className="as-stripe-connected">
            {/* Status bar */}
            <div className="as-stripe-status-card">
              <div className="as-stripe-status-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="as-stripe-status-text">
                <strong>Stripe is connected</strong>
                <span>Customers can checkout and all payments go directly to your Stripe account.</span>
              </div>
              <button type="button" className="as-stripe-disconnect" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>

            {/* Stripe Mini Dashboard */}
            {stripeDataLoading ? (
              <div className="as-stripe-dash-loading">
                <span className="as-spinner" /> Loading your Stripe data...
              </div>
            ) : stripeData ? (
              <div className="as-stripe-dash">
                {/* Account Info */}
                <div className="as-stripe-dash-account">
                  <div className="as-stripe-dash-avatar">
                    {stripeData.account?.business_name?.[0]?.toUpperCase() ||
                     stripeData.account?.email?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="as-stripe-dash-account-info">
                    <span className="as-stripe-dash-name">
                      {stripeData.account?.business_name || 'Your Stripe Account'}
                    </span>
                    <span className="as-stripe-dash-email">{stripeData.account?.email || ''}</span>
                  </div>
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="as-stripe-dash-link"
                  >
                    Open Stripe Dashboard
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>

                {/* Balance Cards */}
                {stripeData.balance && (
                  <div className="as-stripe-dash-balances">
                    {stripeData.balance.available?.map((b, i) => (
                      <div key={`avail-${i}`} className="as-stripe-dash-balance-card">
                        <span className="as-stripe-dash-balance-label">Available</span>
                        <span className="as-stripe-dash-balance-amount as-stripe-dash-balance-amount--available">
                          {formatAmount(b.amount, b.currency)}
                        </span>
                      </div>
                    ))}
                    {stripeData.balance.pending?.map((b, i) => (
                      <div key={`pend-${i}`} className="as-stripe-dash-balance-card">
                        <span className="as-stripe-dash-balance-label">Pending</span>
                        <span className="as-stripe-dash-balance-amount">
                          {formatAmount(b.amount, b.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent Payments */}
                <div className="as-stripe-dash-payments">
                  <div className="as-stripe-dash-payments-header">
                    <span>Recent Payments</span>
                    <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer">
                      View all
                    </a>
                  </div>
                  {stripeData.charges?.length > 0 ? (
                    <div className="as-stripe-dash-payments-list">
                      {stripeData.charges.map((charge) => (
                        <div key={charge.id} className="as-stripe-dash-payment">
                          <div className="as-stripe-dash-payment-info">
                            <span className="as-stripe-dash-payment-desc">
                              {charge.description || charge.billing_details?.name || 'Payment'}
                            </span>
                            <span className="as-stripe-dash-payment-date">
                              {formatDate(charge.created)}
                            </span>
                          </div>
                          <div className="as-stripe-dash-payment-right">
                            <span className="as-stripe-dash-payment-amount">
                              {formatAmount(charge.amount, charge.currency)}
                            </span>
                            <span className={`as-stripe-dash-payment-status as-stripe-dash-payment-status--${charge.status}`}>
                              {charge.status === 'succeeded' ? 'Paid' : charge.refunded ? 'Refunded' : charge.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="as-stripe-dash-empty">
                      No payments yet. They'll appear here once customers start checking out.
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : !connecting ? (
          /* Setup state */
          <div className="as-stripe-setup">
            <div className="as-stripe-setup-info">
              {onboardingIncomplete ? (
                <p>Your Stripe account setup isn't finished yet. Click below to continue where you left off.</p>
              ) : (
                <p>Connect your Stripe account to start accepting payments. You'll be redirected to Stripe to log in or create an account.</p>
              )}
            </div>
            <button
              type="button"
              className="as-stripe-connect-btn"
              onClick={handleConnectStripe}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              {onboardingIncomplete ? 'Continue Stripe Setup' : 'Connect with Stripe'}
            </button>
          </div>
        ) : null}
      </div>

      {/* Store Settings Form */}
      <form onSubmit={handleSave}>
        <div className="as-section">
          <h3 className="as-section-title">Store Information</h3>
          <label className="as-label">
            Store Name
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="as-input" />
          </label>
          <label className="as-label">
            Contact Email
            <input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="as-input" placeholder="your@email.com" />
          </label>
          <label className="as-label">
            Currency
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="as-select">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
            </select>
          </label>
        </div>

        <div className="as-section">
          <h3 className="as-section-title">Tax & Shipping</h3>
          <div className="as-row">
            <label className="as-label">
              Tax Rate (%)
              <input type="number" step="0.01" min="0" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="as-input" />
            </label>
            <label className="as-label">
              Flat Shipping ($)
              <input type="number" step="0.01" min="0" value={shippingFlat} onChange={(e) => setShippingFlat(e.target.value)} className="as-input" />
            </label>
          </div>
          <label className="as-label">
            Free Shipping Minimum ($)
            <input type="number" step="0.01" min="0" value={freeShippingMin} onChange={(e) => setFreeShippingMin(e.target.value)} className="as-input" />
          </label>
        </div>

        <button type="submit" className="as-save" disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
