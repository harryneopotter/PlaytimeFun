# Copilot Instructions for PlaytimeFun

## Project Overview
PlaytimeFun is a kid-friendly interactive entertainment app built with **React 19 + TypeScript + Vite**. The app features four modes: story generation, image creation, coloring pages, and an interactive piano.

**Origin Story**: Created to keep the developer's niece and nephew (ages 7-11) entertained during holiday visits. The characters reflect their individual interests, and the Hinglish language/tone mirrors how they speak at home and school in urban India. Result: 2 days of uninterrupted coding time. 🎯

**Target Audience**: Children 7-11 years old in urban India, familiar with modern Hinglish (mixed Hindi-English).

## Tech Stack & Architecture

### Core Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (dev server runs on `npm run dev`)
- **Styling**: Tailwind CSS exclusively - no CSS files, styled-components, or other styling solutions
- **AI/ML**: Google Gemini API (`@google/genai`) for all generative features
- **Audio**: Native Web Audio API for piano; custom Supabase Edge Function for TTS (ElevenLabs)

### Key Dependencies
- `@google/genai` - All AI generation (stories, images, coloring pages)
- `react` & `react-dom` (v19) - UI framework
- Native browser APIs only - **no axios, no lodash, no UI libraries**

## Application Architecture

### Entry Point & State Flow
```
index.tsx → SpeechProvider (global) → App.tsx → [Component Views]
```

1. **App.tsx**: Main router with view state (`story|image|coloring|piano`)
2. **Welcome screen** on first visit captures `userName` → stored in `localStorage`
3. **Global speech state** via `SpeechContext` for read-aloud features across all components

### Component Structure
```
components/
  ├── WelcomeScreen.tsx     # Onboarding - sets userName
  ├── Header.tsx            # Shows userName
  ├── Nav.tsx               # View switcher
  ├── StoryGenerator.tsx    # Character + setting selection → Gemini story
  ├── ImageGenerator.tsx    # Prompt input → Gemini image generation
  ├── ColoringBook.tsx      # Character selection → Gemini coloring page
  ├── Piano.tsx             # Web Audio API keyboard
  ├── ReadAloudButton.tsx   # TTS integration
  └── Spinner.tsx           # Loading indicator
```

### Data Flow Pattern
All components follow this pattern:
1. User selects options (character, setting, prompt)
2. Call `services/geminiService.ts` function (never direct API calls)
3. Show `<Spinner />` during loading
4. Display result with error handling
5. Optionally enable read-aloud via `useSpeech()` hook

## Critical Conventions

### Styling Rules
- **All styling via Tailwind classes** - example from `StoryGenerator.tsx`:
  ```tsx
  <button className={`p-4 rounded-xl ${isSelected ? 'bg-green-500 text-white' : 'bg-slate-700'}`}>
  ```
- Common patterns:
  - Dark theme: `bg-slate-900`, `bg-slate-800/50`, `text-white`
  - Accent colors: `text-blue-300`, `text-yellow-300`
  - Interactive states: `hover:scale-105`, `transition-all duration-300`

### State Management
- **Local state**: `useState` for component-specific data
- **Global state**: `SpeechContext` only (no Redux/Zustand)
- **Persistence**: `localStorage` for `userName` only

### Gemini API Integration
**All AI calls must go through `services/geminiService.ts`:**
```typescript
// ✅ Correct - centralized service
import { generateStory } from '../services/geminiService';
const story = await generateStory(characterName, setting, userName);

// ❌ Wrong - direct API call
const ai = new GoogleGenAI({ apiKey: ... });
```

Functions available:
- `generateStory(characterName, setting, userName)` → Returns Hinglish story text
- `generateImage(prompt)` → Returns base64 data URL
- `generateColoringPage(characterName)` → Returns base64 PNG data URL

### Character System
Characters defined in `constants.tsx` with inline SVG icons:
```typescript
export const CHARACTERS: Character[] = [
  {
    id: 'spiderman',
    name: 'Spider-Man',
    icon: <svg>...</svg>,  // Custom inline SVG
    universe: 'Marvel',
    color: 'bg-red-500',
    secondaryColor: 'border-red-400'
  },
  // ... more characters
];
```
**Note**: Character list is finalized based on specific kids' interests. No new characters needed.

### Text-to-Speech Architecture
Two-tier system in `context/SpeechContext.tsx`:
1. **Primary**: Supabase Edge Function (`supabase/functions/speak/`) → ElevenLabs API
   - Uses `eleven_multilingual_v2` model for English + Hindi support
   - Requires `ELEVENLABS_API_KEY` in Supabase function env
   - Voice ID `pNInz6obpgDQGcFmaJgB` selected for child-friendly tone
2. **Fallback**: Native browser `window.speechSynthesis` API
3. **Usage**: `const { speak, stop, isSpeaking } = useSpeech();`

## Development Workflows

### Running Locally
```bash
npm install                    # Install dependencies
# Set GEMINI_API_KEY in .env.local
npm run dev                    # Start Vite dev server
```

### Environment Variables
- **Required**: `GEMINI_API_KEY` in `.env.local` (exposed as `process.env.API_KEY` via `vite.config.ts`)
- **Supabase Function**: `ELEVENLABS_API_KEY` for TTS (set in Supabase dashboard)

### Build & Deploy
```bash
npm run build    # Production build
npm run preview  # Preview production build locally
```

**Deployment**: App is deployed on **Google Cloud Run**. Build produces static files that are served via containerized deployment.

### Testing
Tests should be added for:
- Component rendering with different props/states
- Gemini service error handling
- Speech context state transitions
- Character/setting selection flows

## Common Patterns

### Character Selection with Audio Feedback
```tsx
const handleCharacterSelect = (character: Character) => {
    speak({ text: character.name, lang: 'en-US' });
    setSelectedChar(character);
};
```

### API Call with Loading State
```tsx
const [loading, setLoading] = useState(false);
setLoading(true);
try {
    const result = await generateStory(charName, setting, userName);
    setState(result);
} catch (e) {
    setError(e.message);
} finally {
    setLoading(false);
}
```

### Conditional Rendering Pattern
```tsx
{loading && <Spinner />}
{error && <p className="text-red-400">{error}</p>}
{result && <div>{result}</div>}
```
## What NOT to Do
- ❌ Add new npm packages without checking if native APIs suffice
- ❌ Create inline styled-components or CSS files
- ❌ Make direct Gemini API calls from components
- ❌ Define components inside other component files
- ❌ Use complex state management libraries
- ❌ Add new characters (current list is intentionally curated)
- ❌ Change the Hinglish tone/language style - it's region-specific by designnt files
- ❌ Use complex state management libraries

## Key Files to Reference
- `AI_RULES.md` - Extended technical guidelines
- `services/geminiService.ts` - AI integration patterns
- `context/SpeechContext.tsx` - Global state example
- `constants.tsx` - Character/setting data structure
- `types.ts` - TypeScript interfaces
