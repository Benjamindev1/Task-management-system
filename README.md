# Task Management System

Live deployment: https://task-management-system-nine-red.vercel.app/

A full-stack task manager built for the kLab Tech Upskill Program challenge. The project includes a React + Vite frontend, an Express + PostgreSQL backend, and a Neon cloud database setup.

## Project Overview

This project allows users to:
- create tasks
- edit tasks
- delete tasks
- mark tasks as completed or pending
- filter tasks by status, priority, and search keyword
- view tasks in a dark-themed dashboard UI

## Stack

- Frontend: React 18 + Vite
- Styling: Plain CSS (no Tailwind or Bootstrap)
- HTTP client: Axios
- Backend: Node.js + Express (ESM)
- Database: PostgreSQL via Neon
- Authentication: Not included in v1

## Folder Structure

```text
Task-management-system/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── db.js
│   │   ├── migrate.js
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── README.md
└── .git/
```

## Environment Setup

### Frontend
Create a frontend `.env` file with:

```env
VITE_API_URL=http://localhost:4000
```

### Backend
Create a backend `.env` file with your Neon database connection:

```env
postgresql://neondb_owner:npg_N3UjwfpaMZI8@ep-restless-dust-b1gw4ss8-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=4000
```

## Installation

### Backend
```bash
cd backend
npm install
npm run migrate
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Database Schema

The backend creates this table:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Indexes are also created for:
- status
- created_at DESC

## API Contract

Base URL: `http://localhost:4000`

### GET /tasks
Returns all tasks with optional filters:
- status
- priority
- q
- page
- limit

Example:
```http
GET /tasks?status=pending&priority=high&q=design&page=1&limit=10
```

### GET /tasks/:id
Returns a single task by ID.

### POST /tasks
Creates a new task.

Required fields:
- title: 1 to 120 characters
- description: optional, max 1000 characters
- status: pending or completed
- priority: low, medium, or high

### PUT /tasks/:id
Updates one or more fields for a task.

### DELETE /tasks/:id
Deletes a task.

## Response Format

Success responses return JSON objects.

Example task object:

```json
{
  "id": 1,
  "title": "Buy milk",
  "description": "",
  "status": "pending",
  "priority": "medium",
  "createdAt": "2026-09-16T12:00:00.000Z"
}
```

Error responses return:

```json
{
  "error": "Task not found"
}
```

## Frontend Features

The UI includes:
- header with title and create task button
- filter bar for status, priority, and search input
- dark theme layout
- task cards with checkboxes, badges, description preview, and dates
- create/edit modal form
- inline validation messages
- delete action
- loading and empty states
- error banner messages

## How the App Works

1. The frontend loads the task list from the backend through the Axios API file.
2. The React hook manages loading, filters, pagination, form state, and API actions.
3. The backend validates incoming task data before writing to PostgreSQL.
4. Responses are mapped to camelCase fields such as `createdAt`.
5. The UI updates instantly after successful create, edit, or delete actions.

## Runtime Notes

- The frontend expects the backend to run at port 4000.
- The backend must be started before the frontend can fetch tasks.
- Neon requires SSL support, so the database connection string must include the proper SSL configuration.
- The app does not include user authentication in v1, as specified.

## Verification Checklist

Before submission, confirm:
- backend starts successfully on port 4000
- database migration runs with no errors
- frontend build passes with `npm run build`
- task creation, update, delete, and checkbox toggle work
- filters and search work in the UI
- red/error banners appear on invalid requests

## Final Notes

This project is designed to demonstrate a complete CRUD workflow for task management using a React frontend, Express backend, and PostgreSQL database hosted on Neon.

## Contributor Notes

For this challenge, keep the environment variables secure and never commit raw credentials to public repositories. Use `.env` files locally and keep them excluded from Git if required.
