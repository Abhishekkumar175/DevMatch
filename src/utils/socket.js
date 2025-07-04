const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const onlineUsers = {}; // Track online users with socketId

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // adjust if needed
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);

      onlineUsers[userId] = socket.id;

      // Inform target user about status
      const targetSocketId = onlineUsers[targetUserId];
      if (targetSocketId) {
        io.to(targetSocketId).emit("userStatus", {
          userId,
          status: "online",
        });
      }

      console.log(`${firstName} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (payload) => {
      const {
        firstName,
        lastName,
        userId,
        targetUserId,
        text,
        imageUrl = null,
      } = payload;

      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        const message = {
          senderId: userId,
          text,
          imageUrl,
          seen: false,
        };

        chat.messages.push(message);
        await chat.save();

        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          text,
          imageUrl,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("markSeen", async ({ userId, targetUserId }) => {
      const chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      });

      if (!chat) return;

      let updated = false;

      chat.messages.forEach((msg) => {
        if (msg.senderId.toString() === targetUserId && !msg.seen) {
          msg.seen = true;
          updated = true;
        }
      });

      if (updated) await chat.save();
    });

    socket.on("disconnect", () => {
      for (const id in onlineUsers) {
        if (onlineUsers[id] === socket.id) {
          delete onlineUsers[id];
          break;
        }
      }
    });
  });
};

module.exports = initializeSocket;
