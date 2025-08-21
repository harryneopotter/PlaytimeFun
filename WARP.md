# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

- Repo: hinglish (React + TypeScript + Vite SPA)
- Shell: pwsh on Windows

Core commands
- Install dependencies:
  npm install

- Environment setup (required): set GEMINI_API_KEY in .env.local. Vite loads env via loadEnv and exposes it to code as process.env.API_KEY / process.env.GEMINI_API_KEY (see vite.config.ts).

- Start dev server (opens Vite dev server):
  Note: Do not let a long-running dev server take over this terminal. Launch it in a separate PowerShell window.
  Start-Process pwsh -ArgumentList '-NoExit','-Command','npm run dev'

- Build production bundle:
  npm run build

- Preview built bundle locally:
  npm run preview

- Type-check (no script defined; uses devDependency typescript):
  npx tsc --noEmit

Linting and testing
- Linting: no ESLint/Prettier configuration or scripts detected.
- Testing: no test framework configured.

Important project facts and architecture
- Entry points
  - index.html bootstraps the app, loads Tailwind via CDN, configures ESM import maps for @google/genai, react, and react-dom from esm.sh.
  - index.tsx mounts React root and wraps the app with SpeechProvider (context for text-to-speech playback control).

- App shell and views
  - App.tsx manages the current view via local state: 'story' | 'image' | 'coloring' | 'piano'. It also persists the user’s name in localStorage and gates the UI behind a WelcomeScreen until set.
  - Header.tsx renders the title and greets the persisted user.
  - Nav.tsx switches between views using styled buttons.

- Generative AI integration (services/geminiService.ts)
  - Uses @google/genai with API key from process.env.API_KEY (populated via Vite define in vite.config.ts).
  - generateStory(characterName, setting, userName):
    - Calls models.generateContent with model 'gemini-2.5-flash'. Builds a short Hinglish prompt optionally personalized with userName; returns response.text.
  - generateImage(prompt):
    - Calls models.generateImages with model 'imagen-3.0-generate-002' and returns a data: URI (JPEG) built from base64 image bytes.
  - generateColoringPage(characterName):
    - Calls models.generateImages with constraints for black/white line art and returns a data: URI (PNG).

- UI features by view
  - StoryGenerator.tsx: lets the user pick a character (CHARACTERS in constants.tsx) and a setting (STORY_SETTINGS), generates Hinglish story text via generateStory, and supports read-aloud via ReadAloudButton.
  - ImageGenerator.tsx: generates whimsical images from prompts via generateImage with a few suggested prompts.
  - ColoringBook.tsx: generates a line-art coloring page via generateColoringPage and provides an on-canvas flood fill tool with a small palette; supports downloading the colored result.
  - Piano.tsx: simple Web Audio API synthesizer for a one-octave keyboard.

- Speech/TTS pathway
  - SpeechContext.tsx exposes speak({ text, lang }) and stop(). It expects a backend endpoint POST /api/speak that returns MP3 audio for the given text and lang (en-US or hi-IN). That endpoint is not present in this repo; without it, ReadAloudButton will not play audio. Plan accordingly when developing or testing.

- Styling/UX
  - Tailwind CSS is loaded via CDN in index.html (no local PostCSS/Tailwind pipeline). Fonts 'Fredoka One' and 'Nunito' are pulled from Google Fonts.

- Vite config
  - vite.config.ts uses loadEnv to read env (no VITE_ prefix required) and injects process.env.API_KEY and process.env.GEMINI_API_KEY into the client bundle. It also defines an alias @ -> repo root.

Notes for future automation in Warp
- Long-running servers: honor the user’s rule to avoid taking over the active terminal. Use a new PowerShell window (Start-Process) for npm run dev.
- Secrets: never print or inline API keys. Place GEMINI_API_KEY in .env.local only.

