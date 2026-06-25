/**
 * src/validators/transaction.validator.js
 *
 * Zod schemas for validating transaction request bodies.
 */

const { z } = require('zod');

const createTransactionSchema = z.object({
  amount:      z.number({ required_error: 'Amount is required and must be a positive number' })
                .positive('Amount is required and must be a positive number'),
  type:        z.enum(['income', 'expense'], {
                  errorMap: () => ({ message: 'Invalid transaction type. Must be income or expense' })
                }),
  categoryId:  z.string().uuid('categoryId must be a valid UUID'),
  description: z.string()
                .min(1,   'Description is required')
                .max(255, 'Description must not exceed 255 characters'),
  date:        z.string().regex(
                  /^\d{4}-\d{2}-\d{2}$/,
                  'Invalid date format. Use ISO 8601 (YYYY-MM-DD)'
                ),
  isRecurring: z.boolean().optional().default(false),
  groupId:     z.string().uuid().optional().nullable(),
});

const listTransactionSchema = z.object({
  type:       z.enum(['income', 'expense']).optional(),
  categoryId: z.string().uuid().optional(),
  startDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  endDate:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  groupId:    z.string().uuid().optional(),
  page:       z.coerce.number().int().positive().optional().default(1),
  limit:      z.coerce.number().int().positive().max(100).optional().default(20),
});

module.exports = { createTransactionSchema, listTransactionSchema };
