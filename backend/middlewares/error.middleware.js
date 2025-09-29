// middlewares/error.middleware.js
const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error(err && err.stack ? err.stack : err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};
