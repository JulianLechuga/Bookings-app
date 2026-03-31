# Production-Ready SaaS Starter

This is a full-stack SaaS application setup using:

- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Swagger
- **Frontend**: React, Vite, TypeScript, TailwindCSS
- **Orchestration**: Docker & Docker Compose

## Quick Start

1. Start all services using Docker Compose:
```bash
docker-compose up --build
```
2. The Backend API will be available at `http://localhost:3000`
3. Swagger Documentation will be at `http://localhost:3000/api-docs`
4. The Frontend React App will be at `http://localhost:5173`

## Architecture

This project follows Clean Architecture principles in the backend to ensure maintainability and separation of concerns.

- `backend/src/controllers`: Request handlers
- `backend/src/services`: Business logic
- `backend/src/routes`: API endpoints
- `backend/src/middlewares`: Auth and validation logic
- `frontend/src/components`: UI components
- `frontend/src/pages`: Main views
