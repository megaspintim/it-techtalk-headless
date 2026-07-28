import ParallaxBg from '../../components/ParallaxBg';
import ResourceCard from '../../components/ResourceCard';
import JsonLd from '../../components/JsonLd';
import { ResourcesSidebarFilters, ResourcesToolbar } from '../../components/ResourcesFilters';
import { getAllResources } from '../../lib/data';

const MASTHEAD_PHOTO = 'https://static.wixstatic.com/media/a2f082_879d00ebcad740ffb7407b8a0b36381d~mv2.avif';
const SITE_URL = 'https://it-techtalk-headless.vercel.app';
const PAGE_SIZE = 8;

export const metadata = {
  title: 'Resources | IT-TechTalk'
};

export default async function ResourcesListPage({ searchParams }) {
  const params = await searchParams;
  const formatFilter = (params.format || '').split(',').filter(Boolean);
  const topicFilter = (params.topic || '').split(',').filter(Boolean);
  const sort = params.sort || 'newest';
  const page = parseInt(params.page || '1', 10);

  let items = await getAllResources();

  if (formatFilter.length > 0) {
    items = items.filter((r) => r.resourceType.some((t) => formatFilter.includes(t)));
  }
  if (topicFilter.length > 0) {
    items = items.filter((r) => r.topic.some((t) => topicFilter.includes(t)));
  }

  items =
    sort === 'az'
      ? [...items].sort((a, b) => a.title.localeCompare(b.title))
      : [...items].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/resources` }
          ]
        }}
      />
      <section className="page-header">
        <ParallaxBg imageUrl={MASTHEAD_PHOTO} />
        <div className="wrap page-header-inner">
          <div className="breadcrumb">
            <a href="/">Home</a><span className="sep">/</span><span>Resources</span>
          </div>
          <h1>Resources</h1>
          <p>Case studies, guides, eBooks and videos to help you plan, build and scale your technology strategy.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="list-layout">
            <ResourcesSidebarFilters />
            <div>
              <div className="list-toolbar">
                <span className="result-count">
                  {items.length} resource{items.length === 1 ? '' : 's'}
                </span>
                <ResourcesToolbar />
              </div>

              <div className="res-list-grid">
                {pageItems.map((resource) => (
                  <ResourceCard key={resource.slug} resource={resource} />
                ))}
              </div>

              {pageItems.length === 0 && (
                <p style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                  No resources match the selected filters.
                </p>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`?${new URLSearchParams({ ...params, page: p }).toString()}`}
                      className={`page-btn${p === page ? ' active' : ''}`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
