import "./Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import mascot from "../assets/mascot1.png";
import socket from "../socket";

function Home() {

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showCopied, setShowCopied] = useState(false);

  const navigate = useNavigate();


  // =========================
  // CREATE ROOM
  // =========================

  const createRoom = () => {

    if (!roomName.trim() || !username.trim()) {
      return;
    }

    const newRoomId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();


    socket.emit(
      "create-room",
      {
        roomId: newRoomId,
        roomName: roomName.trim(),
        username: username.trim(),
      },

      (response) => {

        if (!response.success) {

          alert("❌ " + response.message);

          return;
        }


        navigate(`/room/${newRoomId}`, {
          state: {
            username: username.trim(),
            roomName: roomName.trim(),
          },
        });

      }
    );

  };


  // =========================
  // JOIN ROOM
  // =========================

  const joinRoom = () => {

    if (!roomId.trim() || !username.trim()) {
      return;
    }

    const formattedRoomId =
      roomId.trim().toUpperCase();


    socket.emit(
      "join-room",
      {
        roomId: formattedRoomId,
        username: username.trim(),
      },

      (response) => {

        if (!response.success) {

          alert("❌ " + response.message);

          return;
        }


        navigate(`/room/${formattedRoomId}`, {
          state: {
            username: username.trim(),
            roomName: response.roomName,
          },
        });

      }
    );

  };


  return (

    <div className="home">

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className="home-card">

        <img
          src={mascot}
          alt="Mascot"
          className="home-logo"
        />

        <h1>Collab Room</h1>

        <p className="tagline">
          Code together. Draw together.
          <br />
          Build together.
        </p>


        <button
          className="primary-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Room
        </button>


        <div className="divider">
          Already have a room?
        </div>


        <button
          className="secondary-btn"
          onClick={() => setShowJoinModal(true)}
        >
          Join Existing Room
        </button>

      </div>


      {/* =================================================
          CREATE ROOM MODAL
      ================================================= */}

      {showCreateModal && (

        <div className="modal-overlay">

          <div className="create-modal">

            <button
              className="close-btn"
              onClick={() => setShowCreateModal(false)}
            >
              ×
            </button>


            <img
              src={mascot}
              alt="Mascot"
              className="modal-logo"
            />


            <h2>
              Create a new room
            </h2>


            <p className="modal-subtitle">
              Set up your collaborative workspace
            </p>


            <div className="form-group">

              <label>
                Room Name
              </label>


              <input
                type="text"
                placeholder="e.g. DBMS Project"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />

            </div>


            <div className="form-group">

              <label>
                Your Name
              </label>


              <input
                type="text"
                placeholder="e.g. Apram"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </div>


            <button
              className="modal-create-btn"
              onClick={createRoom}
            >
              Create Room 🚀
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          JOIN ROOM MODAL
      ================================================= */}

      {showJoinModal && (

        <div className="modal-overlay">

          <div className="create-modal">

            <button
              className="close-btn"
              onClick={() => setShowJoinModal(false)}
            >
              ×
            </button>


            <img
              src={mascot}
              alt="Mascot"
              className="modal-logo"
            />


            <h2>
              Join a room
            </h2>


            <p className="modal-subtitle">
              Enter the room details to get started
            </p>


            {/* ROOM ID */}

            <div className="form-group">

              <label>
                Room ID
              </label>


              <input
                type="text"
                placeholder="e.g. A7K2XM"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />

            </div>


            {/* USERNAME */}

            <div className="form-group">

              <label>
                Your Name
              </label>


              <input
                type="text"
                placeholder="e.g. Apram"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </div>


            <button
              className="modal-create-btn"
              onClick={joinRoom}
            >
              Join Room 🚀
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default Home;