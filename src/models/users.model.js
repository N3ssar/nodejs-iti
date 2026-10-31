import mongoose from "mongoose";
import { isValidEmail } from "../utils/validators.js";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
    minLength: [2, "username must be at least 2 characters"],
    maxLength: [20, "username cannot be exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email must be unique"],
    validate: {
      validator: isValidEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }
  const password = this.password;

  const saltRound = 10;
  const hashedPassword = bcrypt.hash(password, saltRound);

  this.password = hashedPassword;
});
const User = mongoose.model("User", userSchema);

export default User;
