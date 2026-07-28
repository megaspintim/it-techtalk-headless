'use client';

import { useEffect, useState } from 'react';
import ResourceCard from './ResourceCard';
import { getTopTopics } from '../lib/personalization';
import { getTopicLabel } from '../lib/topics';

export default function RecommendedRail({ resources }) {
  // Starts as null so server-render and first client-render match exactly
  // (avoids a hydration mismatch) — localStorage is only readable after
  // mount, so the real content always arrives one tick later.
  const [recommended, setRecommended] = useState(null);
  const [topTopic, setTopTopic] = useState(null);

  useEffect(() => {
    const topTopics = getTopTopics(3);
    if (topTopics.length === 0) {
      setRecommended([]);
      return;
    }

    const matches = resources
      .filter((r) => r.topic.some((t) => topTopics.includes(t)))
      .slice(0, 3);

    setTopTopic(topTopics[0]);
    setRecommended(matches);
  }, [resources]);

  // Nothing to show yet, or a first-time visitor with no browsing history —
  // render nothing rather than an empty/placeholder section.
  if (!recommended || recommended.length === 0) return null;

  return (
    <section style={{ background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
      <div className="section wrap">
        <div className="section-head">
          <h2>Recommended for you</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: -12, marginBottom: 22 }}>
          Based on your interest in {getTopicLabel(topTopic)}
        </p>
        <div className="res-list-grid">
          {recommended.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
}
