"use client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { executeCode } from "@/lib/api";

interface Props {
  defaultValue?: string;
  onResult?: (output: string) => void;
  onCodeChange?: (code: string) => void;
}

export default function CodeEditor({
  defaultValue = "# Write Python here\nprint('Hello, LearnFlow!')\n",
  onResult,
  onCodeChange,
}: Props) {
  const [code, setCode] = useState(defaultValue);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setOutput("⏳ Running…");
    try {
      const result = await executeCode(code);
      const out = result.output || result.error || "(no output)";
      setOutput(out);
      onResult?.(out);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Execution failed";
      setOutput(`❌ Error: ${msg}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Python Editor</span>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-sm font-medium transition-colors"
        >
          <span>{running ? "⏳" : "▶"}</span>
          {running ? "Running…" : "Run"}
        </button>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-800">
        <Editor
          height="280px"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(v) => { const val = v ?? ""; setCode(val); onCodeChange?.(val); }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
          }}
        />
      </div>

      {output && (
        <div>
          <div className="text-xs text-gray-500 mb-1">Output</div>
          <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-green-300 whitespace-pre-wrap max-h-40 overflow-auto font-mono">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
