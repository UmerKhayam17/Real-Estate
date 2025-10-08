// middlewares/optionalAuth.middleware.js
const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
   const token = req.header('Authorization')?.replace('Bearer ', '');

   if (token) {
      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;
      } catch (error) {
         // Token is invalid, but we continue without user info
         req.user = null;
      }
   } else {
      req.user = null;
   }

   next();
};

module.exports = optionalAuth;