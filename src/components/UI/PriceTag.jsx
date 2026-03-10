import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function PriceTag({ price, unit, size = 'md' }) {
  const fontSize = size === 'lg' ? '1.35rem' : size === 'sm' ? '0.95rem' : '1.1rem';

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <span style={{
        fontSize,
        fontWeight: 700,
        color: 'var(--primary)',
        letterSpacing: '-0.01em',
      }}>
        {formatCurrency(price)}
      </span>
      {unit && (
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--gray-400)',
          fontWeight: 400,
        }}>
          {unit}
        </span>
      )}
    </div>
  );
}
