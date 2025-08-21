import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';

const PROMPT_SUGGESTIONS = [
    "Spider-Man eating ice cream with Luffy",
    "Harry Potter playing soccer with Iron Man",
    "Zoro and Hermione having a picnic on a pirate ship",
    "All the heroes having a dance party in space",
    "Luffy finds a treasure map on Spider-Man's web",
    "Iron Man building a magical broomstick for Harry Potter"
];

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const doGenerateImage = useCallback(async (promptToGenerate: string) => {
        if (!promptToGenerate) {
            setError("Tell me what you want to see!");
            return;
        }
        setError('');
        setLoading(true);
        setImageUrl('');
        try {
            const result = await generateImage(promptToGenerate);
            setImageUrl(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSurpriseMe = () => {
        const randomPrompt = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
        setPrompt(randomPrompt);
        doGenerateImage(randomPrompt);
    };

    const handleGenerateFromInput = () => {
        doGenerateImage(prompt);
    }

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
            <style>{`
                @keyframes pulse-bright {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.05); }
                }
                .animate-pulse-bright {
                    animation: pulse-bright 2s infinite;
                }
            `}</style>
            <h2 className="text-3xl sm:text-4xl font-display text-center text-green-300 mb-6">Create a Magical Picture!</h2>

            <div className="text-center mb-6">
                <button
                    onClick={handleSurpriseMe}
                    disabled={loading}
                    className="font-display bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white text-3xl px-10 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg animate-pulse-bright"
                >
                    Surprise Me! ✨
                </button>
            </div>

            <div className="text-center text-slate-400 mb-6 font-display text-xl">
                - or -
            </div>

            <div>
                <h3 className="text-xl font-display text-yellow-300 mb-3 text-center">Type your own idea!</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A hero flying through the sky..."
                        className="w-full p-4 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                        aria-label="Image generation prompt"
                    />
                    <button 
                        onClick={handleGenerateFromInput} 
                        disabled={loading || !prompt} 
                        className="font-display bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-2xl px-8 py-3 rounded-full transition-transform transform hover:scale-105 shadow-lg w-full sm:w-auto flex-shrink-0"
                    >
                        Create!
                    </button>
                </div>
            </div>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

            {loading && <div className="mt-8"><Spinner message="Mixing the magic colors..." /></div>}

            {imageUrl && !loading && (
                <div className="mt-8 p-4 bg-slate-900/70 rounded-xl border-2 border-green-400 animate-fade-in flex flex-col items-center">
                    <h3 className="text-2xl font-display text-green-300 mb-4">Ta-da! Your masterpiece!</h3>
                    <img src={imageUrl} alt={prompt} className="rounded-lg shadow-lg max-w-full h-auto" style={{width: '512px', height: '512px'}}/>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;
