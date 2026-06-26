import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import socket from "../socket";

function CodeEditor({ roomId }) {
  const [code, setCode] = useState(`// Welcome!
function hello() {
  console.log("Hello World");
}`);

  useEffect(() => {
    socket.on("code-change", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-change");
    };
  }, []);

  const handleCodeChange = (value) => {
    const updatedCode = value || "";

    setCode(updatedCode);

    socket.emit("code-change", {
      roomId,
      code: updatedCode,
    });
  };

  return (
    <div>
      <h2>Code Editor</h2>

      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
      />
    </div>
  );
}

export default CodeEditor;