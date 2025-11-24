import "./globals.css";
import React from "react";

export const metadata = {
  title: "ScribeAI",
  description: "Realtime AI transcription",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <nav className="border-b border-slate-800 p-4 flex justify-between items-center">
          <span className="font-bold">ScribeAI</span>
          <div className="flex gap-4 text-sm">
            <a href="/" className="text-slate-300 hover:text-white">Dashboard</a>
            <a href="/login" className="text-slate-300 hover:text-white">Login</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
