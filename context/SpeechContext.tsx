import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';

interface SpeechContextState {
    speak: (args: { text: string; lang: 'en-US' | 'hi-IN' }) => void;
    stop: () => void;
    isSpeaking: boolean;
    isSupported: boolean;
}

const SpeechContext = createContext<SpeechContextState | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.");
            }
        }
        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    const stop = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;

        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current = null;
        }
        
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
        }

        setIsSpeaking(false);
    }, []);

    const playWithNativeTTS = useCallback((text: string, lang: 'en-US' | 'hi-IN') => {
        console.warn("Falling back to native browser TTS.");
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            setIsSpeaking(false);
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Native TTS Error:", e);
            setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
    }, []);

    const speak = useCallback(async ({ text, lang }: { text: string; lang: 'en-US' | 'hi-IN' }) => {
        stop(); 

        if (!text.trim()) return;

        setIsSpeaking(true);
        
        if (!audioContextRef.current) {
            playWithNativeTTS(text, lang);
            return;
        }
        
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const response = await fetch('/api/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, lang }),
                signal,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            
            await audioContextRef.current.decodeAudioData(arrayBuffer, 
                (buffer) => {
                    const source = audioContextRef.current!.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioContextRef.current!.destination);
                    source.start(0);
                    
                    sourceRef.current = source;
                    
                    source.onended = () => {
                        setIsSpeaking(false);
                        sourceRef.current = null;
                    };
                },
                (decodeError) => {
                    console.error("Error decoding audio data, falling back to native TTS.", decodeError);
                    playWithNativeTTS(text, lang);
                }
            );

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted.');
                setIsSpeaking(false);
            } else {
                console.error("Failed to fetch from /api/speak, falling back to native TTS.", error);
                playWithNativeTTS(text, lang);
            }
        }
    }, [stop, playWithNativeTTS]);

    const isSupported = !!(typeof window !== 'undefined' && (window.speechSynthesis || window.AudioContext || (window as any).webkitAudioContext));

    const value = { speak, stop, isSpeaking, isSupported };

    return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
};

export const useSpeech = (): SpeechContextState => {
    const context = useContext(SpeechContext);
    if (context === undefined) {
        throw new Error('useSpeech must be used within a SpeechProvider');
    }
    return context;
};