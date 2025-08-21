import React, { useRef } from 'react';

const Piano: React.FC = () => {
    const audioContextRef = useRef<AudioContext | null>(null);

    // Function to create and play a sound
    const playNote = (frequency: number) => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
                return;
            }
        }
        const audioContext = audioContextRef.current;
        // Resume context if it was suspended by browser autoplay policies
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine'; // A pleasant, gentle tone
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        // Gentle volume attack and decay to prevent clicking
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.7);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.7);
    };

    const notes = {
        C: 261.63, 'C#': 277.18, D: 293.66, 'D#': 311.13, E: 329.63,
        F: 349.23, 'F#': 369.99, G: 392.00, 'G#': 415.30, A: 440.00,
        'A#': 466.16, B: 493.88, C5: 523.25,
    };

    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'];
    const blackKeys = [
        { name: 'C#', position: 0 },
        { name: 'D#', position: 1 },
        { name: 'F#', position: 3 },
        { name: 'G#', position: 4 },
        { name: 'A#', position: 5 },
    ];

    const handlePlay = (e: React.MouseEvent | React.TouchEvent, freq: number) => {
        e.preventDefault();
        playNote(freq);
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl animate-fade-in flex flex-col items-center w-full">
            <h2 className="text-3xl sm:text-4xl font-display text-center text-teal-300 mb-8">Virtual Piano 🎹</h2>
            
            <div className="w-full max-w-4xl">
                 <div className="relative h-48 sm:h-56 md:h-64 select-none">
                    {/* White Keys */}
                    <div className="flex w-full h-full">
                        {whiteKeys.map(noteName => (
                            <button
                                key={noteName}
                                onMouseDown={(e) => handlePlay(e, notes[noteName])}
                                onTouchStart={(e) => handlePlay(e, notes[noteName])}
                                aria-label={`Play note ${noteName}`}
                                className="flex-1 h-full bg-white border-2 border-slate-300 rounded-b-lg text-black font-bold flex items-end justify-center pb-2 sm:pb-4 transition-all duration-75 active:bg-gray-200 active:translate-y-px"
                            >
                                {noteName.replace('5', '')}
                            </button>
                        ))}
                    </div>
                    {/* Black Keys */}
                    {blackKeys.map(({ name, position }) => {
                        const numWhiteKeys = whiteKeys.length;
                        const whiteKeyWidth = 100 / numWhiteKeys;
                        const blackKeyWidth = whiteKeyWidth * 0.6;
                        const leftPosition = (position + 1) * whiteKeyWidth - (blackKeyWidth / 2);

                        return (
                            <button
                                key={name}
                                onMouseDown={(e) => handlePlay(e, notes[name])}
                                onTouchStart={(e) => handlePlay(e, notes[name])}
                                aria-label={`Play note ${name}`}
                                className="absolute top-0 h-2/3 bg-slate-900 border-2 border-slate-700 rounded-b-md z-10 transition-all duration-75 active:bg-slate-700 active:translate-y-px"
                                style={{
                                    width: `${blackKeyWidth}%`,
                                    left: `${leftPosition}%`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <p className="text-slate-400 mt-6 text-center">Click or tap the keys to play music!</p>
        </div>
    );
};

export default Piano;
