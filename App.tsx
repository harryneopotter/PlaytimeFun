import React, { useState } from 'react';
import { AppView } from './types';
import Header from './components/Header';
import Nav from './components/Nav';
import StoryGenerator from './components/StoryGenerator';
import ImageGenerator from './components/ImageGenerator';
import ColoringBook from './components/ColoringBook';
import WelcomeScreen from './components/WelcomeScreen';
import Piano from './components/Piano';

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('story');
    const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));

    const handleNameSet = (name: string) => {
        localStorage.setItem('userName', name);
        setUserName(name);
    };

    // If no name is set, show the welcome screen
    if (!userName) {
        return <WelcomeScreen onNameSet={handleNameSet} />;
    }

    const renderView = () => {
        switch (view) {
            case 'story':
                return <StoryGenerator userName={userName} />;
            case 'image':
                return <ImageGenerator />;
            case 'coloring':
                return <ColoringBook />;
            case 'piano':
                return <Piano />;
            default:
                return <StoryGenerator userName={userName} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
            <div 
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center" 
                style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)', opacity: 0.3}}
            ></div>
            <div className="relative z-10 flex flex-col items-center w-full min-h-screen p-4 sm:p-6">
                <Header userName={userName} />
                <Nav activeView={view} setView={setView} />
                <main className="w-full max-w-5xl mt-6">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;