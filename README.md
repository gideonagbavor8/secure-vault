# SecureVault 🔐
> An ultra-secure, full-stack password & secrets manager

[![Node.js Version](https://img.shields.io/badge/node-v18.x-green.svg)](https://nodejs.org/)
[![Next.js Version](https://img.shields.io/badge/next.js-v14.x-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-14-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)

## Overview
SecureVault is a secure credential management platform designed to store and manage sensitive authentication records safely. Built with security-first architecture adhering to NIST standards, it is tailored for developers and businesses requiring a self-hostable, zero-trust digital vault. SecureVault distinguishes itself by keeping all client-side secrets encrypted before transmission and isolating multi-tenant data using advanced access control schemas.

## Key Features
- **AES-256-GCM** encryption for all stored user credentials at rest.
- **JWT Authentication** with strict refresh token rotation to secure API transactions.
- **TOTP-based 2FA** compatibility supporting Google Authenticator, Authy, and similar authenticators.
- **Immutable Audit Logs** tracking database state changes for robust compliance.
- **Rate Limiting** and lockouts protecting key routes against brute-force attacks.
- **Role-Based Access Control** differentiating permissions for STANDARD and ADMIN users.
- **Soft Delete** logic implemented for vaults and credentials to prevent accidental data loss.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, ts-node, Nodemon |
| **Database** | PostgreSQL 14 (Alpine Image) |
| **ORM** | Prisma v5 (PostgreSQL Client Generator) |
| **Auth** | JSON Web Tokens (JWT), Bcrypt Password Hashing |
| **DevOps** | Docker, Docker Compose, Multi-stage Builds |

## Project Structure

```text
secure-vault/
├── backend/
│   ├── prisma/
│   │   ├── migrations/      # SQL database migrations
│   │   └── schema.prisma    # Prisma schema declarations
│   ├── src/
│   │   ├── lib/             # Singleton libraries (Prisma Client)
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Encryption, hashing, JWT, and logging utilities
│   │   └── index.ts         # Express server entry point
│   ├── Dockerfile           # Backend container build setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── app/             # Next.js app router and UI pages
│   ├── Dockerfile           # Frontend container build setup
│   └── package.json
├── docker-compose.yml       # Orchestrates app services and database
├── .env.example             # Template for local environment variables
└── README.md
```

## Getting Started

1. **Prerequisites**
   Ensure you have [Node.js v18+](https://nodejs.org/), [Docker](https://www.docker.com/), and [PostgreSQL](https://www.postgresql.org/) installed locally.

2. **Clone the Repository**
   ```bash
   git clone https://github.com/gideonagbavor8/secure-vault.git
   cd secure-vault
   ```

3. **Configure Environment Variables**
   Copy the example environment files at the root level and configure your variables:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

4. **Start Containers**
   Launch PostgreSQL, backend Express, and Next.js using Docker Compose:
   ```bash
   docker compose up --build
   ```

5. **Run Prisma Migrations**
   Synchronize your PostgreSQL database with the Prisma schema layout:
   ```bash
   cd backend
   npx prisma migrate dev --name init_schema
   ```

6. **Access Applications**
   - **Frontend UI**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000`

## Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string for Prisma. | `postgresql://securevault:securevault@localhost:5432/securevaultdb` |
| `PORT` | Local binding port for the Express application. | `5000` |
| `NODE_ENV` | Application environment state. | `development` |
| `FRONTEND_URL` | Client URL configuration for backend CORS routing. | `http://localhost:3000` |
| `BCRYPT_COST_FACTOR` | Work factor multiplier for password hashing. | `12` |
| `JWT_SECRET` | Secret key used to sign Access Tokens. | `supersecretjwtkeyforlocaldev123!` |
| `JWT_REFRESH_SECRET` | Secret key used to sign Refresh Tokens. | `supersecretjwtrefreshkeyforlocaldev123!` |
| `POSTGRES_USER` | Admin username for PostgreSQL container. | `securevault` |
| `POSTGRES_PASSWORD` | Admin password for PostgreSQL container. | `securevault` |
| `POSTGRES_DB` | Default database name within PostgreSQL. | `securevaultdb` |

## API Overview

| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check backend service and DB status | No |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return tokens | No |
| `POST` | `/api/auth/refresh` | Issue new Access Token via Refresh Token | No |
| `POST` | `/api/auth/logout` | Revoke active Refresh Token | Yes |

## Security Considerations
SecureVault relies on client-side and server-side encryption layers. All vault records are processed using AES-256-GCM encryption before storing, preventing database admins or attackers from viewing secrets in plaintext. Session security uses JSON Web Tokens with automatic rotation of refresh tokens, while all security-relevant platform operations are tracked within an append-only audit trail.

## Roadmap
- [x] **Phase 1**: Monorepo orchestration and Docker container structures.
- [x] **Phase 2**: Database layout configuration, Prisma ORM setups, and schemas.
- [/] **Phase 3**: Key auth endpoints, security helpers, and encryption utilities.
- [ ] **Phase 4**: Frontend vault management pages and visual credential controllers.
- [ ] **Phase 5**: Production testing, rate limiting, and NIST alignment checks.

## License
MIT License - see the LICENSE file for details.
