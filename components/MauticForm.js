'use client';

import { useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';

// Different resources' forms can come from different Mautic instances
// (different domain per platform/campaign), so nothing about the domain
// can be hardcoded — it's pulled directly out of each form's own
// action="https://DOMAIN/form/submit?formId=X" attribute.
function extractMauticDomain(html) {
  const match = html.match(/action="(https?:\/\/[^/"]+)\/form\/submit/i);
  return match ? match[1] : null;
}

function extractFormId(html) {
  const match = html.match(/formId=(\d+)/);
  return match ? match[1] : null;
}

// Strips every trace of Mautic's own visual styling from the raw form HTML:
//   1. Its own <style scoped> blocks (base theme)
//   2. Any embedded <style> blocks from per-form customizations (we saw a
//      real example of this — a button color override using !important,
//      which would otherwise fight our CSS on equal specificity)
//   3. Cosmetic inline style="..." properties (color, background, border,
//      font-size, etc.) on individual elements (submit button, checkbox
//      labels, etc.)
// One important exception: `display` declarations in inline styles are
// PRESERVED, not stripped. Mautic's own JS uses inline style="display:none"
// as the functional default-hidden state for validation error messages
// (and toggles it on submit) — stripping that blindly made every error
// message visible from page load instead of only after a failed attempt.
// Everything else in a given style attribute is still removed, so our CSS
// (see .mautic-form-skin rules in globals.css) controls all the actual
// visual styling on its own terms.
function sanitizeMauticHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\sstyle="([^"]*)"/gi, (match, styleContent) => {
      const displayDecl = styleContent
        .split(';')
        .map((s) => s.trim())
        .find((s) => /^display\s*:/i.test(s));
      return displayDecl ? ` style="${displayDecl}"` : '';
    });
}

export default function MauticForm({ html }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const domain = extractMauticDomain(html);
    if (!domain) {
      console.error('MauticForm: could not find a form action URL to determine the Mautic domain.');
      return;
    }

    const formId = extractFormId(html);

    function initMauticForms() {
      if (window.MauticSDK && typeof window.MauticSDK.onLoad === 'function') {
        window.MauticSDK.onLoad();
      }
    }

    // Track which domains' SDK scripts have already been loaded on this
    // page — a visitor could land on a resource from Domain A, then
    // navigate (client-side) to a different resource whose form is on
    // Domain B, and both need their own SDK script present.
    window.__loadedMauticDomains = window.__loadedMauticDomains || new Set();

    if (window.__loadedMauticDomains.has(domain)) {
      // This domain's SDK is already loaded — just re-bind to the
      // (new) form that's now in the DOM.
      initMauticForms();
    } else {
      window.MauticDomain = domain;
      window.MauticLang = window.MauticLang || { submittingMessage: 'Please wait...' };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `${domain}/media/js/mautic-form.js`;
      script.onload = () => {
        window.__loadedMauticDomains.add(domain);
        initMauticForms();
      };
      document.head.appendChild(script);
    }

    // "Started" — fires once, the first time a visitor interacts with any
    // field in the form (not just page view, which tells us little about
    // actual intent to convert).
    const container = containerRef.current;
    let startedTracked = false;
    function handleFirstInteraction() {
      if (startedTracked) return;
      startedTracked = true;
      track('mautic_form_started', { formId });
    }
    container?.addEventListener('focusin', handleFirstInteraction);

    // "Completed" — Mautic adds a `mauticform-post-success` class to the
    // form wrapper on a genuinely successful submission; watching for that
    // is more reliable than guessing at a specific submit-click outcome.
    const wrapperEl = container?.querySelector('.mauticform_wrapper');
    let observer;
    if (wrapperEl) {
      observer = new MutationObserver(() => {
        if (wrapperEl.classList.contains('mauticform-post-success')) {
          track('mautic_form_completed', { formId });
          observer.disconnect();
        }
      });
      observer.observe(wrapperEl, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      container?.removeEventListener('focusin', handleFirstInteraction);
      observer?.disconnect();
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="mautic-form-skin"
      dangerouslySetInnerHTML={{ __html: sanitizeMauticHtml(html) }}
    />
  );
}
