const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

// ✅ Get chat messages
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Mark all messages as seen
chatRouter.put("/chat/:targetUserId/seen", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    const chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages.forEach((msg) => {
      if (String(msg.senderId) === String(targetUserId)) {
        msg.seen = true;
      }
    });

    await chat.save();
    res.json({ message: "Messages marked as seen" });
  } catch (err) {
    console.error("Error marking messages seen:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = chatRouter;
