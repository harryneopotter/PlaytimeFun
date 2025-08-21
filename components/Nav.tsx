import React from 'react';
import type { AppView } from '../types';

interface NavProps {
    activeView: AppView;
    setView: (view: AppView) => void;
}

const NavButton: React.FC<{
    label: string;
    view: AppView;
    activeView: AppView;
    setView: (view: AppView) => void;
    color: string;
}> = ({ label, view, activeView, setView, color }) => {
    const isActive = activeView === view;
    return (
        <button
            onClick={() => setView(view)}
            className={`font-display text-xl sm:text-2xl px-6 py-3 rounded-full transition-all duration-300 transform
            ${isActive
                ? `${color} text-white shadow-lg scale-110`
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105'
            }`}
        >
            {label}
        </button>
    );
};


const Nav: React.FC<NavProps> = ({ activeView, setView }) => {
    return (
        <nav className="flex justify-center items-center space-x-2 sm:space-x-4 bg-slate-800/50 p-3 rounded-full shadow-md">
            <NavButton label="📖 Story" view="story" activeView={activeView} setView={setView} color="bg-blue-500" />
            <NavButton label="🎨 Picture" view="image" activeView={activeView} setView={setView} color="bg-green-500" />
            <NavButton label="🖍️ Coloring" view="coloring" activeView={activeView} setView={setView} color="bg-pink-500" />
            <NavButton label="🎹 Piano" view="piano" activeView={activeView} setView={setView} color="bg-teal-500" />
        </nav>
    );
};

export default Nav;