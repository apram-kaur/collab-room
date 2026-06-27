import "./Room.css";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket";
import Whiteboard from "../components/Whiteboard";
import CodeEditor from "../components/CodeEditor";

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
  <div className="room-container">

    <div className="room-header">
      <div>
        <h1>💻 Collab Room</h1>
        <h3>Room ID: {roomId}</h3>
      </div>

      <h3>👋 Welcome, {username}</h3>
    </div>

    <div className="top-section">

      <div className="participants">
        <h2>Participants</h2>

        <ul>
          {participants.map((user) => (
            <li key={user.id}>
              🟢 {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat">

        <h2>Chat</h2>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </p>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Type a message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>

      </div>

    </div>

    <div className="whiteboard-section">
      <Whiteboard roomId={roomId} />
    </div>

    <div className="editor-section">
      <CodeEditor roomId={roomId} />
    </div>

  </div>
);
}

export default Room;