"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();

  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const chunkIndexRef = useRef(0);

  useEffect(() => {
    const socket = io("http://localhost:4000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
    });

    socket.on("transcript", (text: string) => {
      setTranscript((prev) => (prev ? prev + "\n" + text : text));
      setFullTranscript((prev) => (prev ? prev + " " + text : text));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startRecording = async () => {
    if (status === "recording") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      chunkIndexRef.current = 0;

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          chunkIndexRef.current += 1;

          if (socketRef.current?.connected) {
            const buffer = await event.data.arrayBuffer();
            const base64 = btoa(
              String.fromCharCode(...new Uint8Array(buffer))
            );

            socketRef.current.emit("audio-chunk", {
              index: chunkIndexRef.current,
              base64,
            });
          }
        }
      };

      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(8000);
      setStatus("recording");
    } catch (err) {
      alert("Mic permission denied or not available");
      console.error(err);
    }
  };

  const togglePause = () => {
    const rec = mediaRecorderRef.current;
    if (!rec) return;

    if (rec.state === "recording") {
      rec.pause();
      setStatus("paused");
    } else if (rec.state === "paused") {
      rec.resume();
      setStatus("recording");
    }
  };

  const stopRecording = async () => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    }
    setStatus("stopped");

    await fetch(`/api/sessions/${id}/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: fullTranscript }),
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold">Session: {id}</h1>
      <p className="text-sm text-slate-400 mt-1">Status: {status}</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={startRecording}
          className="px-4 py-2 rounded-lg bg-emerald-500 disabled:opacity-50"
          disabled={status === "recording"}
        >
          Start
        </button>

        <button
          onClick={togglePause}
          className="px-4 py-2 rounded-lg bg-yellow-500 disabled:opacity-50"
          disabled={status === "idle" || status === "stopped"}
        >
          {status === "paused" ? "Resume" : "Pause"}
        </button>

        <button
          onClick={stopRecording}
          className="px-4 py-2 rounded-lg bg-red-600 disabled:opacity-50"
          disabled={status === "idle" || status === "stopped"}
        >
          Stop
        </button>
      </div>

      <div className="mt-6 p-4 border border-slate-700 rounded-xl min-h-[200px] whitespace-pre-wrap text-sm text-slate-200">
        {transcript || "Waiting for realtime transcript..."}
      </div>
    </main>
  );
}
