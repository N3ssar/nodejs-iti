import mongoose from "mongoose";

export async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const conn = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
