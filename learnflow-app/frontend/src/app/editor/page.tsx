import CodeEditor from "@/components/CodeEditor";
import ChatPanel from "@/components/ChatPanel";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="border-b border-gray-800 px-6 py-2 flex items-center gap-3">
        <span className="font-semibold text-sm">Python Editor</span>
        <span className="text-gray-600 text-xs">5s timeout · 50MB limit · stdlib only</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <CodeEditor
            defaultValue={`# LearnFlow Python Editor
# Write your code below and click Run

def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}! Welcome to LearnFlow."

# Test it
print(greet("Maya"))

# Try a for loop
for i in range(1, 6):
    print(f"Count: {i}")
`}
          />
        </div>
        <div className="w-80 border-l border-gray-800 p-4">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
