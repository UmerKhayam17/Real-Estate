// middlewares/role.middleware.js
module.exports = (allowed = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!Array.isArray(allowed)) allowed = [allowed];
  if (allowed.length && !allowed.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
};
