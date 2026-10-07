import mongoose from 'mongoose';

const searchLogSchema = new mongoose.Schema({
  platform: { type: String, enum: ['leetcode', 'github'], required: true },
  username: { type: String, required: true, lowercase: true, trim: true },
  originalUsername: { type: String, required: true },
  searchCount: { type: Number, default: 1 },
  email: { type: String, default: null },
  lastSearchedAt: { type: Date, default: Date.now },
});

searchLogSchema.index({ platform: 1, username: 1 }, { unique: true });

export default mongoose.model('SearchLog', searchLogSchema);
