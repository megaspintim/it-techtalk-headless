import { notFound } from 'next/navigation';
import ParallaxBg from '../../../components/ParallaxBg';
import ResourceCard from '../../../components/ResourceCard';
import MauticForm from '../../../components/MauticForm';
import ImageWithFallback from '../../../components/ImageWithFallback';
import TrackTopicView from '../../../components/TrackTopicView';
import JsonLd from '../../../components/JsonLd';
import { getAllResources, getResourceBySlug, getRelatedResources } from '../../../lib/data';

const MASTHEAD_PHOTO = 'https://static.wixstatic.com/media/a2f082_879d00ebcad740ffb7407b8a0b36381d~mv2.avif';
const SITE_URL = 'https://it-techtalk-headless.vercel.app';

export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: `${resource.title} | IT-TechTalk`,
    description: resource.teaser
  };
}

export default async function ResourceDetailPage({ params }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const related = await getRelatedResources(resource, 3);

  const pageUrl = `${SITE_URL}/resources/${resource.slug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.header,
    description: resource.teaser,
    image: resource.image,
    datePublished: resource.createdDate,
    publisher: {
      '@type': 'Organization',
      name: 'IT-TechTalk'
    },
    mainEntityOfPage: pageUrl
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/resources` },
      { '@type': 'ListItem', position: 3, name: resource.title, item: pageUrl }
    ]
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <TrackTopicView topics={resource.topic} />
      <section className="page-header">
        <ParallaxBg imageUrl={MASTHEAD_PHOTO} />
        <div className="wrap page-header-inner">
          <div className="breadcrumb">
            <a href="/">Home</a><span className="sep">/</span>
            <a href="/resources">Resources</a><span className="sep">/</span>
            <span>{resource.title}</span>
          </div>
          <span className="format-tag">{resource.resourceType[0]}</span>
          <h1>{resource.header}</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="detail-layout">
            <div className="detail-main">
              <span className="detail-eyebrow">{resource.resourceType[0]}</span>
              {/* body is Rich Content HTML from the CMS — same pattern as the Wix build */}
              <div dangerouslySetInnerHTML={{ __html: resource.body }} />
            </div>

            <aside className="gated-form-card">
              <ImageWithFallback src={resource.image} alt="" />
              <div className="gated-form-card-body">
                <h3>{resource.ctaLabel}</h3>
                <p>{resource.formIntro}</p>
                {resource.formEmbedCode && resource.formEmbedCode.includes('<form') ? (
                  <MauticForm html={resource.formEmbedCode} />
                ) : (
                  <div className="form-placeholder">
                    <span className="tag">Coming soon</span>
                    <p>The Mautic form for this resource will render here once the sync is connected.</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>People also downloaded</h2>
            </div>
            <div className="related-grid">
              {related.map((r) => (
                <ResourceCard key={r.slug} resource={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
