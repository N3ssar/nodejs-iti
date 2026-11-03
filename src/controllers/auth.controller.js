import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const userToLogon = await User.findOne({ email });
    if (!userToLogon) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userToLogon.password,
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: userToLogon._id, role: userToLogon.role },
      secretKey,
      {
        expiresIn: "7d",
      },
    );

    return res
      .status(200)
      .json({ message: "You are logged-in successfully", token: token });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
