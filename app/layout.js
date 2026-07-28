import { Suspense } from 'react';
import { Inter, Source_Serif_4, Schibsted_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import BrowseByTopic from '../components/BrowseByTopic';
import JsonLd from '../components/JsonLd';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', weight: ['500', '600', '700'] });
const schibsted = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-schibsted', weight: ['700', '800', '900'] });

export const metadata = {
  title: 'IT-TechTalk | Global insights for senior IT professionals',
  description:
    'Enterprise technology news, research and expert perspectives on AI, cloud, cyber security, data and infrastructure.'
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'IT-TechTalk',
      url: 'https://it-techtalk-headless.vercel.app',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Quantum Marketing Group'
      }
    },
    {
      '@type': 'WebSite',
      name: 'IT-TechTalk',
      url: 'https://it-techtalk-headless.vercel.app',
      description:
        'Global insights and best practices for senior IT professionals.'
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${schibsted.variable}`}>
      <body>
        <JsonLd data={siteJsonLd} />

        {/* SiteHeader uses useSearchParams (for mega-menu active state), which
            requires a Suspense boundary around it in the App Router */}
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>

        {children}

        <BrowseByTopic />
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
