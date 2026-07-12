import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminToken } = req.body;
    const fileUrl = req.file?.path || ""; 

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    // Assign role based on adminToken
    let role = "user";
    if (adminToken && adminToken === process.env.ADMIN_INVITE_TOKEN) {
      role = "admin";
    }

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      avatar: fileUrl
    });
    await newUser.save();

    // Generate JWT
    const token = generateToken(newUser._id);

    // Send token in cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("SET COOKIE HEADER:", res.getHeaders()["set-cookie"]);

    // Return user without password automatically
    const userResponse = await User.findById(newUser._id).select("-password");

    return res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Generate JWT
    const token = generateToken(existingUser._id);

    // Send token in cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    console.log("LOGIN COOKIE:", res.getHeaders()["set-cookie"]);

    // Fetch user without password
    const userResponse = await User.findById(existingUser._id).select("-password");

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};



export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const authorId = req.user._id;
    const user = await User.findById(authorId).select("-password")
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    return res.status(200).json({message: "User profile fetched successfully",user});
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}


export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file?.path || ""; // uploaded image path from multer-storage-cloudinary
    const authorId = req.user._id;

    const user = await User.findById(authorId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update fields
    if (name) user.name = name;

    if (file) {
      // 🔥 delete old avatar from Cloudinary if exists
      if (user.avatar) {
        try {
          const publicId = user.avatar.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`notes_app_uploads/${publicId}`);
        } catch (err) {
          console.warn("Cloudinary delete failed:", err.message);
        }
      }

      // set new avatar
      user.avatar = file;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
