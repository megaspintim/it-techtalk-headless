import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

const TYPE_TINTS = {
  'Case Study': { bg: 'var(--teal-tint)', color: 'var(--teal)' },
  Video: { bg: 'var(--teal-tint)', color: 'var(--teal)' },
  eBook: { bg: 'var(--main-tint)', color: 'var(--main)' },
  Guide: { bg: 'var(--red-tint)', color: 'var(--red)' },
  Article: { bg: 'var(--amber-tint)', color: 'var(--amber)' },
  Report: { bg: 'var(--amber-tint)', color: 'var(--amber)' }
};

export default function ResourceCard({ resource }) {
  const type = resource.resourceType?.[0] || 'Guide';
  const tint = TYPE_TINTS[type] || TYPE_TINTS.Guide;

  return (
    <Link href={`/resources/${resource.slug}`} className="res-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="thumb-wrap">
        <ImageWithFallback src={resource.image} alt="" />
      </div>
      <div className="res-card-body">
        <span className="format-tag" style={{ background: tint.bg, color: tint.color }}>{type}</span>
        <h4>{resource.title}</h4>
        <p>{resource.teaser}</p>
        <span className="res-cta">{resource.ctaLabel} &rarr;</span>
      </div>
    </Link>
  );
}
