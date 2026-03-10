"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  name: string;
  slug: string;
}

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.products || []);
        setShowResults(true);
      })
      .catch(() => setResults([]));
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search supplements..."
          className="w-full px-4 py-2.5 bg-surface border border-border/50 rounded-xl text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green/30"
        />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-primary text-sm transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-xl shadow-elevated z-50 overflow-hidden">
          {results.map((result) => (
            <button
              key={result.slug}
              type="button"
              onClick={() => {
                router.push(`/products/${result.slug}`);
                onClose?.();
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface transition-colors"
            >
              {result.name}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
