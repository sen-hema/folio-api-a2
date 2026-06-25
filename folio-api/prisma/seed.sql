-- seed.sql
-- Folio Expense Tracker — Sample Data
-- Run AFTER schema.sql
-- Password for demo user is: Password123

-- Default categories (no userId = system defaults)
INSERT INTO "Category" ("id", "name", "isCustom", "userId") VALUES
  (gen_random_uuid(), 'Food & Grocery', FALSE, NULL),
  (gen_random_uuid(), 'Housing',        FALSE, NULL),
  (gen_random_uuid(), 'Education',      FALSE, NULL),
  (gen_random_uuid(), 'Transport',      FALSE, NULL),
  (gen_random_uuid(), 'Entertainment',  FALSE, NULL),
  (gen_random_uuid(), 'Health',         FALSE, NULL),
  (gen_random_uuid(), 'Utilities',      FALSE, NULL),
  (gen_random_uuid(), 'Income',         FALSE, NULL),
  (gen_random_uuid(), 'Other',          FALSE, NULL)
ON CONFLICT DO NOTHING;

-- Demo user (password: Password123, hashed with bcrypt cost 12)
INSERT INTO "User" ("id", "firstName", "lastName", "email", "university", "passwordHash", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Hema',
  'Sen',
  'hema.sen@dal.ca',
  'Dalhousie University',
  '$2b$12$K9L1M2N3O4P5Q6R7S8T9UuVvWwXxYyZz1234567890ABCDEFGHIJreplaceWithRealHash',
  NOW(),
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Note: The passwordHash above is a placeholder.
-- The real hash is generated when you run: node prisma/seed.js
-- which uses bcrypt.hash('Password123', 12) at runtime.
