import path from "path";
import { fileURLToPath } from "url";
import Todo from "../models/todos.model.js";
import { isValidNonNegativeInteger } from "../utils/validators.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAllTodos(req, res) {
  try {
    const { limit: rawLimit, skip: rawSkip } = req.query;

    const limit = isValidNonNegativeInteger(rawLimit, 1)
      ? Number(rawLimit)
      : 10;
    const skip = isValidNonNegativeInteger(rawSkip, 0) ? Number(rawSkip) : 0;

    const todos = await Todo.find({})
      .populate("userId")
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      message: "Todos fetched successfully",
      length: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error("Error while getting todos :", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getTodo(req, res) {
  const { id } = req.params;

  try {
    const todoToFind = await Todo.findById(id).populate("userId");

    if (!todoToFind) {
      return res
        .status(404)
        .json({ message: "Todo not found with the provided ID" });
    }
    return res.status(200).json({
      message: "Todo fetched successfully",
      data: todoToFind,
    });
  } catch (error) {
    console.error("Error while fetching todo:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format provided",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function addNewTodo(req, res) {
  try {
    const { title, userId } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Title is required and must be a valid non-empty string",
      });
    }

    const savedTodo = await Todo.create({ title, userId });

    return res
      .status(201)
      .json({ message: "New todo added successfully", data: savedTodo });
  } catch (error) {
    console.error("Error while saving new todo :", error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Todo's title must be unique,this title is already exist",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function toggleTodo(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidator: true },
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ message: "Todo with provided ID is not found" });
    }

    return res
      .status(200)
      .json({ message: "Todo updated successfully", data: updatedTodo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function deleteTodo(req, res) {
  const { id } = req.params;

  try {
    const todoToDelete = await Todo.findByIdAndDelete(id);

    if (!todoToDelete) {
      return res.status(404).json({
        message: "Todo with provided id is not found, or deleted before",
      });
    }

    return res.status(209).json({ message: "Todo deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
