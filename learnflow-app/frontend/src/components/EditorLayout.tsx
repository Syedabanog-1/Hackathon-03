"use client";
import { useState } from "react";
import CodeEditor from "./CodeEditor";
import ChatPanel from "./ChatPanel";
import { TOPIC_MAP } from "@/lib/topics";

const DEFAULT_CODE = `# LearnFlow Python Editor
# Write your code below and click Run

def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}! Welcome to LearnFlow."

print(greet("Maya"))

for i in range(1, 6):
    print(f"Count: {i}")
`;

interface Props {
  topic?: string;
}

export default function EditorLayout({ topic }: Props) {
  const topicInfo = topic ? TOPIC_MAP[topic] : null;
  const [code, setCode] = useState(topicInfo?.starterCode ?? DEFAULT_CODE);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="border-b border-gray-800 px-6 py-2 flex items-center gap-3">
        <span className="font-semibold text-sm">Python Editor</span>
        {topicInfo && (
          <span className="px-2 py-0.5 bg-blue-900/40 border border-blue-700 rounded text-blue-300 text-xs">
            {topicInfo.moduleName} › {topicInfo.name}
          </span>
        )}
        <span className="text-gray-600 text-xs ml-auto">5s timeout · 50MB · stdlib only</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <CodeEditor defaultValue={code} onCodeChange={setCode} />
        </div>
        <div className="w-80 border-l border-gray-800 p-4">
          <ChatPanel topic={topicInfo?.name} code={code} />
        </div>
      </div>
    </div>
  );
}
