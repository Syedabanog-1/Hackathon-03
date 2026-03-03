"use client";
import { useState } from "react";
import { saveProgress, postStruggleAlert } from "@/lib/api";

const TOPIC_SLUG: Record<string, string> = {
  "Control Flow": "control-flow",
  "Data Structures": "data-structures",
  "Functions": "functions",
  "Basics": "basics",
};

const QUESTIONS = [
  { q: "What does `range(5)` produce?", options: ["0 to 4", "1 to 5", "0 to 5", "1 to 4"], answer: 0, topic: "Control Flow" },
  { q: "Which data type is immutable in Python?", options: ["List", "Dictionary", "Tuple", "Set"], answer: 2, topic: "Data Structures" },
  { q: "What keyword defines a function in Python?", options: ["function", "def", "fn", "lambda"], answer: 1, topic: "Functions" },
  { q: "What does `len([1, 2, 3])` return?", options: ["2", "3", "4", "1"], answer: 1, topic: "Basics" },
  { q: "Which loop runs while a condition is True?", options: ["for", "foreach", "while", "loop"], answer: 2, topic: "Control Flow" },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctByTopic, setCorrectByTopic] = useState<Record<string, number>>({});
  const [totalByTopic, setTotalByTopic] = useState<Record<string, number>>({});

  const q = QUESTIONS[current];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowFeedback(true);
    const isCorrect = i === q.answer;
    if (isCorrect) setScore((s) => s + 1);
    const slug = TOPIC_SLUG[q.topic] ?? q.topic.toLowerCase().replace(/ /g, "-");
    setCorrectByTopic((prev) => ({ ...prev, [slug]: (prev[slug] ?? 0) + (isCorrect ? 1 : 0) }));
    setTotalByTopic((prev) => ({ ...prev, [slug]: (prev[slug] ?? 0) + 1 }));
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    if (current + 1 >= QUESTIONS.length) {
      finishQuiz();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const finishQuiz = () => {
    const quizPct = (score / QUESTIONS.length) * 100;
    const uniqueSlugs = Object.keys(totalByTopic);
    uniqueSlugs.forEach((slug) => {
      const topicPct = ((correctByTopic[slug] ?? 0) / totalByTopic[slug]) * 100;
      saveProgress(slug, { quizScore: topicPct }).catch(() => {});
      if (topicPct < 50) {
        postStruggleAlert("student-current", slug, "quiz_below_50").catch(() => {});
      }
    });
    if (quizPct < 50) {
      postStruggleAlert("student-current", "general", "quiz_below_50").catch(() => {});
    }
    setDone(true);
  };

  const masteryGain = Math.round((score / QUESTIONS.length) * 30);

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">{score >= 4 ? "🎉" : score >= 3 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-gray-400 mb-6">
          You scored <span className="text-blue-400 font-bold">{score}/{QUESTIONS.length}</span>
        </p>
        <div className="card mb-6">
          <div className="text-sm text-gray-400 mb-1">Mastery gain (quiz component, 30% weight)</div>
          <div className="text-3xl font-bold text-green-400">+{masteryGain}%</div>
        </div>
        <button
          onClick={() => { setCurrent(0); setScore(0); setDone(false); setSelected(null); setCorrectByTopic({}); setTotalByTopic({}); }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <span>Question {current + 1} of {QUESTIONS.length}</span>
        <span>Topic: {q.topic}</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
        <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${((current) / QUESTIONS.length) * 100}%` }} />
      </div>

      <h2 className="text-xl font-semibold mb-6">{q.q}</h2>

      <div className="flex flex-col gap-3 mb-6">
        {q.options.map((opt, i) => {
          let cls = "card cursor-pointer hover:border-blue-500 transition-colors text-sm";
          if (showFeedback) {
            if (i === q.answer) cls = "card border-green-500 bg-green-900/20 text-sm";
            else if (i === selected) cls = "card border-red-500 bg-red-900/20 text-sm";
            else cls = "card opacity-50 text-sm";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} className={cls + " text-left"}>
              <span className="text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`mb-4 px-4 py-2 rounded text-sm ${selected === q.answer ? "bg-green-900/30 text-green-300 border border-green-700" : "bg-red-900/30 text-red-300 border border-red-700"}`}>
          {selected === q.answer ? "✓ Correct!" : `✗ Incorrect. Correct answer: ${q.options[q.answer]}`}
        </div>
      )}

      {showFeedback && (
        <button onClick={handleNext} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          {current + 1 >= QUESTIONS.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}
