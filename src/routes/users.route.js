import express from "express";
import auth from "../middlewares/auth.middleware.js";
const router = express.Router();
import {
  getAllUsers,
  getUser,
  saveUser,
  updateUser,
  deleteUser,
  getUserTodos,
} from "../controllers/users.controller.js";

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", saveUser);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.get("/:id/todos", getUserTodos);
export default router;
