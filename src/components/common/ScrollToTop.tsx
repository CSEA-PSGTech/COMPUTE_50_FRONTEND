import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (hash) {
      const scrollToHash = () => {
        const element = document.querySelector(hash);
        if (element) {
          if (lenis) {
            lenis.scrollTo(hash, { offset: -90, duration: 1.0 });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };

      scrollToHash();
      const t1 = setTimeout(scrollToHash, 100);
      const t2 = setTimeout(scrollToHash, 350);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash, lenis]);

  return null;
};
