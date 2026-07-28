'use client';

import { useState } from 'react';

// The same photo already used behind every page header, site-wide — proven
// reliable (it's been loading successfully everywhere else on the site),
// on-brand, and avoids needing a separate placeholder graphic just for
// failure cases.
const DEFAULT_FALLBACK =
  'https://static.wixstatic.com/media/a2f082_879d00ebcad740ffb7407b8a0b36381d~mv2.avif';

// Handles genuine runtime load failures (hotlink protection, dead links,
// CORS blocks, 404s) — not the same thing as a missing URL at build time,
// which lib/rss.js already covers separately. A plain <img> just shows a
// broken-image icon or empty space on failure; this swaps to a fallback
// image instead, the moment the browser actually fails to load it.
export default function ImageWithFallback({ src, alt = '', fallback = DEFAULT_FALLBACK, ...rest }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
      {...rest}
    />
  );
}
