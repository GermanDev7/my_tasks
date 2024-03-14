const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
//For a more advanced setup, you can consider algorithms like the Token Bucket,
// Fixed Window, Sliding Window, and Leaky Bucket, each having its characteristics and use-cases.

module.exports = apiLimiter;
