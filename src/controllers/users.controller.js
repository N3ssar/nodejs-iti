import User from "../models/users.model.js";
import Todo from "../models/todos.model.js";
import bcrypt from "bcryptjs";

export async function getAllUsers(_, res) {
  try {
    const users = await User.find({});

    return res.status(200).json({
      message: "Users fetched successfully",
      length: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error while getting users :", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    const userToFind = await User.findById(id);

    if (!userToFind) {
      return res
        .status(404)
        .json({ message: `user with id "${id}" not found` });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: userToFind });
  } catch (error) {
    console.error("Error while fetching a user :", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function saveUser(req, res) {
  try {
    const userData = req.body;
    const { password } = userData;
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ message: "User data is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    const savedUser = await User.create(userData);

    return res

      .status(201)
      .json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    console.error("Error while creating a user:", error);

    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const updates = {};

    if (!username && !email && !password && !role) {
      return res.status(400).json({ message: "There is no data to update!" });
    }

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }
    if (role) updates.role = role;

    const userToUpdate = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: userToUpdate,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid User ID format!" });
    }

    // Handling Mongoose Validation Errors (runValidators: true)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // Handling Duplicate Key Error (e.g. Email already exists)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or Username already exists!" });
    }

    // Fallback for Server Errors
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const userToDelete = await User.findByIdAndDelete(id);

    if (!userToDelete) {
      return res.status(404).json({
        message: "User not found or already deleted",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      data: { id: userToDelete._id },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid User ID format!" });
    }

    console.error("Delete User Error:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getUserTodos(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with provided ID not found" });
    }

    const userTodos = await Todo.find({ userId: id });

    return res
      .status(200)
      .json({ message: "Todos fetched successfully", data: userTodos });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
