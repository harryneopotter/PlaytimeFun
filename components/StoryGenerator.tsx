import React, { useState, useCallback } from 'react';
import { CHARACTERS, STORY_SETTINGS } from '../constants';
import type { Character } from '../types';
import { generateStory } from '../services/geminiService';
import Spinner from './Spinner';
import ReadAloudButton from './ReadAloudButton';
import { useSpeech } from '../context/SpeechContext';

const CharacterCard: React.FC<{
    character: Character;
    onSelect: (character: Character) => void;
    isSelected: boolean;
}> = ({ character, onSelect, isSelected }) => (
    <button
        onClick={() => onSelect(character)}
        aria-label={`Select ${character.name}`}
        className={`p-4 rounded-xl text-center transition-all duration-300 w-36 h-36 flex flex-col items-center justify-center
        ${isSelected ? `${character.color} text-white scale-110 shadow-lg` : 'bg-slate-700 hover:bg-slate-600'}
        border-4 ${isSelected ? character.secondaryColor : 'border-transparent'}`}
    >
        <div className="flex-grow flex items-center justify-center">{character.icon}</div>
        <span className="font-bold mt-2 text-sm">{character.name}</span>
    </button>
);

const StoryGenerator: React.FC<{ userName: string | null }> = ({ userName }) => {
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);
    const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
    const [story, setStory] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { speak } = useSpeech();
    
    const handleCharacterSelect = (character: Character) => {
        speak({ text: character.name, lang: 'en-US' });
        setSelectedChar(character);
    };

    const handleGenerateStory = useCallback(async () => {
        if (!selectedChar || !selectedSetting) {
            setError('Please choose a hero and a setting for the story!');
            return;
        }
        setError('');
        setLoading(true);
        setStory('');
        try {
            const result = await generateStory(selectedChar.name, selectedSetting, userName);
            setStory(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [selectedChar, selectedSetting, userName]);

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-display text-center text-blue-300 mb-6">Create a Fun Story!</h2>
            
            <div className="mb-8">
                <h3 className="text-2xl font-display text-yellow-300 mb-4">1. Pick a Hero!</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {CHARACTERS.map(char => (
                        <CharacterCard key={char.id} character={char} onSelect={handleCharacterSelect} isSelected={selectedChar?.id === char.id} />
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-display text-yellow-300 mb-4">2. Pick a Setting!</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {STORY_SETTINGS.map(setting => (
                        <button key={setting} onClick={() => setSelectedSetting(setting)} className={`p-4 text-lg rounded-xl transition-transform transform hover:scale-105 ${selectedSetting === setting ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-700'}`}>
                            {setting}
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button onClick={handleGenerateStory} disabled={loading} className="font-display bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-3xl px-10 py-4 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                    {loading ? 'Thinking...' : 'Tell Me a Story!'}
                </button>
                 {error && (
                    <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-400 mt-4 animate-bounce-short">
                        <div className="text-4xl mb-2">😢</div>
                        <p className="text-red-200 font-bold">{error}</p>
                    </div>
                )}
            </div>

            {loading && <div className="mt-8"><Spinner message="Creating an awesome story..." /></div>}

            {story && !loading && (
                <div className="mt-8 p-6 bg-slate-900/70 rounded-xl border-2 border-blue-400 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-display text-blue-300">Your Amazing Story!</h3>
                        <ReadAloudButton textToRead={story} lang="hi-IN" ariaLabel="Read story aloud" />
                    </div>
                    <p className="text-xl leading-relaxed text-slate-200" lang="hi-IN">{story}</p>
                </div>
            )}
        </div>
    );
};

export default StoryGenerator;