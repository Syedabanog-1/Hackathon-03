import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LearnFlow — AI Python Tutor",
  description: "Learn Python with AI-powered tutoring agents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-blue-400 font-bold text-xl">LearnFlow</Link>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
            <Link href="/editor" className="text-gray-400 hover:text-white">Editor</Link>
            <Link href="/quiz" className="text-gray-400 hover:text-white">Quiz</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
