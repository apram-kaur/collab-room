import { useRef, useEffect, useState } from "react";

function Whiteboard() {
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

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

  }, [color, brushSize]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (isErasing) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 20;
} else {
  ctx.strokeStyle = color;
  ctx.lineWidth = brushSize;
}
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

      <label>
  Brush Size:
</label>

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
  Mode: {isErasing ? "🧽 Eraser" : "🖌 Draw"}
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