import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
      console.log("❌ No token");
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    console.log("✅ User:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("❌ VERIFY ERROR");
    console.log(err);
    return res.status(401).json({ message: err.message });
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

