'use client';

import Link from 'next/link';
import { TOPICS } from '../lib/topics';

export default function BrowseByTopic() {
  return (
    <section className="topics-section">
      <div className="section wrap">
        <div className="section-head">
          <h2>Browse by topic</h2>
        </div>
        <div className="topics-layout">
          <div className="topics-grid">
            {TOPICS.map((topic) => (
              <Link key={topic.key} href={`/news?topic=${topic.key}`} className="topic-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="topic-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={topic.icon} />
                  </svg>
                </div>
                <div>
                  <h4>{topic.label}</h4>
                  <p>{topic.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="newsletter-box" id="newsletter">
            <h3>Stay informed</h3>
            <p>Get notified when we publish new research, guides, and case studies — no fixed schedule, just the good stuff when it's ready.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@company.com" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
