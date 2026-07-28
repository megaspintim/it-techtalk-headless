import ResourceCard from '../../components/ResourceCard';
import NewsCard from '../../components/NewsCard';
import { searchContent } from '../../lib/data';

const PAGE_SIZE = 8;

export const metadata = {
  title: 'Search | IT-TechTalk'
};

function buildHref(params, overrides) {
  const merged = new URLSearchParams(params);
  Object.entries(overrides).forEach(([key, value]) => merged.set(key, value));
  return `?${merged.toString()}`;
}

function Pagination({ params, pageKey, currentPage, totalPages }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <a
          key={p}
          href={buildHref(params, { [pageKey]: p })}
          className={`page-btn${p === currentPage ? ' active' : ''}`}
        >
          {p}
        </a>
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.q || '';
  const resourcesPage = parseInt(params.resourcesPage || '1', 10);
  const newsPage = parseInt(params.newsPage || '1', 10);

  const { resources, news } = await searchContent(query);
  const totalResults = resources.length + news.length;

  const resourcesTotalPages = Math.max(1, Math.ceil(resources.length / PAGE_SIZE));
  const pagedResources = resources.slice(
    (resourcesPage - 1) * PAGE_SIZE,
    resourcesPage * PAGE_SIZE
  );

  const newsTotalPages = Math.max(1, Math.ceil(news.length / PAGE_SIZE));
  const pagedNews = news.slice((newsPage - 1) * PAGE_SIZE, newsPage * PAGE_SIZE);

  return (
    <>
      <section className="page-header" style={{ background: 'var(--main)' }}>
        <div className="wrap page-header-inner">
          <div className="breadcrumb">
            <a href="/">Home</a><span className="sep">/</span><span>Search</span>
          </div>
          <h1>
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          {query && (
            <p>
              {totalResults} result{totalResults === 1 ? '' : 's'} found across news and resources.
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {!query && (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
              Enter a search term to find news and resources.
            </p>
          )}

          {query && totalResults === 0 && (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
              No results for &ldquo;{query}&rdquo;. Try a different search term.
            </p>
          )}

          {resources.length > 0 && (
            <div style={{ marginBottom: 44 }}>
              <div className="section-head">
                <h2>Resources ({resources.length})</h2>
              </div>
              <div className="res-list-grid">
                {pagedResources.map((r) => (
                  <ResourceCard key={r.slug} resource={r} />
                ))}
              </div>
              <Pagination
                params={params}
                pageKey="resourcesPage"
                currentPage={resourcesPage}
                totalPages={resourcesTotalPages}
              />
            </div>
          )}

          {news.length > 0 && (
            <div>
              <div className="section-head">
                <h2>News ({news.length})</h2>
              </div>
              <div className="news-grid grid-2col">
                {pagedNews.map((n) => (
                  <NewsCard key={n.id} item={n} />
                ))}
              </div>
              <Pagination
                params={params}
                pageKey="newsPage"
                currentPage={newsPage}
                totalPages={newsTotalPages}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
