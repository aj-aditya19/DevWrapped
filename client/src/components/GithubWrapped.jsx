import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubButton } from './GithubButton';
import GhIntroSlide from './slides-github/GhIntroSlide';
import GhProfileSlide from './slides-github/GhProfileSlide';
import GhStarsSlide from './slides-github/GhStarsSlide';
import GhLanguageSlide from './slides-github/GhLanguageSlide';
import GhContributionsSlide from './slides-github/GhContributionsSlide';
import GhWeekdaySlide from './slides-github/GhWeekdaySlide';
import GhFinalSlide from './slides-github/GhFinalSlide';

function GithubWrapped({ data, username, onRestart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const avatar = data.profile?.avatar;

  const slides = [
    { component: GhIntroSlide, props: { username, data } },
    { component: GhProfileSlide, props: { data, username, avatar } },
    { component: GhContributionsSlide, props: { data, username, avatar } },
    { component: GhWeekdaySlide, props: { data, username, avatar } },
    { component: GhStarsSlide, props: { data, username, avatar } },
    { component: GhLanguageSlide, props: { data, username, avatar } },
    { component: GhFinalSlide, props: { data, username, avatar } },
  ];

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < slides.length) setCurrentSlide(index);
  }, [slides.length]);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    let touchStartX = 0;
    const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) (diff > 0 ? nextSlide() : prevSlide());
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <motion.div className="wrapped-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="wrapped-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center',
          justifyContent: 'flex-start', padding: '1.25rem 1.5rem', gap: '0.5rem', cursor: 'pointer',
        }}
        onClick={onRestart}
      >
        <span style={{ fontFamily: 'Clash Display, sans-serif', fontSize: '1.4rem', fontWeight: 700 }}>
          <span style={{ color: '#e6edf3' }}>github</span>{' '}
          <span
            style={{
              background: 'linear-gradient(to top, #2ea043, #ffffff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontStyle: 'italic', paddingRight: '0.2em',
            }}
          >
            wrapped
          </span>
        </span>
      </motion.div>

      <motion.div className="github-star-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <GithubButton separator roundStars label="" repoUrl="https://github.com/aj-aditya19/leetcodewrapped" variant="outline" />
      </motion.div>

      <AnimatePresence mode="wait">
        <CurrentSlideComponent key={currentSlide} {...slides[currentSlide].props} />
      </AnimatePresence>

      <div className="nav-buttons">
        <button className="nav-btn" onClick={prevSlide} disabled={currentSlide === 0}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button className="nav-btn" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="slide-indicator">
        {slides.map((_, index) => (
          <div key={index} className={`indicator-dot ${index === currentSlide ? 'active' : ''}`} onClick={() => goToSlide(index)} />
        ))}
      </div>
    </motion.div>
  );
}

export default GithubWrapped;
