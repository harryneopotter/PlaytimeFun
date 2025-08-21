import React from 'react';
import { useSpeech } from '../context/SpeechContext';

interface ReadAloudButtonProps {
    textToRead: string;
    lang: 'en-US' | 'hi-IN';
    className?: string;
    ariaLabel?: string;
}

const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ textToRead, lang, className = '', ariaLabel = 'Read text aloud' }) => {
    const { isSpeaking, isSupported, speak, stop } = useSpeech();

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isSupported || !textToRead) return;

        if (isSpeaking) {
            stop();
        } else {
            speak({ text: textToRead, lang });
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <button
            onClick={handleSpeak}
            aria-label={ariaLabel}
            className={`transition-transform transform hover:scale-110 active:scale-95 ${className}`}
        >
            <span className={`text-3xl ${isSpeaking ? 'animate-pulse' : ''}`}>
                {isSpeaking ? '🤫' : '🔊'}
            </span>
        </button>
    );
};

export default ReadAloudButton;