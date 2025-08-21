import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CHARACTERS } from '../constants';
import type { Character } from '../types';
import { generateColoringPage } from '../services/geminiService';
import Spinner from './Spinner';
import { useSpeech } from '../context/SpeechContext';

// --- Color Palette ---
const COLORS = [
    '#FF3B30', // Red
    '#FF9500', // Orange
    '#FFCC00', // Yellow
    '#34C759', // Green
    '#007AFF', // Blue
    '#AF52DE', // Purple
    '#A2845E', // Brown
    '#000000', // Black
    '#FFFFFF', // White (Eraser)
];

const CharacterCard: React.FC<{
    character: Character;
    onSelect: (character: Character) => void;
    isSelected: boolean;
}> = ({ character, onSelect, isSelected }) => (
    <button
        onClick={() => onSelect(character)}
        aria-label={`Select ${character.name} to color`}
        className={`p-4 rounded-xl text-center transition-all duration-300 w-36 h-36 flex flex-col items-center justify-center
        ${isSelected ? `${character.color} text-white scale-110 shadow-lg` : 'bg-slate-700 hover:bg-slate-600'}
        border-4 ${isSelected ? character.secondaryColor : 'border-transparent'}`}
    >
        <div className="flex-grow flex items-center justify-center">{character.icon}</div>
        <span className="font-bold mt-2 text-sm">{character.name}</span>
    </button>
);


const ColoringBook: React.FC = () => {
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);
    const [coloringPageUrl, setColoringPageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [activeColor, setActiveColor] = useState<string>(COLORS[0]);
    const { speak } = useSpeech();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const drawImageOnCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (canvas && image && image.complete) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                ctx.drawImage(image, 0, 0);
            }
        }
    }, []);

    const handleGeneratePage = useCallback(async (character: Character) => {
        setSelectedChar(character);
        setError('');
        setLoading(true);
        setColoringPageUrl('');
        imageRef.current = null;
        try {
            const result = await generateColoringPage(character.name);
            setColoringPageUrl(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (coloringPageUrl) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = coloringPageUrl;
            img.onload = () => {
                imageRef.current = img;
                drawImageOnCanvas();
            };
        }
    }, [coloringPageUrl, drawImageOnCanvas]);

    const handleSelectAndGenerate = (character: Character) => {
        speak({ text: character.name, lang: 'en-US' });
        handleGeneratePage(character);
    };
    
    const hexToRgb = (hex: string): [number, number, number] => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0,0,0];
    };

    const floodFill = (x: number, y: number, fillColor: [number, number, number]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = Math.floor((x - rect.left) * scaleX);
        const canvasY = Math.floor((y - rect.top) * scaleY);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const startPos = (canvasY * canvas.width + canvasX) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];

        // If target is black (outline) or the same as fill color, do nothing
        if ((startR < 50 && startG < 50 && startB < 50) || (startR === fillColor[0] && startG === fillColor[1] && startB === fillColor[2])) {
            return;
        }

        const pixelStack: [number, number][] = [[canvasX, canvasY]];

        while (pixelStack.length) {
            const [currentX, currentY] = pixelStack.pop()!;
            let reachLeft = false;
            let reachRight = false;
            
            let currentPos = (currentY * canvas.width + currentX) * 4;
            while (currentY >= 0 && data[currentPos] === startR && data[currentPos + 1] === startG && data[currentPos + 2] === startB) {
                currentPos -= canvas.width * 4;
            }
            currentPos += canvas.width * 4;

            while (currentY < canvas.height && data[currentPos] === startR && data[currentPos+1] === startG && data[currentPos+2] === startB) {
                 data[currentPos] = fillColor[0];
                 data[currentPos + 1] = fillColor[1];
                 data[currentPos + 2] = fillColor[2];
                 
                 if (currentX > 0) {
                     let checkPos = currentPos - 4;
                     if(data[checkPos] === startR && data[checkPos+1] === startG && data[checkPos+2] === startB){
                         if(!reachLeft){
                             pixelStack.push([currentX - 1, currentY]);
                             reachLeft = true;
                         }
                     } else if(reachLeft){
                         reachLeft = false;
                     }
                 }

                 if (currentX < canvas.width - 1) {
                     let checkPos = currentPos + 4;
                     if(data[checkPos] === startR && data[checkPos+1] === startG && data[checkPos+2] === startB){
                         if(!reachRight){
                            pixelStack.push([currentX + 1, currentY]);
                            reachRight = true;
                         }
                     } else if(reachRight) {
                        reachRight = false;
                     }
                 }

                 currentPos += canvas.width * 4;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const rgb = hexToRgb(activeColor);
        floodFill(event.clientX, event.clientY, rgb);
    };
    
    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = `${selectedChar?.name}-coloring-masterpiece.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-display text-center text-pink-300 mb-6">Digital Coloring Book!</h2>
            
            {!coloringPageUrl && (
                 <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {CHARACTERS.map(char => (
                        <CharacterCard 
                            key={char.id} 
                            character={char} 
                            onSelect={handleSelectAndGenerate} 
                            isSelected={loading && selectedChar?.id === char.id}
                        />
                    ))}
                </div>
            )}
            
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

            {loading && <div className="mt-8"><Spinner message="Getting the magic canvas ready..." /></div>}
            
            {coloringPageUrl && !loading && (
                <div className="mt-4 flex flex-col lg:flex-row items-center justify-center gap-8 animate-fade-in">
                    {/* Color Palette */}
                    <div className="flex flex-row lg:flex-col gap-3 p-3 bg-slate-700 rounded-full">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                aria-label={`Select color ${color}`}
                                onClick={() => setActiveColor(color)}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-transform transform hover:scale-110 border-4
                                ${activeColor === color ? 'border-yellow-300 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                            >
                                {color === '#FFFFFF' && <span className="text-black text-xl">E</span>}
                            </button>
                        ))}
                    </div>

                    {/* Canvas */}
                    <div className="p-2 bg-white rounded-lg shadow-lg">
                         <canvas
                            ref={canvasRef}
                            onClick={handleCanvasClick}
                            className="cursor-pointer max-w-full h-auto"
                            style={{imageRendering: 'pixelated', width: '512px', height: '512px'}}
                        />
                    </div>
                    
                    {/* Action Buttons */}
                     <div className="flex flex-row lg:flex-col gap-4">
                        <button onClick={drawImageOnCanvas} className="font-display bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105">Clear</button>
                        <button onClick={handleDownload} className="font-display bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105">Download</button>
                        <button onClick={() => setColoringPageUrl('')} className="font-display bg-slate-600 hover:bg-slate-700 text-white text-lg px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105">Back</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColoringBook;