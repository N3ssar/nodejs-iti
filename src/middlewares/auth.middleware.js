import Util from "node:util";
import jwt from "jsonwebtoken";

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

export default auth;
