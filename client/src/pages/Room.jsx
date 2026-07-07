import "./Room.css";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket";
import Whiteboard from "../components/Whiteboard";
import CodeEditor from "../components/CodeEditor";
import mascot from "../assets/mascot1.png";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();

  const username = location.state?.username || "Anonymous";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("participants-update", (users) => {
      setParticipants(users);
    });

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

      {/* ================= HEADER ================= */}

      <div className="room-header">

        <div className="header-left">

          <img
            src={mascot}
            alt="Collab Room Mascot"
            className="header-logo"
          />

          <div className="header-text">

            <h1>Collab Room</h1>

            <div className="room-pill">
              Room ID • {roomId}
            </div>

          </div>

        </div>

        <div className="user-card">

          <div className="avatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">

            <h4>{username}</h4>

            <p>
              <span className="online-dot"></span>
              Online
            </p>

          </div>

        </div>

      </div>

      {/* ================= TOP SECTION ================= */}

      <div className="top-section">

        {/* Participants */}

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

        {/* Chat */}

        <div className="chat">

          <h2>Chat</h2>

          <div className="chat-box">

            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.username}</strong>
                <br />
                {msg.message}
              </p>
            ))}

          </div>

          <div className="chat-input">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>

      </div>

      {/* ================= WHITEBOARD ================= */}

      <div className="whiteboard-section">
        <Whiteboard roomId={roomId} />
      </div>

      {/* ================= CODE EDITOR ================= */}

      <div className="editor-section">
        <CodeEditor roomId={roomId} />
      </div>

    </div>
  );
}

export default Room;