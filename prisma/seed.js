/**
 * prisma/seed.js
 *
 * Seeds the database with:
 *   - Default categories (Food, Housing, Education, etc.)
 *   - One demo user (so you can test login in Postman)
 *
 * Run: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  'Food & Grocery',
  'Housing',
  'Education',
  'Transport',
  'Entertainment',
  'Health',
  'Clothing',
  'Utilities',
  'Income',
  'Other',
];

async function main() {
  console.log('Seeding database...');

  // Create default categories (no owner)
  for (const name of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where:  { id: name },        // won't match anything — forces create
      update: {},
      create: { name, isCustom: false, userId: null },
    });
  }

  // Fetch the categories we just created so we can use their real IDs
  const categories = await prisma.category.findMany({ where: { isCustom: false } });
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  // Create a demo user
  const passwordHash = await bcrypt.hash('Password123', 12);
  const demoUser = await prisma.user.upsert({
    where:  { email: 'hema.sen@dal.ca' },
    update: {},
    create: {
      firstName:    'Hema',
      lastName:     'Sen',
      email:        'hema.sen@dal.ca',
      university:   'Dalhousie University',
      passwordHash,
    },
  });

  // Seed a few transactions for the demo user
  const sampleTransactions = [
    { amount: 900.00, type: 'expense', description: 'Rent payment',      date: new Date('2026-05-01'), categoryName: 'Housing',        isRecurring: true  },
    { amount: 600.00, type: 'income',  description: 'Part-time job',      date: new Date('2026-05-03'), categoryName: 'Income',         isRecurring: false },
    { amount: 87.40,  type: 'expense', description: 'Superstore groceries',date: new Date('2026-05-05'), categoryName: 'Food & Grocery', isRecurring: false },
    { amount: 124.99, type: 'expense', description: 'Textbooks CSCI 4177',date: new Date('2026-05-07'), categoryName: 'Education',      isRecurring: false },
    { amount: 1800.00,type: 'income',  description: 'Scholarship deposit', date: new Date('2026-05-08'), categoryName: 'Income',         isRecurring: false },
  ];

  for (const tx of sampleTransactions) {
    await prisma.transaction.create({
      data: {
        amount:      tx.amount,
        type:        tx.type,
        description: tx.description,
        date:        tx.date,
        isRecurring: tx.isRecurring,
        userId:      demoUser.id,
        categoryId:  catMap[tx.categoryName],
      },
    });
  }

  console.log('Seed complete!');
  console.log('Demo user: hema.sen@dal.ca / Password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
