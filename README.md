# Node ITI

A Node.js learning project containing course exercises and an Express REST API for managing users and todo items. The API uses MongoDB for persistence, JWT for authentication, and serves a small todo-list interface.

## Requirements

- Node.js 20 or later
- pnpm
- A MongoDB instance (local or hosted)

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file in the project root:

   ```env
   PORT=3001
   MONGODB_URI=mongodb://127.0.0.1:27017/node-iti
   JWT_SECRET_KEY=replace-with-a-long-random-secret
   ```

   Set `MONGODB_URI` to your MongoDB connection string and use a private, randomly generated value for `JWT_SECRET_KEY`. Do not commit `.env` or real credentials.

3. Start the server:

   ```bash
   pnpm dev
   ```

   Or run it without the development watcher:

   ```bash
   pnpm start
   ```

The server uses port `3001` by default; set `PORT` to use another port.

## API

All endpoints are relative to the server origin (for example, `http://localhost:3001`). JSON request bodies should use the `Content-Type: application/json` header.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `POST` | `/users` | Create a user | No |
| `GET` | `/users` | List users | No |
| `GET` | `/users/:id` | Get a user | No |
| `PATCH` | `/users/:id` | Update a user | Bearer token |
| `DELETE` | `/users/:id` | Delete a user | Bearer token |
| `GET` | `/users/:id/todos` | List a user's todos | No |
| `POST` | `/auth/login` | Log in and receive a JWT | No |
| `GET` | `/todos` | List todos; accepts `limit` and `skip` query parameters | No |
| `GET` | `/todos/:id` | Get a todo | No |
| `POST` | `/todos` | Create a todo | No |
| `PATCH` | `/todos/:id` | Update a todo's status | Bearer token |
| `DELETE` | `/todos/:id` | Delete a todo | Bearer token |

For protected endpoints, send the token returned by login as:

```http
Authorization: Bearer <token>
```

Users are created with `name`, `email`, and `password`. A todo requires a `title` and `userId`; its status can be `planned`, `in-progress`, or `done`.

### Example requests

Create a user:

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Taylor","email":"taylor@example.com","password":"your-password"}'
```

Log in:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"taylor@example.com","password":"your-password"}'
```

## Project structure

```text
session1/   Early Node.js exercises
session2/   Additional Node.js exercises
src/
  controllers/  Request handlers
  lib/          MongoDB connection
  middlewares/  Authentication middleware
  models/       Mongoose models
  public/       Browser interface assets
  routes/       Express API routes
  utils/        Shared validation helpers
```

## Notes

- The root scripts are `pnpm dev` and `pnpm start`.
- The project does not currently define a test or build script.
- Keep secrets and database credentials out of version control.
