import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

function Room() {
  const { roomId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-message", (data) => {
  console.log("MESSAGE ARRIVED:", data);

  setMessages((prev) => [...prev, data]);
});
    return () => {
      socket.off("receive-message");
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