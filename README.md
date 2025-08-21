<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  <h1>Kid's Hero Adventure Creator</h1>
  <p>A magical web application that empowers kids to create their own hero adventures! Unleash your creativity with an AI-powered story generator, an image creator, a digital coloring book, and a virtual piano.</p>
</div>

## ✨ Features

This application is a playground for young adventurers, offering a variety of activities:

- **📖 Story Generator:** Enter your name and watch as the AI crafts a unique story with you as the hero!
- **🎨 Image Generator:** Describe a scene or a character, and the AI will generate an image to match your imagination.
- **🖍️ Coloring Book:** Bring generated images to life with a digital coloring book.
- **🎹 Piano:** Compose your own hero's theme song on a virtual piano.

## 🚀 Technology Stack

- **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
- **[Vite](https://vitejs.dev/):** A next-generation frontend tooling for fast development.
- **[TypeScript](https://www.typescriptlang.org/):** A typed superset of JavaScript that compiles to plain JavaScript.
- **[Google Gemini](https://ai.google.dev/):** The AI model powering the story and image generation.
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.

## 🔧 Getting Started

To run this project locally, follow these steps:

**Prerequisites:**

- [Node.js](https://nodejs.org/) (v14 or later)
- `npm` or `yarn`

**Installation & Setup:**

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd kids-hero-adventure-creator
    ```
    *(Replace `<repository-url>` with the actual repository URL.)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**

    Create a file named `.env.local` in the root of your project and add your Google Gemini API key:

    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

    You can get your API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal) to see the application in action.

## 🎮 How to Use

1.  **Enter Your Name:** Start by entering your name on the welcome screen to personalize your adventure.
2.  **Navigate:** Use the navigation bar to switch between the different activities: Story, Image, Coloring, and Piano.
3.  **Create:** Let your imagination run wild! Generate stories, create images, color them in, and compose music.

---

<p align="center">Made with ❤️ for young heroes everywhere.</p>
