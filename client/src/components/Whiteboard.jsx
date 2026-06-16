import { useRef, useEffect, useState } from "react";

function Whiteboard() {
  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = 800;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
  }, [color]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  return (
    <div>
      <h2>Whiteboard</h2>

      <label>
        Pick a color:{" "}
      </label>

      <input
        type="color"
        value={color}
        onChange={(e) =>
          setColor(e.target.value)
        }
      />

      <br />
      <br />

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