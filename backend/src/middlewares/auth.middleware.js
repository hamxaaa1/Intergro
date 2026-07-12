import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next(); // allow request to continue
    } else {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

