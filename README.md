# PulseFit Gym Website

PulseFit is a full-stack gym website with a React frontend and Express/MongoDB backend. It includes trainer sections, membership plans, class schedule, authentication, and booking APIs.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT and bcrypt
- Deployment target: Vercel frontend, Render backend

## Project Structure

```text
gym-website/
  src/                 Frontend source code
  public/              Static frontend assets
  backend/             Express API server
  dist/                Production frontend build output
  DEPLOYMENT_STEPS.md  Deployment guide
```

## Local Requirements

- Node.js
- npm
- MongoDB running locally on `127.0.0.1:27017`

Backend expects this local MongoDB URI:

```env
MONGO_URI=mongodb://127.0.0.1:27017/pulsefit
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pulsefit
JWT_SECRET=pulsefit-local-dev-secret-change-before-production
CLIENT_ORIGIN=http://localhost:5173
```

For production, replace `JWT_SECRET` with a strong random secret and use MongoDB Atlas for `MONGO_URI`.

## Install Dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

## Run Locally

Start backend:

```bash
cd backend
npm start
```

Start frontend in another terminal:

```bash
npm run dev -- --host 127.0.0.1
```

Local URLs:

```text
Frontend: http://127.0.0.1:5173/
Backend:  http://127.0.0.1:5000/api/health
```

Expected backend health response:

```json
{"status":"ok","database":"mongo"}
```

## Build

```bash
npm run build
```

The production frontend build is generated in `dist/`.

## Main API Routes

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/classes
GET  /api/trainers
GET  /api/membership
POST /api/membership
POST /api/book
GET  /api/book
GET  /api/health
```

Protected booking routes require:

```text
Authorization: Bearer <token>
```

## Deployment

Use:

[DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md)

Recommended production setup:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Production frontend environment variable:

```env
VITE_API_URL=https://<render-backend-name>.onrender.com/api
```

Production backend environment variables:

```env
PORT=5000
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random production secret>
CLIENT_ORIGIN=https://<vercel-frontend-name>.vercel.app
```

## Notes

- Do not commit `backend/.env`.
- Do not commit `node_modules`.
- Local MongoDB is only for development.
- If `/api/health` shows `database: memory`, MongoDB is not connected.
