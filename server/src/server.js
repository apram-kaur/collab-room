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


  // ==========================================
  // CREATE ROOM
  // ==========================================

  socket.on(
    "create-room",
    ({ roomId, roomName, username }, callback) => {

      // Check if room already exists
      if (rooms[roomId]) {

        callback({
          success: false,
          message: "Room ID already exists.",
        });

        return;
      }


      // Create room
      rooms[roomId] = {
        roomName,
        participants: [],
      };


      // Join creator to the room
      socket.join(roomId);


      // Add creator
      rooms[roomId].participants.push({
        id: socket.id,
        username,
      });


      // Send participant update
      io.to(roomId).emit(
        "participants-update",
        rooms[roomId].participants
      );


      console.log(
        `${username} created room ${roomId} (${roomName})`
      );


      // Tell frontend creation succeeded
      callback({
        success: true,
        roomId,
        roomName,
      });

    }
  );


  // ==========================================
  // JOIN ROOM
  // ==========================================

 // ==========================================
// JOIN ROOM
// ==========================================

socket.on(
  "join-room",
  ({ roomId, username }, callback) => {

    // Check if room exists
    if (!rooms[roomId]) {

      if (typeof callback === "function") {
        callback({
          success: false,
          message: "Room not found.",
        });
      }

      console.log(
        `${username} tried to join non-existent room ${roomId}`
      );

      return;
    }


    // Join Socket.io room
    socket.join(roomId);


    // Check if user is already present
    const exists =
      rooms[roomId].participants.find(
        (user) => user.id === socket.id
      );


    if (!exists) {

      rooms[roomId].participants.push({
        id: socket.id,
        username,
      });

    }


    // Send updated participant list to everyone
    io.to(roomId).emit(
      "participants-update",
      rooms[roomId].participants
    );


    console.log(
      `${username} joined room ${roomId}`
    );


    // Tell frontend join succeeded
    if (typeof callback === "function") {
      callback({
        success: true,
        roomId,
        roomName: rooms[roomId].roomName,
      });
    }

  }
);
// ==========================================
// TYPING INDICATOR
// ==========================================

socket.on("user-typing", (data) => {

  socket.to(data.roomId).emit(
    "user-typing",
    data.username
  );
socket.on("user-stopped-typing", (data) => {

  socket.to(data.roomId).emit(
    "user-stopped-typing"
  );

});
});

  // ==========================================
  // CHAT
  // ==========================================

  socket.on("send-message", (data) => {

    console.log("MESSAGE RECEIVED:", data);

    io.to(data.roomId).emit(
      "receive-message",
      data
    );

  });


  // ==========================================
  // DRAWING
  // ==========================================

  socket.on("drawing", (data) => {

    console.log("DRAW EVENT:", data);

    socket.to(data.roomId).emit(
      "drawing",
      data
    );

  });


  socket.on("stop-drawing", (data) => {

    socket.to(data.roomId).emit(
      "stop-drawing"
    );

  });


  // ==========================================
  // CODE EDITOR
  // ==========================================

  socket.on("code-change", (data) => {

    socket.to(data.roomId).emit(
      "code-change",
      data.code
    );

  });


  // ==========================================
  // DISCONNECT
  // ==========================================

  socket.on("disconnect", () => {

    for (const roomId in rooms) {

      rooms[roomId].participants =
        rooms[roomId].participants.filter(
          (user) => user.id !== socket.id
        );


      io.to(roomId).emit(
        "participants-update",
        rooms[roomId].participants
      );


      // Delete empty rooms
      if (
        rooms[roomId].participants.length === 0
      ) {

        delete rooms[roomId];

        console.log(
          `Room ${roomId} deleted`
        );

      }

    }

  // ==========================================
  // LEAVE ROOM
  // ==========================================

  socket.on("leave-room", ({ roomId }) => {

    if (!rooms[roomId]) {
      return;
    }

    // Remove user from participant list
    rooms[roomId].participants =
      rooms[roomId].participants.filter(
        (user) => user.id !== socket.id
      );

    // Leave Socket.io room
    socket.leave(roomId);

    // Update everyone still in the room
    io.to(roomId).emit(
      "participants-update",
      rooms[roomId].participants
    );

    console.log(
      `User ${socket.id} left room ${roomId}`
    );

    // Delete room if nobody is left
    if (rooms[roomId].participants.length === 0) {

      delete rooms[roomId];

      console.log(
        `Room ${roomId} deleted`
      );

    }

  });
    console.log(
      "User Disconnected:",
      socket.id
    );

  });

});


server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});