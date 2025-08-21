import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you'd handle this more gracefully.
    // For this context, we'll rely on the environment variable being set.
    console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateStory = async (characterName: string, setting: string, userName: string | null): Promise<string> => {
    try {
        let prompt = `Ek super fun aur short story batao (sirf 3-4 lines) about ${characterName}. Scene hai ${setting}.`;

        if (userName) {
            prompt += ` Story mein ${userName} ka naam bhi mention karna, jaise woh unke best friend hain.`;
        }

        prompt += ` Story bilkul simple aur cool honi chahiye!`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a creative storyteller for young kids (under 10) living in a big Indian city like Delhi or Mumbai. Your language should be in modern, urban Hinglish. Use simple English words like 'magic', 'best friends', 'cool', and 'yummy'. Mix them naturally with simple Hindi words. Keep the tone very casual, friendly, and fun, just like how kids talk to each other these days.",
                temperature: 0.8,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating story:", error);
        return "Oh no! My storybook seems to be stuck. Let's try again in a little bit!";
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const fullPrompt = `A vibrant, colorful, and fun cartoon-style picture for a 6-year-old child: ${prompt}. Whimsical and friendly.`;
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Oops! My magic crayon broke. Can you try to draw something else?");
    }
};

export const generateColoringPage = async (characterName: string): Promise<string> => {
     try {
        const prompt = `A simple, clean, black and white line art coloring book page for a 6-year-old child. The character is ${characterName}. The image should have very thick, clear black outlines and lots of big, open spaces to color in. No shading, no gray, no colors. White background.`;
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No coloring page was generated.");

    } catch (error) {
        console.error("Error generating coloring page:", error);
        throw new Error("Looks like my coloring book pages are all mixed up! Please try picking a character again.");
    }
};