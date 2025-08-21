# AI Development Rules for Hero Adventure Creator

This document outlines the technical stack and development guidelines for this application. Following these rules ensures consistency, maintainability, and simplicity in the codebase.

## Tech Stack

- **Framework:** React with TypeScript for building the user interface.
- **Build Tool:** Vite for fast development and optimized builds.
- **Styling:** Tailwind CSS for all utility-first styling. Custom fonts are imported from Google Fonts.
- **AI Model:** Google Gemini API (via `@google/genai`) is used for all generative features, including stories, images, and coloring pages.
- **State Management:** React's built-in hooks (`useState`, `useContext`) are used for managing component and application-level state.
- **Audio:** The native Web Audio API is used for the piano feature. The Text-to-Speech functionality is handled by a custom backend endpoint.
- **Icons:** Character icons are custom SVGs defined directly within the application's constants.

## Development Guidelines & Library Usage

### Styling
- **Primary Tool:** All styling **must** be done using Tailwind CSS classes.
- **No New Libraries:** Do not introduce other styling libraries like Styled Components, Emotion, or plain CSS files.
- **Consistency:** Adhere to the existing design language (colors, fonts, spacing) established in the current components.

### State Management
- **Local State:** Use the `useState` hook for component-specific state.
- **Global State:** For state that needs to be shared across multiple components (e.g., speech synthesis status), use the React Context API (`createContext`, `useContext`).
- **Simplicity First:** Avoid adding complex state management libraries like Redux or Zustand. The current approach is sufficient for the app's needs.

### AI Integration
- **Centralized Service:** All interactions with the Google Gemini API **must** be handled through the functions in `src/services/geminiService.ts`.
- **No Direct API Calls:** Do not make direct calls to the Gemini API from components. This keeps the API logic separate and easy to manage.

### Asynchronous Operations
- **HTTP Requests:** Use the native `fetch` API for all network requests (e.g., calling the `/api/speak` endpoint). Do not add external libraries like Axios.
- **Promises:** Use `async/await` syntax for handling asynchronous operations to keep the code clean and readable.

### Components
- **File Structure:** Place all reusable components in the `src/components/` directory.
- **Single Responsibility:** Keep components small and focused on a single task.
- **No Inline Components:** Do not define new components inside other component files. Create a new file for each new component.

### Dependencies
- **Minimize Bloat:** Before adding a new npm package, consider if the functionality can be achieved with existing dependencies or native browser APIs. Every new dependency adds to the bundle size and maintenance overhead.