# Folio API — CSCI 4177/5709 Assignment 2

REST API implementation for the Folio student expense tracker. Built individually as part of Assignment 2 for CSCI 4177/5709 at Dalhousie University.

## Student
**Hema Sen** ·

## Live API
Base URL: `https://folio-api-a2.onrender.com`

Health check: `GET /health`

## Implemented Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/transactions | List authenticated user's transactions |
| POST | /api/transactions | Create a new transaction |

## Tech Stack

- **Runtime:** Node.js v20
- **Framework:** Express.js
- **Database:** PostgreSQL 18 (Render)
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **Deployment:** Render
