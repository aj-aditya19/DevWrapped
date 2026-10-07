import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Landing({ onSubmit, error }) {
  const [githubUsername, setGithubUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setSnowflakes(flakes);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubUsername.trim()) return;

    setIsSubmitting(true);
    await onSubmit({
      githubUsername: githubUsername.trim(),
    });
    setIsSubmitting(false);
  };

  const canSubmit = githubUsername.trim();

  return (
    <motion.div
      className="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="landing-content">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ background: 'none', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' }}
        >
          <span style={{ color: '#fea216' }}>dev</span>
          <span style={{
            background: 'linear-gradient(to top, #f32426, #56d364, #ffffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontStyle: 'italic',
            paddingRight: '0.2em'
          }}>wrapped</span>
        </motion.h1>

        <motion.div
          className="year"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {new Date().getFullYear()}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.95rem' }}
        >
          drop your GitHub username and get your wrapped card
        </motion.p>

        <motion.form
          className="input-container"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              className="username-input"
              placeholder="github username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                borderRadius: '50px',
                height: '56px',
                paddingLeft: '24px',
                background: 'rgba(45, 45, 45, 0.8)',
                border: '2px solid rgba(46, 160, 67, 0.4)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '56px',
              borderRadius: '50px',
              background: canSubmit ? 'linear-gradient(135deg, #2ea043, #56d364)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: isSubmitting || !canSubmit ? 'default' : 'pointer',
              opacity: canSubmit ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {isSubmitting ? (
              <motion.div
                style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              'Get wrapped'
            )}
          </button>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </motion.form>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            style={{
              position: 'absolute',
              left: `${flake.x}%`,
              top: '-20px',
              width: flake.size,
              height: flake.size,
              borderRadius: '50%',
              background: 'white',
              opacity: flake.opacity,
              filter: 'blur(0.5px)',
            }}
            animate={{ y: ['0vh', '110vh'], x: [0, Math.sin(flake.id) * 50] }}
            transition={{ duration: flake.duration, repeat: Infinity, delay: flake.delay, ease: 'linear' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Landing;
