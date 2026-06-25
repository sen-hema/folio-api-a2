/**
 * src/index.js
 *
 * Entry point for the Folio Express API.
 * Sets up middleware, mounts routes, and starts the server.
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes        = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
// Render pings this to confirm the service is alive
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/transactions', transactionRoutes);

// ─── ERROR HANDLERS ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Folio API running on port ${PORT}`);
});
