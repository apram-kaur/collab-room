const rooms = {};

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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 5000;

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // JOIN ROOM
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    const exists = rooms[roomId].find(
      (user) => user.id === socket.id
    );

    if (!exists) {
      rooms[roomId].push({
        id: socket.id,
        username,
      });
    }

    io.to(roomId).emit(
      "participants-update",
      rooms[roomId]
    );

    console.log(`${username} joined room ${roomId}`);
  });

  // CHAT
  socket.on("send-message", (data) => {
    console.log("MESSAGE RECEIVED:", data);

    io.to(data.roomId).emit(
      "receive-message",
      data
    );
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(
        (user) => user.id !== socket.id
      );

      io.to(roomId).emit(
        "participants-update",
        rooms[roomId]
      );

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }

    console.log("User Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});