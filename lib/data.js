// ============================================================================
// DATA LAYER
// ============================================================================
// Every function here is written so that pages/components never need to
// change if a data source changes again — they only ever call the exported
// functions below (getAllResources(), etc.).
//
// Resources are queried live from Wix via lib/wixRest.js — plain REST API
// calls (fetch), NOT the @wix/sdk + @wix/data packages. Those packages have
// a reproducible internal crash in this Next.js App Router (RSC)
// environment — confirmed via full stack trace, a duplicate/mismatched
// @wix/sdk-runtime dependency bundled inside @wix/sdk itself. lib/wixClient.js
// is the old SDK-based attempt, kept only for reference — nothing imports it.
//
// Two Wix REST quirks worth knowing if resources ever look wrong:
//   1. Tags fields (topic, resourceType) can come back as a plain string
//      instead of an array — normalizeToArray() in wixRest.js handles both.
//   2. Image fields come back as `wix:image://v1/{id}/{filename}` strings —
//      resolveWixImage() below converts to a real, resolvable URL.
// ============================================================================

import Fuse from 'fuse.js';
import { fetchAllNews, fetchNewsByTopic } from './rss';
import {
  queryWixCollection,
  getFieldValue,
  getItemCreatedDate,
  normalizeToArray
} from './wixRest';

