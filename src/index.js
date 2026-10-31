import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import usersRouter from "./routes/users.route.js";
import todosRouter from "./routes/todos.route.js";
import authRouter from "./routes/auth.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

// ====================Middlewares====================
app.use(cors());
app.use(express.json());
app.use(express.static(`./public`));
app.use("/todos", todosRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// not-found Middleware
app.all("/*splat", (req, res) => {
  return res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
// Global error middleware
app.all("/*splat", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = "fail";

  next(err);
});
await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/about", (req, res) => {
  res.send("This is the about page.");
});
app.get("/contact", (req, res) => {
  res.send("This is the contact page.");
});
