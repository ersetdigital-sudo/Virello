'use client';

import { useCallback, useEffect } from 'react';
import { usePathname, useRouter as useNextRouter } from 'next/navigation';

export interface NavigateOptions {
  category?: string;
  scrollSelector?: string;
}

interface RouterContextType {
  currentPath: string;
  navigate: (path: string, options?: NavigateOptions) => void;
}

/**
 * Compatibility layer over next/navigation that preserves the exact API and
 * behavior of the original Vite SPA router:
 *
 * - `currentPath` mirrors `window.location.pathname`.
 * - `navigate(path)` pushes a history entry, then smooth-scrolls to the top.
 * - `navigate(path, { scrollSelector })` pushes, then after 80ms scrolls to
 *   the first matching element (falling back to the top when absent).
 * - `options.category` was accepted-but-unused by the original provider
 *   (the real category filter runs through `onSelectCategoryById`), so it
 *   stays accepted here for call-site compatibility.
 * - Back/forward (popstate) smooth-scrolls to the top like the original.
 *
 * `scroll: false` is passed to the Next router so scrolling is driven only
 * by this function, matching the original SPA timing/feel.
 */
export function useRouter(): RouterContextType {
  const pathname = usePathname();
  const router = useNextRouter();

  const navigate = useCallback(
    (path: string, options?: NavigateOptions) => {
      router.push(path, { scroll: false });

      if (options?.scrollSelector) {
        const selector = options.scrollSelector;
        // The original SPA resolved the target synchronously after 80ms.
        // Under App Router the destination view commits asynchronously, so
        // retry briefly before falling back to a top scroll.
        let attempts = 0;
        const tryScroll = () => {
          const el = document.querySelector(selector);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (++attempts < 16) {
            setTimeout(tryScroll, 50);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        };
        setTimeout(tryScroll, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [router]
  );

  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { currentPath: pathname || '/', navigate };
}
