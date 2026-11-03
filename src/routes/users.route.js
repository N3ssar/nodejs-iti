import express from "express";
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
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/todos", getUserTodos);
export default router;
