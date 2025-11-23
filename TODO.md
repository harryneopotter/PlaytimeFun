# Project To-Do List

## 🧪 Testing
- [x] **Setup Testing Infrastructure**
    - Install `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom`.
    - Configure `vite.config.ts` for testing.
    - Add `test` script to `package.json`.
- [ ] **Component Tests**
    - [x] `WelcomeScreen`: Test name input and storage.
    - [ ] `StoryGenerator`: Test character selection and loading states.
    - [ ] `Piano`: Test key rendering (audio might be mocked).
- [ ] **Service Tests**
    - `geminiService`: Mock API calls to test success/failure handling.
- [ ] **Context Tests**
    - `SpeechContext`: Test fallback logic when API keys are missing.

## 🚀 Deployment & Ops
- [ ] **Environment Validation**
    - Add a check on startup to warn if `GEMINI_API_KEY` is missing (currently logs to console).
- [ ] **CI/CD**
    - Create a GitHub Action for running tests on PRs.
