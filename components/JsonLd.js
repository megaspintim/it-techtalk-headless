// Renders a JSON-LD <script> tag. Server-renderable (no 'use client' needed)
// since it's just static markup — keeps structured data in the initial HTML
// for crawlers rather than requiring JS execution.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
