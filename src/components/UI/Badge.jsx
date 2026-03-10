import React from 'react';

export default function Badge({ children, color = 'var(--primary)', bg = 'var(--accent-light)', style, className = '' }) {
  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: 'var(--r-pill)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        color,
        backgroundColor: bg,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
