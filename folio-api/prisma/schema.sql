-- schema.sql
-- Folio Expense Tracker — PostgreSQL Schema
-- Generated for Assignment 2 submission
-- Run this on your PostgreSQL database to create all tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  "id"           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  "firstName"    VARCHAR(100)  NOT NULL,
  "lastName"     VARCHAR(100)  NOT NULL,
  "email"        VARCHAR(255)  NOT NULL UNIQUE,
  "university"   VARCHAR(255)  NOT NULL,
  "passwordHash" VARCHAR(255)  NOT NULL,
  "createdAt"    TIMESTAMP     NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS "Category" (
  "id"       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"     VARCHAR(100) NOT NULL,
  "isCustom" BOOLEAN      NOT NULL DEFAULT FALSE,
  "userId"   UUID         REFERENCES "User"("id") ON DELETE CASCADE
  -- userId NULL = system default category
);

-- Transactions table
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id"          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  "amount"      DECIMAL(10,2)  NOT NULL CHECK ("amount" > 0),
  "type"        VARCHAR(10)    NOT NULL CHECK ("type" IN ('income', 'expense')),
  "description" VARCHAR(255)   NOT NULL,
  "date"        TIMESTAMP      NOT NULL,
  "isRecurring" BOOLEAN        NOT NULL DEFAULT FALSE,
  "createdAt"   TIMESTAMP      NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP      NOT NULL DEFAULT NOW(),
  "userId"      UUID           NOT NULL REFERENCES "User"("id")     ON DELETE CASCADE,
  "categoryId"  UUID           NOT NULL REFERENCES "Category"("id"),
  "groupId"     UUID           -- FK to Group table (added in Week 4)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transaction_user    ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS idx_transaction_date    ON "Transaction"("date" DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_type    ON "Transaction"("type");
CREATE INDEX IF NOT EXISTS idx_transaction_category ON "Transaction"("categoryId");
