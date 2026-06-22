import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket";
import Whiteboard from "../components/Whiteboard";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();

  const username = location.state?.username || "Anonymous";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for participant updates
    socket.on("participants-update", (users) => {
      console.log("Participants:", users);
      setParticipants(users);
    });

    // Join the room AFTER listeners are ready
    socket.emit("join-room", {
      roomId,
      username,
    });

    return () => {
      socket.off("receive-message");
      socket.off("participants-update");
    };
  }, [roomId, username]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      username,
      message,
    });

    setMessage("");
  };

  return (
    <div>
      <h1>Room: {roomId}</h1>

      <h3>Welcome, {username}!</h3>

      <h2>Participants</h2>

      <ul>
        {participants.map((user) => (
          <li key={user.id}>
            🟢 {user.username}
          </li>
        ))}
      </ul>

      <h2>Whiteboard</h2>
       <Whiteboard roomId={roomId} />

      <hr />

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <hr />

      {messages.map((msg, index) => (
        <p key={index}>
          <strong>{msg.username}:</strong> {msg.message}
        </p>
      ))}
    </div>
  );
}

export default Room;