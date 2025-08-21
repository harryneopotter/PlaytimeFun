import React from 'react';
import { Character } from './types';

export const STORY_SETTINGS = [
    'on a pirate ship 🏴‍☠️',
    'in Hogwarts castle 🏰',
    'in bustling New York City 🏙️',
    'on a mysterious island 🏝️',
    'in an enchanted forest ✨',
    'in outer space 🚀'
];

export const CHARACTERS: Character[] = [
    {
        id: 'spiderman',
        name: 'Spider-Man',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20">
                <circle cx="50" cy="50" r="45" fill="#DE3C35"/>
                {/* Web lines */}
                <path d="M50 5 V95 M5 50 H95 M21 21 L79 79 M21 79 L79 21" stroke="#222" strokeWidth="1.5"/>
                <path d="M50,5 C77,23 77,35 50,50 C23,35 23,23 50,5" stroke="#222" strokeWidth="1.5" fill="none"/>
                <path d="M95,50 C77,23 65,23 50,50 C65,77 77,77 95,50" stroke="#222" strokeWidth="1.5" fill="none"/>
                <path d="M50,95 C23,77 23,65 50,50 C77,65 77,77 50,95" stroke="#222" strokeWidth="1.5" fill="none"/>
                <path d="M5,50 C23,77 35,77 50,50 C35,23 23,23 5,50" stroke="#222" strokeWidth="1.5" fill="none"/>
                {/* Eyes */}
                <path d="M35 32 C 20 45, 25 70, 48 65 C 50 70, 50 35, 35 32 Z" fill="white"/>
                <path d="M65 32 C 80 45, 75 70, 52 65 C 50 70, 50 35, 65 32 Z" fill="white"/>
                <path d="M35 32 C 20 45, 25 70, 48 65 C 50 70, 50 35, 35 32" stroke="black" strokeWidth="5" fill="none"/>
                <path d="M65 32 C 80 45, 75 70, 52 65 C 50 70, 50 35, 65 32" stroke="black" strokeWidth="5" fill="none"/>
            </svg>
        ),
        universe: 'Marvel',
        color: 'bg-red-500',
        secondaryColor: 'border-red-400'
    },
    {
        id: 'luffy',
        name: 'Luffy',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20">
                {/* Hat */}
                <path d="M50 15 C 20 15, 5 35, 5 50 C 5 55, 95 55, 95 50 C 95 35, 80 15, 50 15 Z" fill="#FBBF24"/>
                <path d="M50 15 C 20 15, 5 35, 5 50" stroke="#F59E0B" fill="none" strokeWidth="3"/>
                <path d="M50 15 C 80 15, 95 35, 95 50" stroke="#F59E0B" fill="none" strokeWidth="3"/>
                <rect x="5" y="48" width="90" height="8" fill="#EF4444" rx="4"/>
                {/* Face & Hair */}
                <path d="M25 56 C 25 90, 75 90, 75 56 Z" fill="#ffdab9" />
                <path d="M25 56 C 40 45, 60 45, 75 56 C 70 65, 30 65, 25 56 Z" fill="#2d3748" />
                <path d="M25 56 L 35 48 L 45 56 L 50 50 L 55 56 L 65 48 L 75 56" fill="#2d3748" />
                {/* Scar */}
                <path d="M42 75 l 5 5 m -3 -5 l -2 2" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        universe: 'One Piece',
        color: 'bg-yellow-500',
        secondaryColor: 'border-yellow-400'
    },
    {
        id: 'harrypotter',
        name: 'Harry Potter',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20">
                {/* Hair */}
                <path d="M25,50 C10,30 50,15 85,35 C95,55 70,80 50,85 C30,80 15,60 25,50 Z" fill="#1A202C"/>
                <path d="M70 30 L 75 20 L 80 30 M60 25 L 65 15 L 70 25 M30 35 L 25 25 L 20 35" stroke="#1A202C" strokeWidth="4" fill="#1A202C"/>
                {/* Scar */}
                <path d="M75 50 l-5 8 l 8 -2" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Glasses */}
                <circle cx="38" cy="68" r="15" stroke="#1A202C" strokeWidth="5" fill="none"/>
                <circle cx="72" cy="68" r="15" stroke="#1A202C" strokeWidth="5" fill="none"/>
                <path d="M53 68 H 57" stroke="#1A202C" strokeWidth="4"/>
            </svg>
        ),
        universe: 'Harry Potter',
        color: 'bg-purple-600',
        secondaryColor: 'border-purple-500'
    },
    {
        id: 'ironman',
        name: 'Iron Man',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20">
                <path d="M20 90 L 20 40 C 20 10, 80 10, 80 40 L 80 90 L 65 98 L 50 88 L 35 98 Z" fill="#A52A2A"/>
                <path d="M22 88 L 22 42 C 22 12, 78 12, 78 42 L 78 88 L 65 95 L 50 85 L 35 95 Z" fill="#DC2626"/>
                {/* Faceplate */}
                <path d="M30 75 V 40 C 30 20, 70 20, 70 40 V 75 H 55 L 50 70 L 45 75 Z" fill="#FBBF24"/>
                {/* Eyes */}
                <rect x="35" y="45" width="10" height="15" rx="2" fill="#E0F2FE"/>
                <rect x="55" y="45" width="10" height="15" rx="2" fill="#E0F2FE"/>
                {/* Mouth area */}
                <path d="M42 68 h16 v5 h-16 z" fill="#A52A2A"/>
            </svg>
        ),
        universe: 'Marvel',
        color: 'bg-red-700',
        secondaryColor: 'border-red-600'
    },
    {
        id: 'zoro',
        name: 'Zoro',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20">
                {/* Hair */}
                <path d="M20,50 C10,30 50,15 90,40 C95,55 70,60 50,65 C30,60 15,60 20,50 Z" fill="#34D399"/>
                <path d="M 20 50 L 25 40 L 30 50 L 35 42 L 40 50 L 45 40 L 50 50 L 55 42 L 60 50 L 65 40 L 70 50 L 75 42 L 80 50 L 85 40 L 90 50" stroke="#10B981" fill="none" strokeWidth="3"/>
                {/* Face */}
                <path d="M25 55 C 20 100, 80 100, 75 55" fill="#FFDAB9" />
                {/* Scar */}
                <path d="M30 65 L 45 80" stroke="#B45309" strokeWidth="3" strokeLinecap="round"/>
                {/* Earrings */}
                <circle cx="28" cy="85" r="4" fill="#FBBF24"/>
                <circle cx="28" cy="93" r="4" fill="#FBBF24"/>
                <circle cx="28" cy="77" r="4" fill="#FBBF24"/>
            </svg>
        ),
        universe: 'One Piece',
        color: 'bg-green-600',
        secondaryColor: 'border-green-500'
    },
    {
        id: 'hermione',
        name: 'Hermione',
        icon: (
             <svg viewBox="0 0 100 100" className="w-20 h-20">
                {/* Hair back */}
                <path d="M50 10 C 0 20, -10 80, 20 95 C 40 105, 60 105, 80 95 C 110 80, 100 20, 50 10 Z" fill="#A16207"/>
                {/* Face */}
                <circle cx="50" cy="60" r="25" fill="#FFEBC9"/>
                {/* Hair front */}
                <path d="M20 60 Q 50 35 80 60" stroke="#CA8A04" strokeWidth="25" fill="none" strokeLinecap="round"/>
                <path d="M25 50 C 15 30, 40 25, 50 25 C 60 25, 85 30, 75 50" fill="#CA8A04"/>
                {/* Eyes */}
                <circle cx="42" cy="62" r="4" fill="black"/>
                <circle cx="58" cy="62" r="4" fill="black"/>
                {/* Scarf */}
                <path d="M30 85 H 70 C 75 85, 75 80, 70 80 L 30 80 C 25 80, 25 85, 30 85 Z" fill="#991B1B"/>
                <path d="M38 85 H 42 V 80 H 38 Z M54 85 H 58 V 80 H 54 Z" fill="#FBBF24"/>
            </svg>
        ),
        universe: 'Harry Potter',
        color: 'bg-yellow-700',
        secondaryColor: 'border-yellow-600'
    }
];