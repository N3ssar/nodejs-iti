import express from "express";

import {
  getAllTodos,
  getTodo,
  addNewTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todos.controller.js";
import { auth, restrictTo } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(auth);
router.use(restrictTo("admin", "user"));
router.get("/", getAllTodos);

router.get("/:id", getTodo);
router.post("/", addNewTodo);

router.patch("/:id", toggleTodo);

router.delete("/:id", deleteTodo);
export default router;
