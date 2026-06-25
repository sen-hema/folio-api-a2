/**
 * src/routes/transactions.js
 *
 * Transaction routes — all protected by authenticate middleware.
 * authenticate() runs first, then the controller function.
 */

const express        = require('express');
const authenticate   = require('../middleware/authenticate');
const controller     = require('../controllers/transaction.controller');

const router = express.Router();

// GET  /api/transactions — list transactions (with optional filters)
router.get('/',  authenticate, controller.list);

// POST /api/transactions — create a new transaction
router.post('/', authenticate, controller.create);

module.exports = router;
