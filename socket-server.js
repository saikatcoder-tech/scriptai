require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", async (socket) => {
  console.log("client connected:", socket.id);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    generationConfig: {
      temperature: 0,
    },
  });

  socket.on("audio-chunk", async ({ base64 }) => {
    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Transcribe this audio exactly. Do NOT add explanation or extra text. Only output the spoken words:",
              },
              {
                inlineData: {
                  mimeType: "audio/webm",
                  data: base64,
                },
              },
            ],
          },
        ],
      });

      const text = result.response.text();
      io.to(socket.id).emit("transcript", text);
    } catch (err) {
      console.error("Gemini error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

httpServer.listen(4000, () => {
  console.log("🚀 Socket server running http://localhost:4000");
});
