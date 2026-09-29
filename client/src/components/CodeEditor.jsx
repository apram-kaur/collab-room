import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import socket from "../socket";

function CodeEditor({ roomId }) {

  const [language, setLanguage] = useState("javascript");
const [showCopyToast, setShowCopyToast] = useState(false);

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

  // SAVE CODE
  const saveCode = () => {

    const extensions = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      json: "json",
    };

    const extension = extensions[language] || "txt";

    const blob = new Blob([code], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `collab-room-code.${extension}`;

    link.click();

    URL.revokeObjectURL(url);
  };

  // COPY CODE
  const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(code);

    setShowCopyToast(true);

    setTimeout(() => {
      setShowCopyToast(false);
    }, 2000);

  } catch (error) {
    console.error(
      "Failed to copy code:",
      error
    );
  }
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

        <button
          className="copy-code-btn"
          onClick={copyCode}
        >
          📋 Copy Code
        </button>

        <button
          className="save-code-btn"
          onClick={saveCode}
        >
          💾 Save Code
        </button>

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
{showCopyToast && (
  <div className="copy-code-toast">
    <span>✓</span>
    Code copied!
  </div>
)}
    </div>
  );
}

export default CodeEditor;