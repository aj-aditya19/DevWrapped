import { motion } from 'framer-motion';
import ShareButton from '../ShareButton';

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Shell: '#89e051',
};

function GhLanguageSlide({ data, username, avatar }) {
  const languages = (data.repos?.languages || []).slice(0, 5);
  const top = languages[0];
  const maxCount = top?.reposCount || 1;

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
          style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem', textAlign: 'center' }}
        >
          Your go-to language was
        </motion.div>

        {top && (
          <motion.div
            className="stat-number"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.4 }}
            style={{ fontSize: 'clamp(2.2rem, 8vw, 4rem)', color: LANG_COLORS[top.languageName] || '#56d364' }}
          >
            {top.languageName}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ width: '100%', maxWidth: '360px', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {languages.map((lang, i) => (
            <motion.div
              key={lang.languageName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>
                <span>{lang.languageName}</span>
                <span>{lang.reposCount} repos</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(lang.reposCount / maxCount) * 100}%` }}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
                  style={{ height: '100%', background: LANG_COLORS[lang.languageName] || '#56d364', borderRadius: '4px' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <ShareButton username={username} avatar={avatar} platform="github" />
    </motion.div>
  );
}

export default GhLanguageSlide;
