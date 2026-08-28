require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const initSocket = require("./socket");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);



initSocket(server);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatapp")
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(process.env.PORT || 3000, () =>
      console.log("Server running on port 3000")
    );
  })
  .catch((err) => console.error(err));