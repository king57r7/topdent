'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="ابحث عن المنتجات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-base pr-12"
        />
        <button
          type="submit"
          className="absolute left-3 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <FiSearch className="text-xl" />
        </button>
      </div>
    </form>
  );
}
