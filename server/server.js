import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import githubRouter from './routes/github.js';
import logRouter from './routes/log.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// simple request log
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/github', githubRouter);
app.use('/api/log', logRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection failed — continuing without it:', err.message);
    }
  } else {
    console.warn('No MONGO_URI set — search logging will be skipped.');
  }

  app.listen(PORT, () => console.log(`DevWrapped API running on :${PORT}`));
}

start();
