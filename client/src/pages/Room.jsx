import "./Room.css";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";
import Whiteboard from "../components/Whiteboard";
import CodeEditor from "../components/CodeEditor";
import mascot from "../assets/mascot1.png";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username || "Anonymous";
  const roomName = location.state?.roomName || "Collab Room";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");

  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  useEffect(() => {

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleParticipantsUpdate = (users) => {
      setParticipants(users);
    };

    // Register listeners FIRST
    socket.on("receive-message", handleReceiveMessage);
    socket.on("participants-update", handleParticipantsUpdate);

    const handleUserTyping = (username) => {
  setTypingUser(username);
};

const handleUserStoppedTyping = () => {
  setTypingUser("");
};

socket.on("user-typing", handleUserTyping);
socket.on("user-stopped-typing", handleUserStoppedTyping);

    // THEN join the room
    socket.emit(
      "join-room",
      {
        roomId,
        username,
      },
      (response) => {
        console.log("JOIN RESPONSE:", response);
      }
    );

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("participants-update", handleParticipantsUpdate);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stopped-typing", handleUserStoppedTyping);
    };

  }, [roomId, username]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const handleTyping = (e) => {

  setMessage(e.target.value);

  socket.emit("user-typing", {
    roomId,
    username,
  });
};
 const sendMessage = () => {
  if (!message.trim()) return;

  socket.emit("send-message", {
    roomId,
    username,
    message,
  });

  // Stop typing indicator
  socket.emit("user-stopped-typing", {
    roomId,
    username,
  });

  setMessage("");
};

  // ==========================================
  // COPY ROOM ID
  // ==========================================

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);

      setToastMessage("Room ID copied!");
      setShowCopied(true);

      setTimeout(() => {
        setShowCopied(false);
      }, 2500);

    } catch (error) {
      console.error("Failed to copy Room ID:", error);
    }
  };

  // ==========================================
  // COPY INVITE LINK
  // ==========================================

  const copyInviteLink = async () => {
    try {
      const inviteLink = window.location.href;

      await navigator.clipboard.writeText(inviteLink);

      setToastMessage("Invite link copied!");
      setShowCopied(true);

      setTimeout(() => {
        setShowCopied(false);
      }, 2500);

    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  // ==========================================
  // LEAVE ROOM
  // ==========================================

  const leaveRoom = () => {
    socket.emit("leave-room", {
      roomId,
    });

    navigate("/");
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

              <span>
                {roomName} • {roomId}
              </span>

              <button
                className="copy-room-btn"
                onClick={copyRoomId}
              >
                📋 Copy ID
              </button>

              <button
                className="copy-room-btn invite-btn"
                onClick={copyInviteLink}
              >
                🔗 Invite
              </button>

            </div>

          </div>

        </div>

        <div className="header-actions">

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

          <button
            className="leave-room-btn"
            onClick={leaveRoom}
          >
            🚪 Leave
          </button>

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
            {typingUser && typingUser !== username && (
  <div className="typing-row">

    <div className="typing-bubble">

      <span className="typing-username">
        {typingUser} is typing
      </span>

      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>

  </div>
)}

            {messages.map((msg, index) => {

              const isOwnMessage =
                msg.username === username;

              return (
                <div
                  key={index}
                  className={`message-row ${
                    isOwnMessage
                      ? "own-message"
                      : "other-message"
                  }`}
                >

                  <div className="message-bubble">

                    <span className="message-username">
                      {isOwnMessage
                        ? "You"
                        : msg.username}
                    </span>

                    <p>
                      {msg.message}
                    </p>

                  </div>

                </div>
              );

            })}

          </div>

          <div className="chat-input">

            <input
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>

      </div>

      {/* ================= WORKSPACE ================= */}

      <div className="workspace">

        {/* Whiteboard */}

        <div className="whiteboard-section">
          <Whiteboard roomId={roomId} />
        </div>

        {/* Code Editor */}

        <div className="editor-section">
          <CodeEditor roomId={roomId} />
        </div>

      </div>

      {/* ================= COPY TOAST ================= */}

      {showCopied && (
        <div className="copy-toast">
          <span>✓</span>
          {toastMessage}
        </div>
      )}

    </div>
  );
}

export default Room;