export function resolveWixImage(wixImageRef) {
  if (!wixImageRef) return '';
  if (!wixImageRef.startsWith('wix:image://')) return wixImageRef; // already a real URL
  const match = wixImageRef.match(/wix:image:\/\/v1\/([^/]+)\//);
  return match ? `https://static.wixstatic.com/media/${match[1]}` : wixImageRef;
}

// ---------------------------------------------------------------------------
// MOCK RESOURCES — shaped to match the real "Resources" collection fields:
// title, header, teaser, body, client, topic (tags), resourceType (tags),
// ctaLabel, formIntro, formEmbedCode, image, slug, createdDate
// ---------------------------------------------------------------------------
const MOCK_RESOURCES = [
  {
    slug: 'ergon-case-study',
    title: 'Ergon Case Study',
    header: 'Build secure, regulated trading technology in the cloud',
    teaser:
      'Watch the AWS customer story to see how RULEMATCH works with AWS Partner Ergon to develop secure cloud trading technology.',
    body: `
      <p>RULEMATCH operates in a highly regulated financial environment where data protection, security, and operational resilience are essential.</p>
      <p>This AWS customer story explains how RULEMATCH works with AWS Partner Ergon to develop software securely in the cloud. By using AWS managed services, Ergon can identify and implement solutions quickly, helping support the performance and reliability of RULEMATCH's clearing and settlement exchange.</p>
      <p>Watch the story to see how the long-term partnership between RULEMATCH, Ergon, and AWS is helping deliver secure, scalable trading technology for regulated financial institutions.</p>
      <h2>What you'll learn</h2>
      <ul>
        <li>How RULEMATCH supports secure digital asset trading services</li>
        <li>Why cloud security matters in regulated financial environments</li>
        <li>How AWS Partner Ergon helps develop and manage secure cloud software</li>
        <li>How AWS managed services support speed, reliability, and operational control</li>
        <li>Why support for Swiss legal frameworks matters for RULEMATCH's customers</li>
      </ul>
    `,
    client: 'AWS',
    topic: ['data'],
    resourceType: ['Guide'],
    ctaLabel: 'View the RULEMATCH story',
    formIntro: 'Complete the form to watch the customer story.',
    formEmbedCode: '',
    image: 'https://picsum.photos/seed/ergon/800/600',
    createdDate: '2026-06-01'
  },
  {
    slug: '3-keys-to-successful-ai-outcomes',
    title: '3 Keys to Successful AI Outcomes',
    header: 'Unlock better AI outcomes with the right strategy',
    teaser:
      'Discover the three keys to successful AI and machine learning adoption: democratizing access, operationalizing ML, and building trust.',
    body: `
      <p>AI and machine learning are becoming essential to how organizations improve customer experiences, optimize operations, and create new products and services. But as adoption grows, many teams face the same challenge: how do you turn AI experimentation into repeatable, trusted business value?</p>
      <p>This AWS eBook outlines three strategic pillars that can help organizations deliver more successful AI outcomes: <strong>democratize, operationalize, and build trust</strong>.</p>
      <p>It explains how businesses can give more teams access to AI capabilities, standardize machine learning development, scale projects more effectively, and apply responsible AI principles across the full lifecycle.</p>
      <h2>What you'll learn</h2>
      <ul>
        <li>Why generative AI is accelerating investment in AI and ML</li>
        <li>How to democratize access to AI across more teams and use cases</li>
        <li>Why operationalizing ML is critical for scaling AI successfully</li>
        <li>How responsible AI, security, and privacy help build trust</li>
        <li>How AWS can support AI and ML adoption at every stage of maturity</li>
      </ul>
    `,
    client: 'AWS',
    topic: ['ai'],
    resourceType: ['eBook'],
    ctaLabel: 'Download the eBook',
    formIntro: 'Complete the form to get instant access to this resource.',
    formEmbedCode: '',
    image: 'https://picsum.photos/seed/aioutcomes/800/600',
    createdDate: '2026-06-10'
  },
  {
    slug: 'culture-of-security',
    title: 'Culture of Security',
    header: 'Security at scale — building a posture that grows with your business',
    teaser:
      'Download the AWS two-page guide to see how AWS embeds security into its organizational structure, product teams, leadership model, and innovation processes.',
    body: `
      <p>Security isn't a checkpoint — it's a culture. This guide explores how AWS has built security into every layer of its organization, from engineering teams to leadership.</p>
      <h2>What you'll learn</h2>
      <ul>
        <li>How security responsibility is distributed across product teams</li>
        <li>Why security is everyone's job, not just a dedicated team's</li>
        <li>How AWS builds security into new product development from day one</li>
      </ul>
    `,
    client: 'AWS',
    topic: ['cyber'],
    resourceType: ['Guide'],
    ctaLabel: 'Download the guide',
    formIntro: 'Complete the form to get instant access to this resource.',
    formEmbedCode: '',
    image: 'https://picsum.photos/seed/culturesecurity/800/600',
    createdDate: '2026-05-20'
  },
  {
    slug: 'data-is-the-differentiator',
    title: 'Data is the differentiator',
    header: 'How data-driven SMBs are outperforming their peers',
    teaser:
      'Download the 451 Research report, commissioned by AWS, to see how data-driven SMBs are outperforming their peers and using AI to improve performance, productivity, and growth.',
    body: `
      <p>Data-driven organizations consistently outperform peers on growth, efficiency, and customer satisfaction. This report from 451 Research, commissioned by AWS, quantifies exactly how much of an edge that represents for small and mid-sized businesses.</p>
      <h2>What you'll learn</h2>
      <ul>
        <li>How data maturity correlates with business performance</li>
        <li>Where SMBs are seeing the fastest ROI from AI investment</li>
        <li>What separates data leaders from data laggards</li>
      </ul>
    `,
    client: 'AWS',
    topic: ['data', 'ai'],
    resourceType: ['eBook'],
    ctaLabel: 'Explore the findings',
    formIntro: 'Complete the form to get instant access to this resource.',
    formEmbedCode: '',
    image: 'https://picsum.photos/seed/datadiff/800/600',
    createdDate: '2026-05-15'
  },
  {
    slug: 'cloud-security-tools-guide',
    title: 'Cloud Security Tools Guide',
    header: 'Practical tools and patterns for protecting cloud workloads',
    teaser:
      'Read the AWS Marketplace guide to explore practical security tools and patterns that can help protect cloud applications, users, data, workloads, and web traffic from modern threats.',
    body: `
      <p>Cloud security isn't one tool — it's a layered set of patterns applied consistently across applications, identities, and data.</p>
      <h2>What you'll learn</h2>
      <ul>
        <li>Practical tools for protecting cloud applications and workloads</li>
        <li>How to defend web traffic and APIs from modern threats</li>
        <li>Patterns for securing user identity and access at scale</li>
      </ul>
    `,
    client: 'AWS',
    topic: ['cyber', 'cloud'],
    resourceType: ['Guide'],
    ctaLabel: 'Access the guide',
    formIntro: 'Complete the form to get instant access to this resource.',
    formEmbedCode: '',
    image: 'https://picsum.photos/seed/cloudsecguide/800/600',
    createdDate: '2026-04-28'
  },
  {
    slug: 'ai-for-smb',
    title: 'Artificial Intelligence for Small and Medium Business',
    header: 'How SMBs can use AI to cut costs and boost productivity',
    teaser:
      'See how small and medium businesses can use AI to cut costs, boost productivity, and support future growth.',
    body: `
      <p>AI adoption is no longer just for enterprise-scale organizations. This guide focuses specifically on practical, high-ROI AI use cases for smaller teams with limited technical resources.</p>
      <h2>What you'll learn</h2>
      <ul>
        <li>Where SMBs are seeing the fastest AI ROI</li>
        <li>How to start small and scale AI investment responsibly</li>
        <li>Common pitfalls to avoid in early AI adoption</li>
      </ul>
    `,
    client: 'AWS',
    topic: ['ai'],
    resourceType: ['eBook'],
    ctaLabel: 'Get the AI guide',
    formIntro: 'Complete the form to get instant access to this resource.',
    formEmbedCode: '',
    image: 'https://picsum.photos/seed/aismb/800/600',
    createdDate: '2026-04-10'
  }
];

// ---------------------------------------------------------------------------
// PUBLIC API — pages/components should only ever call these functions.
// MOCK_RESOURCES above is no longer used live (kept only as a reference for
// the expected field shape / an easy fallback if the real connection needs
// debugging — just swap the query calls below back to returning it).
// ---------------------------------------------------------------------------

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Maps a raw Wix Data item to the shape every component already expects.
// Field keys here (item.header, item.teaser, item.resourceType, etc.) were
// confirmed working when we tested the equivalent Velo code live in Wix
// Studio earlier — high confidence on those. Two things NOT yet verified
// against the real connection, worth checking first if something looks off:
//   1. The image field key — assumed lowercase `image` below; you told us
//      the display name is "Image", but Wix's internal key may differ.
//   2. Whether `topic` / `resourceType` genuinely come back as plain arrays
//      of strings (as they did via Velo) versus some other shape via this
//      SDK — console.log one raw item to confirm if resources fail to load.
function mapResourceItem(item) {
  const title = getFieldValue(item, 'title');
  return {
    slug: slugify(title),
    title,
    header: getFieldValue(item, 'header'),
    teaser: getFieldValue(item, 'teaser'),
    body: getFieldValue(item, 'body'),
    client: getFieldValue(item, 'client'),
    topic: normalizeToArray(getFieldValue(item, 'topic')),
    resourceType: normalizeToArray(getFieldValue(item, 'resourceType')),
    ctaLabel: getFieldValue(item, 'ctaLabel'),
    formIntro: getFieldValue(item, 'formIntro'),
    formEmbedCode: getFieldValue(item, 'formEmbedCode'),
    image: resolveWixImage(getFieldValue(item, 'image')),
    createdDate: getItemCreatedDate(item)
  };
}

export async function getAllResources() {
  const rawItems = await queryWixCollection('Resources');
  return rawItems.map(mapResourceItem);
}

export async function getResourceBySlug(slug) {
  // Fetches everything and matches by a slugified title rather than
  // filtering server-side by a dedicated slug field — deliberately, since
  // we don't yet know for certain a slug field exists on the real
  // collection. Less efficient than a direct filter, but doesn't depend on
  // a field-name guess. Worth optimizing once confirmed.
  const all = await getAllResources();
  return all.find((r) => r.slug === slug) || null;
}

export async function getRelatedResources(current, limit = 3) {
  const all = await getAllResources();
  const others = all.filter((r) => r.slug !== current.slug);

  const topicMatches = others
    .filter((r) => r.topic.some((t) => current.topic.includes(t)))
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  if (topicMatches.length >= limit) return topicMatches.slice(0, limit);

  // Backfill with most-recent others if fewer than `limit` topic matches exist
  const matchedSlugs = topicMatches.map((r) => r.slug);
  const backfill = others
    .filter((r) => !matchedSlugs.includes(r.slug))
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  return [...topicMatches, ...backfill].slice(0, limit);
}

// News is real too — fetched live from RSS.app on each request (cached for
// 30 minutes server-side, see lib/rss.js). No Wix Data involved for News.
export async function getAllNews() {
  return fetchAllNews();
}

export async function getNewsByTopic(topicKey) {
  return fetchNewsByTopic(topicKey);
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ');
}

export async function searchContent(query) {
  if (!query || !query.trim()) return { resources: [], news: [] };
  const q = query.trim();

  const allResources = await getAllResources();
  // Search against a cleaned (HTML-stripped) copy of the body text, without
  // mutating what actually gets displayed on the results cards.
  const searchableResources = allResources.map((r) => ({ ...r, bodyText: stripHtml(r.body) }));
  const resourcesFuse = new Fuse(searchableResources, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'header', weight: 1.5 },
      { name: 'teaser', weight: 1 },
      { name: 'bodyText', weight: 0.5 }
    ],
    threshold: 0.35, // lower = stricter match, higher = more forgiving of typos
    ignoreLocation: true
  });
  const resources = resourcesFuse.search(q).map((result) => result.item);

  const allNews = await fetchAllNews();
  const newsFuse = new Fuse(allNews, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'teaser', weight: 1 }
    ],
    threshold: 0.35,
    ignoreLocation: true
  });
  const news = newsFuse.search(q).map((result) => result.item);

  return { resources, news };
}
