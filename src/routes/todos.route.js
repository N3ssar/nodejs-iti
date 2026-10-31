import express from "express";

import {
  getAllTodos,
  getTodo,
  addNewTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todos.controller.js";
import auth from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", getAllTodos);

router.get("/:id", getTodo);
router.post("/", addNewTodo);

router.patch("/:id", auth, toggleTodo);

router.delete("/:id", auth, deleteTodo);

export default router;
