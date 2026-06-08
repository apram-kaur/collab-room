import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

function Room() {
  const { roomId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-message", (data) => {
      console.log("MESSAGE ARRIVED:", data);

      setMessages((prev) => [...prev, data]);
    });

    socket.on("participants-update", (users) => {
      setParticipants(users);
    });

    return () => {
      socket.off("receive-message");
      socket.off("participants-update");
    };
  }, [roomId]);

  const sendMessage = () => {
    console.log("SEND CLICKED");

    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      message,
    });

    setMessage("");
  };

  return (
    <div>
      <h1>Room: {roomId}</h1>

      <h2>Participants</h2>

      <ul>
        {participants.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>

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
        <p key={index}>{msg.message}</p>
      ))}
    </div>
  );
}

export default Room;