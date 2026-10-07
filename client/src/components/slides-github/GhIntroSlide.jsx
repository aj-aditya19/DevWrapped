import { motion } from 'framer-motion';

function GhIntroSlide({ username, data }) {
  const avatar = data.profile?.avatar;

  return (
    <motion.div
      className="slide intro-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="slide-content">
        {avatar && (
          <motion.img
            src={avatar}
            alt={username}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              marginBottom: '2rem',
              border: '4px solid rgba(46, 160, 67, 0.5)',
              boxShadow: '0 0 40px rgba(46, 160, 67, 0.3)',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1, delay: 0.2 }}
          />
        )}

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}
        >
          <span
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              background: 'linear-gradient(135deg, #2ea043 0%, #56d364 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {username}'s
          </span>
          <br />
          <span style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            {new Date().getFullYear()} GitHub Journey
          </span>
        </motion.h1>
      </div>
    </motion.div>
  );
}

export default GhIntroSlide;
