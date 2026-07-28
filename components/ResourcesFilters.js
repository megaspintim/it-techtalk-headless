'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { track } from '@vercel/analytics';
import { TOPICS } from '../lib/topics';
import SearchPill from './SearchPill';

const FORMATS = ['Case Study', 'Video', 'eBook', 'Guide', 'Article', 'Report'];

export function ResourcesSidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFormats = (searchParams.get('format') || '').split(',').filter(Boolean);
  const activeTopics = (searchParams.get('topic') || '').split(',').filter(Boolean);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/resources?${params.toString()}`);
  }

  function toggle(paramKey, current, key) {
    const next = current.includes(key) ? current.filter((v) => v !== key) : [...current, key];
    if (!current.includes(key)) {
      track('resource_filter', { type: paramKey, value: key });
    }
    updateParams({ [paramKey]: next.join(',') || null });
  }

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-head">
        <h3>Filters</h3>
        <button className="filter-clear" onClick={() => updateParams({ format: null, topic: null })}>
          Clear all
        </button>
      </div>
      <div className="filter-group">
        <h4>Format</h4>
        {FORMATS.map((f) => (
          <label key={f} className="filter-option">
            <input
              type="checkbox"
              checked={activeFormats.includes(f)}
              onChange={() => toggle('format', activeFormats, f)}
            />
            {f}
          </label>
        ))}
      </div>
      <div className="filter-group">
        <h4>Topic</h4>
        {TOPICS.map((t) => (
          <label key={t.key} className="filter-option">
            <input
              type="checkbox"
              checked={activeTopics.includes(t.key)}
              onChange={() => toggle('topic', activeTopics, t.key)}
            />
            {t.label}
          </label>
        ))}
      </div>
    </aside>
  );
}

export function ResourcesToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'newest';

  function handleSortChange(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/resources?${params.toString()}`);
  }

  return (
    <div className="toolbar-right">
      <SearchPill light placeholder="Search resources" />
      <select className="sort-select" value={sort} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="newest">Newest first</option>
        <option value="az">A&ndash;Z</option>
      </select>
    </div>
  );
}
