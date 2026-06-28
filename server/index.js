import productRoutes from "./src/routes/products.js";
import authRoutes from "./src/routes/auth.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Fail fast on misconfiguration — silent fallbacks to a default secret would
// let production tokens be trivially forgeable.
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set. Refusing to start.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set. Refusing to start.");
  process.exit(1);
}

// Centralized error logging used by every route handler.
export function logServerError(route, err) {
  console.error(`[${route}]`, err);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Block `listen()` on Mongo readiness — a server that boots without a DB is
// worse than no server at all (every request would 500 with a confusing error).
async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    logServerError("bootstrap", err);
    process.exit(1);
  }
}

bootstrap();