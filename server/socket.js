const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const Message = require("./models/Message");

// userId -> number of open sockets for that user
const onlineUsers = new Map();

function getOnlineCount() {
  return onlineUsers.size;
}

function addUser(userId) {
  onlineUsers.set(userId, (onlineUsers.get(userId) || 0) + 1);
}

function removeUser(userId) {
  const count = (onlineUsers.get(userId) || 1) - 1;
  if (count <= 0) onlineUsers.delete(userId);
  else onlineUsers.set(userId, count);
}

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // ---- DONE FOR YOU: JWT check during the handshake ----
  io.use((socket, next) => {
    try {
      const raw = socket.handshake.headers.cookie || "";
      const token = cookie.parse(raw).token;
      if (!token) return next(new Error("No token"));

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: payload.id };
      next();
    } catch (err) {
      next(new Error("Not authorised"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Each user joins a room named after their own id.
    // Sending to a room means every tab of that user gets the event.
    socket.join(userId);

    addUser(userId);
    console.log("Connected:", userId, "| online:", getOnlineCount());

    // ================= EVENT 1: online:count =================
    io.emit("online:count", getOnlineCount());

    // ================= EVENT 2: chat:history =================
    socket.on("chat:history", async (withUserId, ack) => {
      try {
        const messages = await Message.find({
          $or: [
            { sender: userId, receiver: withUserId },
            { sender: withUserId, receiver: userId },
          ],
        }).sort({ createdAt: 1 });

        if (typeof ack === "function") ack(messages);
        else socket.emit("chat:history", messages);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    });

    // ================= EVENT 3: chat:send =================
    socket.on("chat:send", async ({ to, text }, ack) => {
      try {
        if (!text || !text.trim()) return;

        const message = await Message.create({
          sender: userId,
          receiver: to,
          text: text.trim(),
          read: false,
        });

        // Send to BOTH rooms: sender and receiver
        io.to(userId).to(to).emit("chat:message", message);

        // Update receiver's unread count for this sender
        const unreadCount = await Message.countDocuments({
          sender: userId,
          receiver: to,
          read: false,
        });
        io.to(to).emit("chat:unread:update", { userId, count: unreadCount });

        if (typeof ack === "function") ack({ status: "ok", message });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // ================= EVENT 4: chat:unread =================
    socket.on("chat:unread", async (ack) => {
      try {
        const unreadList = await Message.aggregate([
          {
            $match: {
              receiver: new (require("mongoose").Types.ObjectId)(userId),
              read: false,
            },
          },
          { $group: { _id: "$sender", count: { $sum: 1 } } },
        ]);

        const formatted = unreadList.map((item) => ({
          userId: item._id,
          count: item.count,
        }));

        if (typeof ack === "function") ack(formatted);
        else socket.emit("chat:unread", formatted);
      } catch (err) {
        console.error("Error fetching unread counts:", err);
      }
    });

    // ================= EVENT 5: chat:read =================
    socket.on("chat:read", async (fromUserId) => {
      try {
        await Message.updateMany(
          { sender: fromUserId, receiver: userId, read: false },
          { read: true }
        );

        io.to(userId).emit("chat:unread:update", {
          userId: fromUserId,
          count: 0,
        });
        io.to(fromUserId).emit("chat:read",{by:userId});
      } catch (err) {
        console.error("Error marking messages read:", err);
      }
    });

    // ================= BONUS: chat:typing =================
    socket.on("chat:typing", ({ to }) => {
      socket.to(to).emit("chat:typing", { from: userId });
    });

    socket.on("disconnect", () => {
      removeUser(userId);
      console.log("Disconnected:", userId, "| online:", getOnlineCount());
      io.emit("online:count", getOnlineCount());
    });
  });

  return io;
}

module.exports = initSocket;