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
        <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-10">
          <Link href="/" className="text-blue-400 font-bold text-xl tracking-tight">LearnFlow</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/editor" className="text-gray-400 hover:text-white transition-colors">Editor</Link>
            <Link href="/quiz" className="text-gray-400 hover:text-white transition-colors">Quiz</Link>
            <Link href="/login" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors">
              Login
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
