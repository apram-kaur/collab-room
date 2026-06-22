import { useRef, useEffect, useState } from "react";
import socket from "../socket";

function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = 800;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
  }, []);

  useEffect(() => {
    socket.on("start-drawing", (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(data.x, data.y);

      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.brushSize;
    });

    socket.on("drawing", (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.brushSize;

      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    socket.on("stop-drawing", () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.beginPath();
    });

    return () => {
      socket.off("start-drawing");
      socket.off("drawing");
      socket.off("stop-drawing");
    };
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const currentColor = isErasing
      ? "white"
      : color;

    const currentBrushSize = isErasing
      ? 20
      : brushSize;

    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentBrushSize;

    socket.emit("start-drawing", {
      roomId,
      x,
      y,
      color: currentColor,
      brushSize: currentBrushSize,
    });

    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit("drawing", {
      roomId,
      x,
      y,
      color: isErasing ? "white" : color,
      brushSize: isErasing ? 20 : brushSize,
    });
  };

  const stopDrawing = () => {
    setDrawing(false);

    socket.emit("stop-drawing", {
      roomId,
    });
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  return (
    <div>
      <h2>Whiteboard</h2>

      <label>Pick a color: </label>

      <input
        type="color"
        value={color}
        onChange={(e) =>
          setColor(e.target.value)
        }
      />

      <label> Brush Size: </label>

      <select
        value={brushSize}
        onChange={(e) =>
          setBrushSize(Number(e.target.value))
        }
      >
        <option value={2}>Small</option>
        <option value={5}>Medium</option>
        <option value={10}>Large</option>
        <option value={20}>Extra Large</option>
      </select>

      <br />
      <br />

      <button
        onClick={() => setIsErasing(false)}
      >
        🖌 Draw
      </button>

      <button
        onClick={() => setIsErasing(true)}
      >
        🧽 Eraser
      </button>

      <button onClick={clearBoard}>
        🗑 Clear Board
      </button>

      <br />
      <br />

      <p>
        Mode:{" "}
        {isErasing
          ? "🧽 Eraser"
          : "🖌 Draw"}
      </p>

      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid black",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

export default Whiteboard;