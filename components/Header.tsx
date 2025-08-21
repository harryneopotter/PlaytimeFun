import React from 'react';

interface HeaderProps {
    userName?: string | null;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
    return (
        <header className="text-center mb-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-cyan-400 drop-shadow-lg">
                Hero Adventure Creator
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
                {userName 
                    ? `Let's create, ${userName}! 👋` 
                    : 'Create your own stories and pictures! ✨'}
            </p>
        </header>
    );
};

export default Header;