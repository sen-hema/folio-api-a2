/**
 * src/routes/auth.js
 *
 * Auth routes — no JWT required (these are how you GET the JWT).
 */

const express    = require('express');
const controller = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register
router.post('/register', controller.register);

// POST /api/auth/login
router.post('/login', controller.login);

module.exports = router;
