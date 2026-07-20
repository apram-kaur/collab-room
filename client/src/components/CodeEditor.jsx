import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import socket from "../socket";

function CodeEditor({ roomId }) {

  const [language, setLanguage] = useState("javascript");

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

      <div className="editor-toolbar">

        <div className="language-select">

          <label>💻 Language</label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>

        </div>

      </div>

      <Editor
        height="500px"
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          fontSize: 15,
          minimap: {
            enabled: false,
          },
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />

    </div>
  );
}

export default CodeEditor;