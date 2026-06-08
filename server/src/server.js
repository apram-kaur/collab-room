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

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    if (!rooms[roomId].includes(socket.id)) {
      rooms[roomId].push(socket.id);
    }

    io.to(roomId).emit(
      "participants-update",
      rooms[roomId]
    );

    console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", (data) => {
    console.log("MESSAGE RECEIVED:", data);

    io.to(data.roomId).emit(
      "receive-message",
      data
    );
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(
        (id) => id !== socket.id
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