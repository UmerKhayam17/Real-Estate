// jobs/subscriptionChecker.js
const Subscription = require('../models/Subscription.model');

async function checkSubscriptions() {
  const now = new Date();
  const expired = await Subscription.find({ endAt: { $lt: now }, active: true });
  for (const s of expired) {
    s.active = false;
    await s.save();
    console.log(`Subscription expired for user ${s.user}`);
    // TODO: notify user
  }
}

module.exports = checkSubscriptions;
