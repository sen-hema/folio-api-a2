/**
 * src/controllers/auth.controller.js
 *
 * Handles register and login.
 * Each function:
 *   1. Validates input with Zod
 *   2. Performs business logic
 *   3. Returns a JSON response
 *
 * Errors are passed to next() so the global errorHandler deals with them.
 */

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const prisma = new PrismaClient();

// ─── HELPER ──────────────────────────────────────────────────────────────────
// Signs a JWT containing the user's id and email
function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

// Strips passwordHash from the user object before returning it
function safeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    // 1. Validate request body with Zod
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0].message;
      return res.status(400).json({ message });
    }

    const { firstName, lastName, email, university, password } = result.data;

    // 2. Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // 3. Hash password with bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Create the user in the database
    const user = await prisma.user.create({
      data: { firstName, lastName, email, university, passwordHash },
    });

    // 5. Sign and return JWT
    const token = signToken(user);

    return res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    // 1. Validate request body
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { email, password } = result.data;

    // 2. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // 3. Compare password — use generic message to prevent user enumeration
    const passwordMatch = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !passwordMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // 4. Sign and return JWT
    const token = signToken(user);

    return res.status(200).json({ token, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
