import Util from "node:util";
import jwt from "jsonwebtoken";
import Todo from "../models/todos.model.js";

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "You must login first, token missing" });
    }

    const token = authHeader.split(" ")[1];

    const secretKey = process.env.JWT_SECRET_KEY;

    const decoded = await Util.promisify(jwt.verify)(token, secretKey);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      message: "You are not authenticated, please login again",
    });
  }
}

function restrictTo(...roles) {
  return async (req, res, next) => {
    const userRole = req.user.role;
    const userId = req.user.id;
    const todoId = req.params.id;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    if (userRole === "user" && req.method === "DELETE") {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }
    const todoToUpdate = await Todo.findById(todoId);

    const isOwner =
      todoToUpdate && todoToUpdate.userId._id.toString() === userId;
    if (!isOwner && userRole === "user") {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }
    next();
  };
}

export { auth, restrictTo };
