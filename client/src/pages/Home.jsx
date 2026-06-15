import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Collaborative Coding Room</h1>

      <input
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <br />
      <br />

      <button onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
}

export default Home;