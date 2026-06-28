# Ecommerce (Vite + React + Express + MongoDB)

A small e-commerce example with a Vite + React frontend and an Express + MongoDB backend. Includes user authentication (JWT), product listing, and a simple Redux Toolkit store for frontend state.

## Features
- User authentication: register and login (JWT)
- Products API: list, view, and create products
- Frontend: React + Vite, Redux Toolkit for state
- Secure password storage with bcrypt

## Tech Stack
- Frontend: React 19, Vite, Tailwind (devDeps present), Redux Toolkit, Axios
- Backend: Node, Express 5, Mongoose, MongoDB
- Auth: JSON Web Tokens (`JWT_SECRET`) and `bcryptjs`

## Quick Start

Prerequisites: Node.js (18+), npm/yarn, MongoDB (URI)

From the repository root run the server and client in two terminals:

```bash
# Server
cd server
npm install
npm run dev

# Client
cd ../client
npm install
npm run dev
```

Open the frontend (usually at `http://localhost:5173`) and the server runs on `http://localhost:5000` by default.

## Environment Variables
Create a `.env` file in the `server` folder with:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000 # optional
```

## Server Scripts
- `npm run dev` — start server with `nodemon` (development)
- `npm start` — start server with `node`

Server package info: see `server/package.json` for dependencies.

## Client Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview build

Client package info: see `client/package.json` for dependencies.

## API Endpoints

Base: `/api`

- `GET /api/products` — returns all products
  - Response: JSON array of product objects

- `GET /api/products/:id` — returns single product by id

- `POST /api/products` — create product (expects product body)

- `POST /api/auth/register` — register user
  - Body: `{ name, email, password }`
  - Response: `{ token, user: { id, name, email, isAdmin } }`

- `POST /api/auth/login` — login user
  - Body: `{ email, password }`
  - Response: `{ token, user: { id, name, email, isAdmin } }`

## Data Models (summary)

- Product:
  - `name` (String, required)
  - `description` (String)
  - `price` (Number, required)
  - `image` (String)
  - `category` (String)
  - `stock` (Number, default 10)

- User:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, hashed)
  - `isAdmin` (Boolean, default false)

## Deployment Notes
- Ensure `MONGO_URI` and `JWT_SECRET` are set in production environment.
- Build the client (`npm run build`) and serve static files from a hosting provider, or configure Express to serve the built `client/dist` folder.

## Contributing
- Create feature branches, open PRs, and include short descriptions.

## Screenshots
<img width="2880" height="3854" alt="image" src="https://github.com/user-attachments/assets/c68392e6-c148-4900-b167-764ce38311b0" />


## License
This project is released under the MIT License — see `LICENSE`.


