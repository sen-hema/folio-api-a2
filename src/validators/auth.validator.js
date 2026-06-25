/**
 * src/validators/auth.validator.js
 *
 * Zod schemas for validating auth request bodies.
 * These run BEFORE any database operation, so invalid input
 * is rejected immediately with a clear 400 error message.
 */

const { z } = require('zod');

const registerSchema = z.object({
  firstName:  z.string().min(1,  'First name is required'),
  lastName:   z.string().min(1,  'Last name is required'),
  email:      z.string().email(  'Email is required and must be a valid email address'),
  university: z.string().min(1,  'University is required'),
  password:   z.string().min(8,  'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email:    z.string().email('Email and password are required'),
  password: z.string().min(1,   'Email and password are required'),
});

module.exports = { registerSchema, loginSchema };
