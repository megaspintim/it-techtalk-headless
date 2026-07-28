import ParallaxBg from '../../components/ParallaxBg';
import NewsCard from '../../components/NewsCard';
import { NewsSidebarFilters, NewsToolbar } from '../../components/NewsFilters';
import { getAllNews, getNewsByTopic } from '../../lib/data';
import { getTopicLabel } from '../../lib/topics';

const MASTHEAD_PHOTO = 'https://static.wixstatic.com/media/a2f082_879d00ebcad740ffb7407b8a0b36381d~mv2.avif';
const PAGE_SIZE = 9;

export const metadata = {
  title: 'Latest news | IT-TechTalk'
};

export default async function NewsListPage({ searchParams }) {
  const params = await searchParams;
  const topicFilter = (params.topic || '').split(',').filter(Boolean);
  const sort = params.sort || 'newest';
  const page = parseInt(params.page || '1', 10);

  let items =
    topicFilter.length === 1 ? await getNewsByTopic(topicFilter[0]) : await getAllNews();

  if (topicFilter.length > 1) {
    items = items.filter((n) => n.topics.some((t) => topicFilter.includes(t)));
  }

  items = items.sort((a, b) => {
    const diff = new Date(b.publishDate) - new Date(a.publishDate);
    return sort === 'oldest' ? -diff : diff;
  });

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const heading =
    topicFilter.length === 1 ? `${getTopicLabel(topicFilter[0])} news` : 'Latest news';

  return (
    <>
      <section className="page-header">
        <ParallaxBg imageUrl={MASTHEAD_PHOTO} />
        <div className="wrap page-header-inner">
          <div className="breadcrumb">
            <a href="/">Home</a><span className="sep">/</span><span>News</span>
          </div>
          <h1>{heading}</h1>
          <p>Every story from across AI, cyber security, cloud, infrastructure and more. Filter by topic or sort to find what matters to you.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="list-layout">
            <NewsSidebarFilters />
            <div>
              <div className="list-toolbar">
                <span className="result-count">
                  {items.length} article{items.length === 1 ? '' : 's'}
                </span>
                <NewsToolbar />
              </div>

              <div className="news-grid grid-2col">
                {pageItems.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>

              {pageItems.length === 0 && (
                <p style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                  No articles match the selected filters.
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
