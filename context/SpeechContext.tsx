import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

interface SpeechContextState {
    speak: (args: { text: string; lang: 'en-US' | 'hi-IN' }) => void;
    stop: () => void;
    isSpeaking: boolean;
    isSupported: boolean;
}

const SpeechContext = createContext<SpeechContextState | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // This function stops any currently playing audio.
    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = ''; // Detach the source
            audioRef.current = null;
        }
        setIsSpeaking(false);
    }, []);

    const speak = useCallback(async ({ text, lang }: { text: string; lang: 'en-US' | 'hi-IN' }) => {
        // Stop any previous speech before starting a new one.
        stop();

        // Don't try to speak empty text.
        if (!text.trim()) return;

        setIsSpeaking(true);

        try {
            // This is the backend endpoint you need to create.
            // It receives text and lang, and should stream back MP3 audio.
            const response = await fetch('/api/speak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, lang }),
            });

            if (!response.ok) {
                // If the server returns an error, log it and stop.
                const errorData = await response.json();
                console.error("Error from TTS API:", errorData);
                throw new Error(errorData.error || 'Failed to fetch audio from server.');
            }

            // Get the audio data as a Blob.
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Create a new Audio object to play the sound.
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            // Set up event listeners to update the speaking state.
            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl); // Clean up the object URL.
            };
            audio.onerror = (e) => {
                console.error("Error playing audio:", e);
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
            };

            // Play the audio.
            await audio.play();

        } catch (error) {
            console.error("Failed to speak:", error);
            setIsSpeaking(false); // Ensure we reset the state on error.
        }
    }, [stop]);

    // The feature is "supported" as long as the browser can play audio.
    const isSupported = true; 

    const value = { speak, stop, isSpeaking, isSupported };

    return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
};

// --- Custom Hook ---
export const useSpeech = (): SpeechContextState => {
    const context = useContext(SpeechContext);
    if (context === undefined) {
        throw new Error('useSpeech must be used within a SpeechProvider');
    }
    return context;
};
