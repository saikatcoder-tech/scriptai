# ScribeAI Project (Supabase + Gemini 2.5 Pro)

## Setup

1. Install dependencies:

   npm install

2. Copy env file:

   copy .env.example .env   # on Windows

   Then edit .env and set:
   - DATABASE_URL from Supabase
   - GEMINI_API_KEY from Google AI Studio

3. Run Prisma migrate:

   npx prisma migrate dev --name init

4. Start Next dev server:

   npm run dev

5. In another terminal, start socket server:

   npm run socket

## Usage

- Open http://localhost:3000/login → sign up / login with any email.
- Then go to http://localhost:3000 → click "Start Session".
- It redirects to /session/[id].
- Click "Start", allow microphone, speak, watch transcript.
- Click "Stop" to stop and send full transcript to backend.
