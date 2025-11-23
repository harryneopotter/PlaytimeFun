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
    // Initialize view from URL hash or default to 'story'
    const getInitialView = (): AppView => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            if (['story', 'image', 'coloring', 'piano'].includes(hash)) {
                return hash as AppView;
            }
        }
        return 'story';
    };

    const [view, setView] = useState<AppView>(getInitialView);
    const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));

    // Sync view changes to URL hash
    React.useEffect(() => {
        window.location.hash = view;
    }, [view]);

    // Handle back/forward browser buttons
    React.useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (['story', 'image', 'coloring', 'piano'].includes(hash)) {
                setView(hash as AppView);
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

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