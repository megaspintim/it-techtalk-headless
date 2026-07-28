'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import SearchPill from './SearchPill';
import { TOPICS } from '../lib/topics';

export default function SiteHeader() {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const wrapRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get('topic');

  const isHome = pathname === '/';
  const isNews = pathname === '/news';
  const isResources = pathname.startsWith('/resources');
  const megaOpen = hoverOpen || pinnedOpen;

  // Click anywhere outside the mega-menu closes it if it was pinned open
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setPinnedOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <Link href="/" className="logo" aria-label="IT-TechTalk home">
            <svg width="135" height="30" viewBox="0 0 135 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 26, width: 'auto', display: 'block' }}>
              <path d="M29.6194 28.9424C28.8492 28.2351 28.4569 27.0763 28.4569 25.4528V16.4461H25.5V14.4521H28.4569V9.75H30.8763V14.4521H35.2427V16.4461H30.8763V25.4528C30.8763 26.369 31.0724 27.0225 31.4648 27.4132C31.8571 27.8107 32.5109 28.006 33.4336 28.006H35.25V30H33.4336C31.6609 30 30.3895 29.6497 29.6194 28.9424Z" fill="white"/>
              <path d="M39.0443 28.42C38.0169 27.3597 37.5 25.9599 37.5 24.2066V19.626C37.5 17.7896 38.0169 16.3066 39.0443 15.1839C40.0718 14.0613 41.4329 13.5 43.1277 13.5H45.6079C47.2242 13.5 48.5264 14.0475 49.5145 15.1355C50.5027 16.2234 51 17.6648 51 19.4597V22.2802H39.6791V24.1997C39.6791 25.3085 39.9997 26.2163 40.6345 26.9093C41.2693 27.6023 42.1003 27.9488 43.1343 27.9488H45.4312C46.439 27.9488 47.2569 27.6578 47.8852 27.0687C48.5134 26.4796 48.8209 25.6966 48.8209 24.7125H50.9411C50.9411 26.2926 50.4372 27.5677 49.4295 28.5447C48.4217 29.5149 47.0868 30 45.4312 30H43.1343C41.4394 30 40.0783 29.4733 39.0509 28.4131L39.0443 28.42ZM48.8209 20.2912V19.4597C48.8209 18.2816 48.5264 17.3392 47.944 16.6253C47.3616 15.9116 46.5829 15.5512 45.6144 15.5512H43.1343C42.1069 15.5512 41.2758 15.9255 40.6345 16.6739C39.9997 17.4223 39.6791 18.4063 39.6791 19.626V20.2982H48.8209V20.2912Z" fill="white"/>
              <path d="M55.5399 28.4138C54.5133 27.3539 54 25.9547 54 24.2021V19.6235C54 17.7878 54.5133 16.3054 55.5399 15.1833C56.5667 14.0611 57.9133 13.5 59.58 13.5H62.1067C63.6866 13.5 64.9667 13.9572 65.9267 14.8785C66.8933 15.7998 67.3733 17.005 67.3733 18.5013H65.2133C65.2133 17.6285 64.9333 16.915 64.3667 16.3677C63.8 15.8205 63.0467 15.5504 62.1 15.5504H59.5733C58.5667 15.5504 57.7533 15.9245 57.14 16.6725C56.52 17.4206 56.2133 18.4043 56.2133 19.6235V24.2021C56.2133 25.3313 56.5267 26.2387 57.1533 26.9244C57.78 27.6102 58.5999 27.9496 59.6066 27.9496H62.1333C63.0999 27.9496 63.8733 27.5963 64.46 26.8898C65.0467 26.1833 65.34 25.2481 65.34 24.0705H67.5C67.5 25.8439 67.0067 27.2708 66.02 28.3653C65.0333 29.4528 63.74 30 62.1333 30H59.6066C57.92 30 56.5667 29.4736 55.5333 28.4138H55.5399Z" fill="white"/>
              <path d="M69.75 8.25H72.0193V16.6397C72.5032 15.9142 73.1233 15.3366 73.8798 14.9C74.6362 14.4633 75.4062 14.2484 76.1831 14.2484H78.3911C79.8427 14.2484 81.0148 14.732 81.9075 15.706C82.8003 16.68 83.25 17.9562 83.25 19.528V30H80.9807V19.4676C80.9807 18.5137 80.7422 17.7412 80.2583 17.1367C79.7745 16.5389 79.1339 16.2367 78.3366 16.2367H76.2581C75.27 16.2367 74.3704 16.6128 73.5663 17.3719C72.7553 18.1309 72.2442 19.0981 72.0397 20.2736V30H69.7704V8.25H69.75Z" fill="white"/>
              <path d="M90.3694 28.9424C89.5993 28.2351 89.207 27.0763 89.207 25.4528V16.4461H86.25V14.4521H89.207V9.75H91.6263V14.4521H95.9925V16.4461H91.6263V25.4528C91.6263 26.3691 91.8225 27.0225 92.2147 27.4132C92.6071 27.8107 93.261 28.006 94.1841 28.006H96V30H94.1841C92.411 30 91.1395 29.6498 90.3694 28.9424Z" fill="white"/>
              <path d="M99.6272 28.7948C98.7094 27.9843 98.25 26.8968 98.25 25.5252V24.5C98.25 23.1562 98.7225 22.0756 99.675 21.2651C100.627 20.4547 101.882 20.046 103.445 20.046H105.472C106.172 20.046 106.892 20.1499 107.625 20.3647C108.365 20.5793 108.996 20.8634 109.522 21.2305V18.5706C109.522 17.67 109.249 16.9427 108.7 16.3747C108.152 15.8067 107.419 15.5227 106.514 15.5227H103.979C103.068 15.5227 102.341 15.7374 101.793 16.16C101.244 16.5894 100.971 17.1505 100.971 17.857H98.6887C98.6887 16.5548 99.1753 15.5019 100.148 14.6984C101.122 13.8949 102.396 13.5 103.986 13.5H106.522C108.083 13.5 109.344 13.9642 110.311 14.8924C111.27 15.8205 111.75 17.0467 111.75 18.5636V29.7437H109.598V27.4994C109.112 28.2683 108.474 28.8778 107.679 29.3281C106.884 29.7784 106.069 30 105.226 30H103.328C101.786 30 100.552 29.5913 99.6347 28.7809L99.6272 28.7948ZM105.288 27.9912C106.282 27.9912 107.166 27.6795 107.953 27.063C108.735 26.4465 109.263 25.6222 109.537 24.597V23.4125C109.112 23.0038 108.53 22.6782 107.775 22.4358C107.029 22.1933 106.261 22.0687 105.48 22.0687H103.451C102.588 22.0687 101.882 22.2903 101.341 22.7406C100.799 23.1908 100.532 23.7796 100.532 24.5V25.5252C100.532 26.2733 100.786 26.869 101.293 27.3193C101.799 27.7695 102.478 27.9912 103.321 27.9912H105.288Z" fill="white"/>
              <path d="M115.726 29.0193C115.073 28.3677 114.75 27.2863 114.75 25.775V8.25H116.947V25.775C116.947 26.5609 117.104 27.1318 117.421 27.4811C117.738 27.8303 118.252 28.0117 118.964 28.0117H120V30H118.964C117.46 30 116.379 29.6708 115.732 29.0193H115.726Z" fill="white"/>
              <path d="M132.253 30L126 22.6649L123.799 24.8076V29.9932H121.5V8.25H123.799V22.0738L131.68 14.4969H134.489L127.595 21.1468L135 30H132.253Z" fill="white"/>
              <path d="M10.5 9.75H12V21H10.5V9.75Z" fill="white"/>
              <path d="M16.2866 10.7783H12.75V9.75H21V10.7783H17.4633V21H16.2866V10.7783Z" fill="white"/>
              <path d="M21.4843 30H0V6.16883C0 2.76623 2.83969 0 6.32598 0H30.75V5.73377H28.217V2.46753H6.32598C4.23288 2.46753 2.53306 4.12987 2.53306 6.16883V27.5325H21.4843V30Z" fill="white"/>
            </svg>
          </Link>
          <div className="topbar-right">
            <SearchPill placeholder="Search IT-TechTalk" />
            <Link href="#newsletter" className="btn-sub">Subscribe</Link>
          </div>
        </div>
      </div>

      <nav className="subnav">
        <div className="wrap subnav-inner">
          <ul className="nav-list">
            <li className={isHome ? 'active' : ''}>
              <Link href="/">Home</Link>
            </li>

            <li
              ref={wrapRef}
              className={`nav-mega-wrap${megaOpen ? ' open' : ''}`}
              onMouseEnter={() => setHoverOpen(true)}
              onMouseLeave={() => setHoverOpen(false)}
            >
              <div className="nav-mega-trigger">
                <Link href="/news">News</Link>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={(e) => {
                    e.preventDefault();
                    setPinnedOpen((prev) => !prev);
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <div className="nav-mega-panel">
                <div className="nav-mega-grid">
                  {TOPICS.map((topic) => (
                    <Link
                      key={topic.key}
                      href={`/news?topic=${topic.key}`}
                      className={isNews && activeTopic === topic.key ? 'active' : ''}
                    >
                      <span className="topic-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={topic.icon} />
                        </svg>
                      </span>
                      {topic.label}
                    </Link>
                  ))}
                </div>
                <div className="nav-mega-footer">
                  <Link href="/news">View all news &rarr;</Link>
                </div>
              </div>
            </li>

            <li className={isResources ? 'active' : ''}>
              <Link href="/resources">Resources</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

