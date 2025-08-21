import type React from 'react';

export interface Character {
  id: string;
  name: string;
  icon: React.ReactNode;
  universe: 'Marvel' | 'One Piece' | 'Harry Potter';
  color: string;
  secondaryColor: string;
}

export type AppView = 'story' | 'image' | 'coloring' | 'piano';