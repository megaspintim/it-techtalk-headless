import Parser from 'rss-parser';

// Confirmed by the team: the widget ID embedded on the old site IS the same
// as the underlying feed ID, so these map straight to public feed URLs —
// no RSS.app API key needed for this. If any topic comes back consistently
// empty, that's the first thing to double-check.
const TOPIC_FEED_IDS = {
  ai: 'tYxMldiJwplqWb4z',
  cyber: 'tSfF8fQhQ3FXMrZv',
  cloud: 'twCPnIAUb9VUfIcC',
  erp: 't2zAHePH0Z59gPbW',
  comms: 'tLkXcP9JiZvP2AEz',
  infra: 'tVcMih7yJs8pm1Yi',
  data: 'tfaASWHzyUQ0XePy',
  virt: 'txTE6HrVTVP9UhFI'
};

const REVALIDATE_SECONDS = 1800; // 30 minutes — avoids hammering RSS.app on every request

const parser = new Parser();

function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  const html = item['content:encoded'] || item.content || '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractSourceName(item, feedTitle) {
  try {
    return new URL(item.link).hostname.replace(/^www\./, '');
  } catch {
    return feedTitle || 'Source';
  }
}

// Some source feeds return a description that duplicates itself with a
// " | " separator (e.g. "...failing to detect significant erro | As
// adoption of AI am...") — a real bug spotted on the live site. Splitting
// on that separator and keeping only the first segment fixes the
// duplication. Separately, truncating at a hard character count was also
// cutting words in half — this truncates at the last whole word instead,
// with a proper ellipsis, regardless of whether the duplication bug was
// present in a given item.
function cleanTeaser(text, maxLength = 220) {
  if (!text) return '';

  const deduped = text.split(' | ')[0].trim();

  if (deduped.length <= maxLength) return deduped;

  const truncated = deduped.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const clean = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return `${clean.trim()}…`;
}

async function fetchTopicFeed(topicKey) {
  const feedId = TOPIC_FEED_IDS[topicKey];
  if (!feedId) return [];

  try {
    const res = await fetch(`https://rss.app/feeds/${feedId}.xml`, {
      next: { revalidate: REVALIDATE_SECONDS }
    });

    if (!res.ok) {
      console.error(`RSS.app returned ${res.status} for topic "${topicKey}" (feed ${feedId})`);
      return [];
    }

    const xml = await res.text();
    const feed = await parser.parseString(xml);

    return (feed.items || []).map((item, i) => ({
      id: `${topicKey}-${item.guid || item.link || i}`,
      title: item.title || 'Untitled',
      teaser: cleanTeaser(item.contentSnippet || item.summary || ''),
      image: extractImage(item) || `https://picsum.photos/seed/${topicKey}${i}/500/340`,
      sourceName: extractSourceName(item, feed.title),
      sourceUrl: item.link || '#',
      topics: [topicKey],
      publishDate: item.isoDate || item.pubDate || new Date().toISOString()
    }));
  } catch (err) {
    // Logged server-side (visible in `npm run dev` terminal, or Vercel's
    // function logs once deployed) rather than thrown — one bad feed
    // shouldn't take down the whole News section.
    console.error(`Failed to fetch/parse RSS feed for topic "${topicKey}":`, err.message);
    return [];
  }
}

export async function fetchAllNews() {
  const topics = Object.keys(TOPIC_FEED_IDS);
  const results = await Promise.all(topics.map(fetchTopicFeed));
  const merged = results.flat();

  // The same underlying article can be picked up by more than one topic's
  // feed (e.g. an "AI regulation" story matching both the AI and Cyber
  // feeds' search criteria) — a real duplicate spotted on the live site.
  // Dedupe by the article's actual URL, merging every topic it appeared
  // under into one item's `topics` array, rather than showing the same
  // article twice with two different single-topic tags.
  const bySourceUrl = new Map();
  for (const item of merged) {
    const key = item.sourceUrl !== '#' ? item.sourceUrl : item.title;
    const existing = bySourceUrl.get(key);
    if (existing) {
      existing.topics = Array.from(new Set([...existing.topics, ...item.topics]));
    } else {
      bySourceUrl.set(key, { ...item });
    }
  }

  return Array.from(bySourceUrl.values()).sort(
    (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
  );
}

export async function fetchNewsByTopic(topicKey) {
  if (!topicKey) return fetchAllNews();
  return fetchTopicFeed(topicKey);
}
