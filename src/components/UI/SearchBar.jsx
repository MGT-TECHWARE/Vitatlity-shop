import React, { useState } from 'react';
import { IconSearch } from '../icons';

export default function SearchBar({ placeholder = 'Search peptides, supplements & more', onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'var(--gray-50)',
      borderRadius: 'var(--r-pill)',
      padding: '8px 16px',
      flex: 1,
      maxWidth: '420px',
      border: '1.5px solid transparent',
      transition: 'border-color var(--dur-base)',
    }}
    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
    onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
    >
      <IconSearch style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          border: 'none',
          background: 'transparent',
          outline: 'none',
          fontSize: '0.85rem',
          color: 'var(--gray-800)',
          width: '100%',
        }}
      />
    </form>
  );
}
