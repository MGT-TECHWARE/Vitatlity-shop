import React from 'react';
import { IconPlus, IconMinus } from '../icons';

export default function QuantitySelector({ quantity = 1, onChange, size = 'md' }) {
  const isSmall = size === 'sm';
  const btnSize = isSmall ? '26px' : '32px';
  const fontSize = isSmall ? '0.78rem' : '0.88rem';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px',
      background: 'var(--gray-50)',
      borderRadius: 'var(--r-pill)',
      padding: '2px',
    }}>
      <button
        onClick={() => onChange?.(Math.max(0, quantity - 1))}
        aria-label="Decrease quantity"
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background var(--dur-fast)',
          color: 'var(--gray-600)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-200)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <IconMinus width={isSmall ? 12 : 14} height={isSmall ? 12 : 14} />
      </button>
      <span style={{
        minWidth: isSmall ? '28px' : '36px',
        textAlign: 'center',
        fontSize,
        fontWeight: 600,
        color: 'var(--gray-800)',
        userSelect: 'none',
      }}>
        {quantity}
      </span>
      <button
        onClick={() => onChange?.(quantity + 1)}
        aria-label="Increase quantity"
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background var(--dur-fast)',
          color: 'var(--gray-600)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-200)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <IconPlus width={isSmall ? 12 : 14} height={isSmall ? 12 : 14} />
      </button>
    </div>
  );
}
