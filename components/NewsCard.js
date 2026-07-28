import { getTopicLabel } from '../lib/topics';
import ImageWithFallback from './ImageWithFallback';

const TOPIC_TINTS = {
  ai: { bg: 'var(--main-tint)', color: 'var(--main)' },
  cyber: { bg: 'var(--red-tint)', color: 'var(--red)' },
  cloud: { bg: 'var(--teal-tint)', color: 'var(--teal)' },
  erp: { bg: 'var(--amber-tint)', color: 'var(--amber)' },
  infra: { bg: 'var(--amber-tint)', color: 'var(--amber)' },
  data: { bg: 'var(--main-tint)', color: 'var(--main)' },
  comms: { bg: 'var(--teal-tint)', color: 'var(--teal)' },
  virt: { bg: 'var(--red-tint)', color: 'var(--red)' }
};

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.max(1, Math.round(diffMs / 3600000));
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function NewsCard({ item }) {
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="thumb-wrap">
        <ImageWithFallback src={item.image} alt="" />
      </div>
      <div className="card-body">
        <div className="card-tags">
          {item.topics.map((topicKey) => {
            const tint = TOPIC_TINTS[topicKey] || TOPIC_TINTS.ai;
            return (
              <span
                key={topicKey}
                className="format-tag"
                style={{ background: tint.bg, color: tint.color }}
              >
                {getTopicLabel(topicKey)}
              </span>
            );
          })}
        </div>
        <h3>{item.title}</h3>
        <p>{item.teaser}</p>
        <div className="meta">
          <span className="meta-source">Source: {item.sourceName}</span>
          <span className="dot">&middot;</span>
          <span>{timeAgo(item.publishDate)}</span>
        </div>
      </div>
    </a>
  );
}
