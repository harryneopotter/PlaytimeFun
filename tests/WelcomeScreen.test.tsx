import { render, screen, fireEvent } from '@testing-library/react';
import WelcomeScreen from '../components/WelcomeScreen';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock the SpeechContext
vi.mock('../context/SpeechContext', () => ({
    useSpeech: () => ({
        speak: vi.fn(),
        stop: vi.fn(),
        isSpeaking: false,
        isSupported: true,
    }),
}));

describe('WelcomeScreen', () => {
    it('renders correctly', () => {
        render(<WelcomeScreen onNameSet={() => {}} />);
        expect(screen.getByText(/Welcome, Hero!/i)).toBeInTheDocument();
    });

    it('allows entering a name and submitting', () => {
        const handleNameSet = vi.fn();
        render(<WelcomeScreen onNameSet={handleNameSet} />);
        
        const input = screen.getByPlaceholderText(/Type your name here.../i);
        const button = screen.getByText(/Let's Go!/i);

        fireEvent.change(input, { target: { value: 'Aarav' } });
        fireEvent.click(button);

        expect(handleNameSet).toHaveBeenCalledWith('Aarav');
    });
});
