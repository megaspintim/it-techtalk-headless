// Lightweight, client-only personalization — no accounts, no backend, no
// cookies/consent banner needed. Just counts how often a visitor's browser
// has viewed each topic, stored in localStorage, and uses that to surface
// a "Recommended for you" rail. If localStorage is unavailable (SSR, privacy
// mode, etc.) everything here degrades to doing nothing, silently.

const STORAGE_KEY = 'ittt_topic_views';
const MAX_TRACKED_VIEWS = 200; // simple cap so this never grows unbounded

function readViews() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeViews(views) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  } catch {
    // Ignore write failures (private browsing, storage full, etc.) — this
    // is a nice-to-have, never something worth surfacing an error for.
  }
}

// Call with an array of topic keys (a resource or news item can belong to
// more than one) whenever a visitor views a piece of content.
export function trackTopicView(topicKeys = []) {
  if (!topicKeys.length) return;

  const views = readViews();
  const totalViews = Object.values(views).reduce((sum, n) => sum + n, 0);
  if (totalViews >= MAX_TRACKED_VIEWS) return;

  topicKeys.forEach((key) => {
    views[key] = (views[key] || 0) + 1;
  });
  writeViews(views);
}

// Returns topic keys sorted by view count, most-viewed first.
export function getTopTopics(limit = 3) {
  const views = readViews();
  return Object.entries(views)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
}
