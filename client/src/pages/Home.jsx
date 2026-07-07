import "./Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import mascot from "../assets/mascot1.png"; // <-- change filename if needed

function Home() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  const joinRoom = () => {
    if (!username || !roomId) return;

    navigate(`/room/${roomId}`, {
      state: {
        username,
      },
    });
  };

  return (
    <div className="home-page">

      <div className="home-card">

        <img
          src={mascot}
          alt="Collab Room"
          className="home-logo"
        />

        <h1 className="home-title">
          Collab Room
        </h1>

        <p className="home-subtitle">
          Code • Draw • Collaborate Together
        </p>

        <div className="input-group">

          <input
            type="text"
            placeholder="👤  Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="🔑  Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

        </div>

        <button
          className="join-btn"
          onClick={joinRoom}
        >
          ✨ Join Workspace
        </button>

        <p className="footer-text">
          Real-time coding • Whiteboard • Chat
        </p>

      </div>

    </div>
  );
}

export default Home;