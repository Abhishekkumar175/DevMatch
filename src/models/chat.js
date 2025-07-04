const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: false, // ⬅️ made optional
    },
    imageUrl: {
      type: String,
      required: false, // ⬅️ new field for image support
    },
    seen: {
      type: Boolean,
      default: false, // ⬅️ new field for seen status
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };
