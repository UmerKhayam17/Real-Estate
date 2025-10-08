// services/auth.service.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'replace_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const crypto = require("crypto");
const bcrypt = require('bcrypt');


exports.jwtSign = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.jwtVerify = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// ---------------- UserId Generator ----------------
exports.generateUserId = (identifier) => {
  // Add timestamp and random bytes to ensure uniqueness
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(4).toString('hex');
  const hash = crypto
    .createHash("sha256")
    .update(identifier + timestamp + randomBytes)
    .digest("hex");
  return "USR-" + hash.substring(0, 10).toUpperCase();
}