import { motion } from 'framer-motion';
import ShareButton from '../ShareButton';

function GhWeekdaySlide({ data, username, avatar }) {
  const calendar = data.calendar || {};
  const weekdayTotals = calendar.weekdayTotals || [];
  const favorite = calendar.favoriteWeekday;
  const maxCount = Math.max(...weekdayTotals.map((w) => w.count), 1);

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
          style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem', textAlign: 'center' }}
        >
          Your favorite day to ship was
        </motion.div>

        {favorite && (
          <motion.div
            className="stat-number"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.4 }}
            style={{ fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', background: 'linear-gradient(135deg, #2ea043 0%, #56d364 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            {favorite}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{ width: '100%', maxWidth: '360px', marginTop: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', gap: '0.5rem' }}
        >
          {weekdayTotals.map((w, i) => (
            <div key={w.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((w.count / maxCount) * 100, 4)}%` }}
                transition={{ delay: 1 + i * 0.08, duration: 0.5 }}
                style={{
                  width: '100%',
                  borderRadius: '6px 6px 0 0',
                  background: w.name === favorite ? 'linear-gradient(180deg, #56d364, #2ea043)' : 'rgba(255,255,255,0.15)',
                }}
              />
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.4rem' }}>{w.name.slice(0, 3)}</div>
            </div>
          ))}
        </motion.div>
      </div>
      <ShareButton username={username} avatar={avatar} platform="github" />
    </motion.div>
  );
}

export default GhWeekdaySlide;
