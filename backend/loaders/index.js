// loaders/index.js
// Load environment variables FIRST - before any other imports
require('dotenv').config();

const expressLoader = require('./express');
const connectDB = require('../config/db');

module.exports = async (app) => {
  // connect DB first
  await connectDB();
  // init express with routes & middleware
  expressLoader(app);
};