'use client';

import { useEffect } from 'react';
import { trackTopicView } from '../lib/personalization';

export default function TrackTopicView({ topics }) {
  useEffect(() => {
    trackTopicView(topics);
    // Only re-fire if the actual topic list changes (e.g. navigating between
    // two different resources client-side), not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(topics)]);

  return null;
}
