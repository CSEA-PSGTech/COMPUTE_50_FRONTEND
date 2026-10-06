import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scroll = () => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      scroll();
      const t1 = setTimeout(scroll, 100);
      const t2 = setTimeout(scroll, 350);
      const t3 = setTimeout(scroll, 700);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};
