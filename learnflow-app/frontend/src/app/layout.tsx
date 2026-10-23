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
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <nav className="border-b border-gray-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 sticky top-0 bg-gray-950/90 backdrop-blur z-10">
          <Link href="/" className="text-blue-400 font-bold text-lg sm:text-xl tracking-tight">LearnFlow</Link>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm overflow-x-auto">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">Dashboard</Link>
            <Link href="/editor" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">Editor</Link>
            <Link href="/quiz" className="text-gray-400 hover:text-white transition-colors whitespace-nowrap">Quiz</Link>
          </div>
        </nav>
        <main className="min-w-0">{children}</main>
      </body>
    </html>
  );
}
