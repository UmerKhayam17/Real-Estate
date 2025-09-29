// server.js
const express = require('express');5
const dotenv = require('dotenv');
const loaders = require('./loaders');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await loaders(app);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
