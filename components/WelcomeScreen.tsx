import React, { useState } from 'react';
import { CHARACTERS } from '../constants';
import { useSpeech } from '../context/SpeechContext';

interface WelcomeScreenProps {
    onNameSet: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNameSet }) => {
    const [name, setName] = useState('');
    const { speak } = useSpeech();

    // Updated stickers array with all characters and positions to fill the screen
    const stickers = [
        // Main characters spread out in corners
        { char: CHARACTERS[0], pos: 'top-4 left-1 sm:left-4 md:top-8 md:left-12', rot: '-rotate-12', size: 'w-20 h-20 md:w-32 md:h-32', opacity: 'opacity-20 sm:opacity-30' }, // Spider-Man
        { char: CHARACTERS[1], pos: 'top-10 right-1 sm:right-8 md:top-16 md:right-20', rot: 'rotate-15', size: 'w-24 h-24 md:w-36 md:h-36', opacity: 'opacity-20 sm:opacity-30' }, // Luffy
        { char: CHARACTERS[5], pos: 'bottom-8 left-1 sm:left-10 md:bottom-12 md:left-24', rot: 'rotate-10', size: 'w-20 h-20 md:w-32 md:h-32', opacity: 'opacity-20 sm:opacity-30' }, // Hermione
        { char: CHARACTERS[3], pos: 'bottom-4 right-1 sm:right-4 md:bottom-8 md:right-16', rot: '-rotate-6', size: 'w-28 h-28 md:w-40 md:h-40', opacity: 'opacity-20 sm:opacity-30' }, // Iron Man
        
        // Characters positioned to be partially visible behind the translucent panel
        { char: CHARACTERS[4], pos: 'top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2', rot: 'rotate-20', size: 'w-24 h-24 md:w-40 md:h-40', opacity: 'opacity-10 sm:opacity-20' }, // Zoro
        { char: CHARACTERS[2], pos: 'top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2', rot: '-rotate-15', size: 'w-20 h-20 md:w-32 md:h-32', opacity: 'opacity-10 sm:opacity-20' }, // Harry Potter
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;

        // The greeting is in Hindi, as per the app's audio language.
        const greeting = `नमस्ते, ${trimmedName}! चलो कुछ मजेदार कहानियां बनाएं।`;
        
        speak({ text: greeting, lang: 'hi-IN' });

        onNameSet(trimmedName);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
             <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(var(--tw-rotate)); }
                    50% { transform: translateY(-15px) rotate(var(--tw-rotate)); }
                    100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>

             <div 
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" 
                style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)', opacity: 0.3}}
            ></div>

            {/* Background stickers */}
            {stickers.map(({ char, pos, rot, size, opacity }, index) => (
                <div 
                    key={`${char.id}-${index}`}
                    className={`absolute ${pos} ${size} ${opacity} animate-float ${rot} transition-opacity duration-500`}
                    style={{ animationDelay: `${index * 1.5}s` }}
                >
                    {char.icon}
                </div>
            ))}

            <div className="relative z-10 text-center bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-12 shadow-2xl animate-fade-in max-w-lg w-full">
                <h1 className="text-4xl sm:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-cyan-400 drop-shadow-lg mb-4">
                    Welcome, Hero!
                </h1>
                <p className="text-slate-300 mb-8 text-lg">
                    What should we call you?
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type your name here..."
                        className="w-full max-w-sm p-4 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center"
                        aria-label="Your name"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="font-display bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-3xl px-10 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg mt-4"
                    >
                        Let's Go!
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomeScreen;