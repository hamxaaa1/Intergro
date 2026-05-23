import Chat from "../models/Chat.model.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // ✅ Get or create chat
    let chat = await Chat.findOne({ user: userId });

    if (!chat) {
      chat = new Chat({
        user: userId,
        messages: [],
      });
    }

    // ✅ Build conversation history for Gemini
    const history = chat.messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // ✅ Add current user message
    history.push({
      role: "user",
      parts: [{ text: message }],
    });

    // ✅ Generate response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
    });

    const botReply =
      response.text || "Sorry, I couldn't generate a response.";

    // ✅ Save user message
    chat.messages.push({
      sender: userId,
      content: message,
      role: "user",
    });

    // ✅ Save bot message
    chat.messages.push({
      sender: null,
      content: botReply,
      role: "bot",
    });

    await chat.save();

    // ✅ Return response
    res.json({
      reply: botReply,
      chat,
    });
  } catch (error) {
    console.error("Gemini Chat Error:", error);

    res.status(500).json({
      error: "Chat failed",
      details: error.message,
    });
  }
};

// ✅ Get user chat history
export const getUserChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = await Chat.findOne({ user: userId });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({
      messages: chat.messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch chat history",
    });
  }
};