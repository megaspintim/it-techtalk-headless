import Link from 'next/link';
import ParallaxBg from '../components/ParallaxBg';
import ResourceCard from '../components/ResourceCard';
import NewsCard from '../components/NewsCard';
import ImageWithFallback from '../components/ImageWithFallback';
import RecommendedRail from '../components/RecommendedRail';
import { getAllResources, getAllNews } from '../lib/data';
import { TOPICS } from '../lib/topics';

const MASTHEAD_PHOTO = 'https://static.wixstatic.com/media/a2f082_879d00ebcad740ffb7407b8a0b36381d~mv2.avif';

export default async function HomePage() {
  const resources = await getAllResources();
  const news = await getAllNews();

  const [featured, ...rest] = resources;
  const regularResources = rest.slice(0, 4);
  const latestNews = news.slice(0, 6);

  return (
    <>
      <div className="masthead">
        <ParallaxBg imageUrl={MASTHEAD_PHOTO} />
        <div className="wrap masthead-inner">
          <div className="masthead-frame">
            <svg className="frame-graphic" viewBox="0 0 205 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M143.229 200H0V41.1256C0 18.4415 18.9313 0 42.1732 0H205V38.2251H188.113V16.4502H42.1732C28.2192 16.4502 16.8871 27.5325 16.8871 41.1256V183.55H143.229V200Z"
                fill="#ffffff"
                fillOpacity="0.22"
              />
            </svg>
            <div className="masthead-copy">
              <h1>Global insights for senior IT professionals</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="resources-section" style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className="section wrap">
          <div className="section-head">
            <h2>Featured resources</h2>
            <Link href="/resources" className="view-all">Browse all resources &rarr;</Link>
          </div>
          <div className="featured-resources-grid">
            {featured && (
              <Link href={`/resources/${featured.slug}`} className="featured-resource">
                <ImageWithFallback src={featured.image} alt="" />
                <div className="featured-resource-overlay">
                  <span className="format-tag" style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}>
                    {featured.resourceType[0]}
                  </span>
                  <h3>{featured.header}</h3>
                  <p>{featured.teaser}</p>
                  <span className="featured-resource-cta">{featured.ctaLabel} &rarr;</span>
                </div>
              </Link>
            )}
            {regularResources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <RecommendedRail resources={resources} />

      <div className="ticker">
        <div className="ticker-inner">
          <div className="ticker-label">
            <span className="ticker-dot" />Latest
          </div>
          <div className="ticker-track-outer">
            <div className="ticker-track">
              {[...latestNews, ...latestNews].map((item, i) => (
                <a
                  key={`${item.id}-${i}`}
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="section news-section">
        <div className="wrap">
          <div className="section-head">
            <h2>Latest news</h2>
            <Link href="/news" className="view-all">View all news &rarr;</Link>
          </div>
          <div className="chips">
            <Link href="/news" className="chip active">All</Link>
            {TOPICS.map((t) => (
              <Link key={t.key} href={`/news?topic=${t.key}`} className="chip">{t.label}</Link>
            ))}
          </div>
          <div className="news-grid">
            {latestNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
