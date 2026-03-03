"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "agent";
  text: string;
  agent?: string;
}

interface Props {
  topic?: string;
  code?: string;
}

const STRUGGLE_PHRASES = ["i don't understand", "i'm stuck", "i dont understand", "help me", "confused"];

export default function ChatPanel({ topic, code }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: "Hi! I'm your LearnFlow tutor. Ask me anything about Python!", agent: "Triage" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);

    // Detect struggle phrases client-side for immediate UX
    const isStruggling = STRUGGLE_PHRASES.some((p) => text.toLowerCase().includes(p));
    if (isStruggling) {
      setMessages((m) => [...m, { role: "agent", text: "I can see you're finding this challenging — that's completely normal! Let me help you break it down step by step.", agent: "Debug" }]);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, topic, code }),
      });
      const result = await res.json();
      setMessages((m) => [...m, { role: "agent", text: result.reply, agent: result.agent }]);
    } catch {
      setMessages((m) => [...m, { role: "agent", text: "Sorry, I'm having trouble right now. Please try again.", agent: "System" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-800 text-sm font-medium text-gray-400">
        AI Tutor Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "agent" && (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-800 text-gray-100 rounded-bl-none"
              }`}
            >
              {m.role === "agent" && m.agent && (
                <div className="text-xs text-blue-400 mb-1 font-medium">{m.agent} Agent</div>
              )}
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-xl px-4 py-2 text-sm text-gray-400 animate-pulse">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-800 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask about Python… (Enter to send)"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
