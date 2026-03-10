import React from 'react';
import './TrustBar.css';

const trustItems = [
  { label: 'Third-Party Tested', icon: '🔬' },
  { label: 'GMP Compliant', icon: '✓' },
  { label: 'Fast Shipping', icon: '📦' },
  { label: 'US-Based', icon: '🇺🇸' },
  { label: 'Expert Support', icon: '💬' },
];

export default function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-bar-inner">
        {trustItems.map((item, i) => (
          <div key={i} className="trust-bar-item">
            <span className="trust-bar-icon">{item.icon}</span>
            <span className="trust-bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
