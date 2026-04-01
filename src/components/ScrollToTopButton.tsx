import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] p-3 rounded-full bg-[#f5c518] hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(245,197,24,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,197,24,0.5)]"
    >
      <ChevronUp size={28} strokeWidth={3} />
    </button>
  );
};

export default ScrollToTopButton;
