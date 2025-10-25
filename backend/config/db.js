// config/db.js
const mongoose = require('mongoose');

module.exports = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env');
  try {
    await mongoose.connect(uri, { dbName: 'realestate_db' });
    // console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};
