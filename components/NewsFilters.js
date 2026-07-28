'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { track } from '@vercel/analytics';
import { TOPICS } from '../lib/topics';
import SearchPill from './SearchPill';

export function NewsSidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTopics = (searchParams.get('topic') || '').split(',').filter(Boolean);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/news?${params.toString()}`);
  }

  function toggleTopic(key) {
    const next = activeTopics.includes(key)
      ? activeTopics.filter((t) => t !== key)
      : [...activeTopics, key];
    if (!activeTopics.includes(key)) {
      track('news_topic_filter', { topic: key });
    }
    updateParams({ topic: next.join(',') || null });
  }

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-head">
        <h3>Filters</h3>
        <button className="filter-clear" onClick={() => updateParams({ topic: null })}>
          Clear all
        </button>
      </div>
      <div className="filter-group">
        <h4>Topic</h4>
        {TOPICS.map((t) => (
          <label key={t.key} className="filter-option">
            <input
              type="checkbox"
              checked={activeTopics.includes(t.key)}
              onChange={() => toggleTopic(t.key)}
            />
            {t.label}
          </label>
        ))}
      </div>
    </aside>
  );
}

export function NewsToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'newest';

  function handleSortChange(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/news?${params.toString()}`);
  }

  return (
    <div className="toolbar-right">
      <SearchPill light placeholder="Search news" />
      <select className="sort-select" value={sort} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  );
}
