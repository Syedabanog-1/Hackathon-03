import { NextRequest, NextResponse } from "next/server";

function detectAgent(message: string): string {
  const lower = message.toLowerCase();
  if (lower.match(/error|bug|fix|crash|exception|traceback/)) return "Debug";
  if (lower.match(/exercise|practice|quiz|challenge/)) return "Exercise";
  if (lower.match(/review|check my code|feedback/)) return "Review";
  if (lower.match(/progress|score|mastery|level/)) return "Progress";
  return "Concepts";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: "AI tutor is not configured (missing API key). Please contact the admin.", agent: "System" },
      { status: 503 }
    );
  }

  const { message, topic, code } = await req.json();

  const systemParts = [
    "You are a friendly, expert Python tutor for LearnFlow — an AI-powered Python learning platform.",
    "Give clear, concise answers with short code examples when helpful. Always encourage the student.",
    "Format code in markdown code blocks.",
  ];
  if (topic) systemParts.push(`The student is currently studying: "${topic}".`);
  if (code?.trim()) {
    systemParts.push(`Their current code in the editor:\n\`\`\`python\n${code}\n\`\`\``);
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemParts.join("\n"),
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[tutor]", response.status, err);
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble right now. Please try again.", agent: "System" },
      { status: 502 }
    );
  }

  const data = await response.json();
  const reply = data.content?.[0]?.text ?? "I couldn't generate a response. Please try again.";
  return NextResponse.json({ reply, agent: detectAgent(message) });
}
