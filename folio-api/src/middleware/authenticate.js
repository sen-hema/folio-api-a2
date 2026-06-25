/**
 * src/middleware/authenticate.js
 *
 * Express middleware that verifies the JWT on every protected route.
 *
 * How it works:
 *   1. Reads the Authorization header: "Bearer <token>"
 *   2. Extracts the token and verifies its signature using JWT_SECRET
 *   3. If valid: attaches the decoded payload to req.user and calls next()
 *   4. If invalid or missing: returns 401 immediately
 *
 * Usage in routes:
 *   router.get('/transactions', authenticate, transactionController.list);
 */

const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  // Extract token from "Authorization: Bearer <token>" header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized. JWT token missing or invalid',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify signature and expiry — throws if invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req so route handlers can access it
    // decoded contains: { userId, email, iat, exp }
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized. JWT token missing or invalid',
    });
  }
}

module.exports = authenticate;
