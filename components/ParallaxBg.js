'use client';

import { useEffect, useRef } from 'react';

export default function ParallaxBg({ imageUrl }) {
  const ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !ref.current) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const offset = Math.min(window.scrollY * 0.3, 60);
          if (ref.current) ref.current.style.transform = `translateY(${offset}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="masthead-bg"
      style={{ backgroundImage: `url('${imageUrl}')` }}
    />
  );
}
