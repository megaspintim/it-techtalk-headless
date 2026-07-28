'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';

export default function SearchPill({ light = false, placeholder = 'Search' }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next) setTimeout(() => inputRef.current?.focus(), 50);
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    track('search_performed', { queryLength: value.trim().length });
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form
      ref={wrapRef}
      onSubmit={handleSubmit}
      className={`search-pill${light ? ' light' : ''}${open ? ' open' : ''}`}
    >
      <button type="button" aria-label="Toggle search" onClick={toggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
