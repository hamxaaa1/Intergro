import User from "../models/User.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // File comes from multer
    const filePath = req.file?.path || "";

    let imageUrl = "";
    if (filePath) {
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(filePath);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Send real-time via socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/message.controller.js
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // ✅ Only sender can delete their message
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    // if message had an image stored on Cloudinary
    if (message.image) {
      const publicId = message.image.split("/").pop().split(".")[0]; // crude way, better store public_id in db
      await cloudinary.uploader.destroy(publicId);
    }

    await Message.findByIdAndDelete(messageId);

    // notify both users
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }

    const senderSocketId = getReceiverSocketId(userId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDeleted", { messageId });
    }

    res.json({ message: "Message deleted successfully", messageId });
  } catch (error) {
    console.log("Error in deleteMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/message.controller.js
export const deleteMultipleMessages = async (req, res) => {
  try {
    const { ids } = req.body; // array of messageIds
    const userId = req.user._id;

    const messages = await Message.find({
      _id: { $in: ids },
      senderId: userId,
    });
    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found or not allowed" });
    }

    // delete from Cloudinary if any images
    for (const msg of messages) {
      if (msg.image) {
        const publicId = msg.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Message.deleteMany({ _id: { $in: ids }, senderId: userId });

    // notify receiver
    await Message.deleteMany({ _id: { $in: ids }, senderId: userId });

    // notify both users
    if (messages.length > 0) {
      const receiverSocketId = getReceiverSocketId(messages[0].receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messagesDeleted", { ids });
      }
      const senderSocketId = getReceiverSocketId(userId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesDeleted", { ids });
      }
    }

    res.json({ message: "Messages deleted successfully", ids });
  } catch (error) {
    console.log("Error in deleteMultipleMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
