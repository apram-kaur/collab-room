const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


const PORT = 5000;
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    socket.on("send-message", (data) => {
  console.log("MESSAGE RECEIVED:", data);

  io.to(data.roomId).emit("receive-message", data);
});

    console.log(
      `${socket.id} joined room ${roomId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});