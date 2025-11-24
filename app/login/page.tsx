"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    await authClient.signUp.email({
      email,
      password: "test1234",
      name: email.split("@")[0] || "User",
    });

    await authClient.signIn.email({
      email,
      password: "test1234",
    });

    window.location.href = "/";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="p-6 rounded-xl border border-slate-800 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          className="w-full p-2 rounded bg-slate-900 border border-slate-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-lg bg-emerald-500"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
