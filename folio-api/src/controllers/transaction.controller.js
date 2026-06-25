/**
 * src/controllers/transaction.controller.js
 *
 * Implements the two endpoints required for Assignment 2:
 *   - POST /api/transactions  → create()
 *   - GET  /api/transactions  → list()
 *
 * Security:
 *   - Both routes are protected by the authenticate middleware,
 *     so req.user is always populated with a valid user before
 *     these functions are called.
 *   - Transactions are always filtered by req.user.userId, so a user
 *     can never read or write another user's transactions.
 */

const { PrismaClient } = require('@prisma/client');
const { createTransactionSchema, listTransactionSchema } = require('../validators/transaction.validator');

const prisma = new PrismaClient();

// ─── CREATE TRANSACTION ──────────────────────────────────────────────────────
async function create(req, res, next) {
  try {
    // 1. Validate request body with Zod
    const result = createTransactionSchema.safeParse(req.body);
    if (!result.success) {
      // Return the first validation error message
      const message = result.error.issues[0].message;
      return res.status(400).json({ message });
    }

    const { amount, type, categoryId, description, date, isRecurring, groupId } = result.data;

    // 2. Verify the category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // 3. Create the transaction — always scoped to the authenticated user
    const transaction = await prisma.transaction.create({
      data: {
        amount:      amount,
        type:        type,
        description: description,
        date:        new Date(date),
        isRecurring: isRecurring,
        userId:      req.user.userId,   // from JWT — ensures ownership
        categoryId:  categoryId,
        groupId:     groupId ?? null,
      },
      // Include category in the response
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json({
      id:          transaction.id,
      amount:      Number(transaction.amount),
      type:        transaction.type,
      description: transaction.description,
      date:        transaction.date.toISOString(),
      isRecurring: transaction.isRecurring,
      category:    transaction.category,
      userId:      transaction.userId,
      groupId:     transaction.groupId,
      createdAt:   transaction.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

// ─── LIST TRANSACTIONS ───────────────────────────────────────────────────────
async function list(req, res, next) {
  try {
    // 1. Validate query params with Zod
    const result = listTransactionSchema.safeParse(req.query);
    if (!result.success) {
      const message = result.error.issues[0].message;
      return res.status(400).json({ message });
    }

    const { type, categoryId, startDate, endDate, groupId, page, limit } = result.data;

    // 2. Build the Prisma where clause dynamically
    // userId filter always present — user can only see their own transactions
    const where = { userId: req.user.userId };

    if (type)       where.type       = type;
    if (categoryId) where.categoryId = categoryId;
    if (groupId)    where.groupId    = groupId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate)   where.date.lte = new Date(endDate);
    }

    // 3. Count total for pagination
    const total = await prisma.transaction.count({ where });

    // 4. Fetch transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
      skip:  (page - 1) * limit,
      take:  limit,
    });

    return res.status(200).json({
      transactions: transactions.map((tx) => ({
        id:          tx.id,
        amount:      Number(tx.amount),
        type:        tx.type,
        description: tx.description,
        date:        tx.date.toISOString(),
        isRecurring: tx.isRecurring,
        category:    tx.category,
        groupId:     tx.groupId,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list };
