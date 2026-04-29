import type { LatLng } from '../lib/scoring';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type Question = {
  id: string;
  lat: number;
  lng: number;
  panoId: string;
  country: string;
  difficulty: Difficulty;
};

export const QUESTIONS: Question[] = [
  { id: 'tokyo-1', lat: 35.6586, lng: 139.7454, panoId: 'tokyo_tower_001', country: 'Japan', difficulty: 'easy' },
  { id: 'paris-1', lat: 48.8584, lng: 2.2945, panoId: 'eiffel_001', country: 'France', difficulty: 'normal' },
  { id: 'newyork-1', lat: 40.6892, lng: -74.0445, panoId: 'liberty_001', country: 'USA', difficulty: 'normal' }
];

export function questionToAnswerLatLng(question: Question): LatLng {
  return { lat: question.lat, lng: question.lng };
}
