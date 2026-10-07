import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ShareButton from '../ShareButton';

function GhStarsSlide({ data, username, avatar }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const totalStars = data.repos?.totalStars || 0;
  const topRepo = data.repos?.topRepo;

  useEffect(() => {
    const duration = 1800;
    const steps = 50;
    const increment = totalStars / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalStars) {
        setDisplayNumber(totalStars);
        clearInterval(timer);
      } else {
        setDisplayNumber(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [totalStars]);

  return (
    <motion.div
      className="slide stats-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem', textAlign: 'center' }}
        >
          You've earned
        </motion.div>

        <motion.div
          className="stat-number"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8, delay: 0.4 }}
        >
          ⭐ {displayNumber.toLocaleString()}
        </motion.div>

        <motion.div className="stat-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ textAlign: 'center' }}>
          stars across your repos
        </motion.div>

        {topRepo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            style={{
              marginTop: '3rem',
              padding: '1.5rem 2rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              maxWidth: '360px',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>Top repo</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#56d364', marginTop: '0.4rem' }}>{topRepo.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.4rem' }}>
              ⭐ {topRepo.stars} · 🍴 {topRepo.forks} {topRepo.language ? `· ${topRepo.language}` : ''}
            </div>
          </motion.div>
        )}
      </div>
      <ShareButton username={username} avatar={avatar} platform="github" />
    </motion.div>
  );
}

export default GhStarsSlide;
