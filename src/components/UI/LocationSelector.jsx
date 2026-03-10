import React from 'react';
import { IconMapPin, IconChevronDown } from '../icons';

export default function LocationSelector({ location = 'Colleyville, TX' }) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '0.78rem',
      fontWeight: 500,
      color: 'var(--gray-600)',
      whiteSpace: 'nowrap',
      padding: '6px 10px',
      borderRadius: 'var(--r-pill)',
      transition: 'background var(--dur-fast)',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <IconMapPin style={{ color: 'var(--primary)' }} />
      <span>{location}</span>
      <IconChevronDown style={{ color: 'var(--gray-400)' }} />
    </button>
  );
}
