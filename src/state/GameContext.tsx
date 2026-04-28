import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { haversineKm, scoreByDistance, type LatLng } from '../lib/scoring';

type Question = {
  id: string;
  name: string;
  answer: LatLng;
};

type RoundResult = {
  questionName: string;
  distanceKm: number;
  gainedScore: number;
};

type GameContextType = {
  round: number;
  totalScore: number;
  currentQuestion: Question | null;
  lastResult: RoundResult | null;
  startRound: () => void;
  submitGuess: (guess: LatLng) => RoundResult | null;
  resetGame: () => void;
};

const QUESTIONS: Question[] = [
  { id: 'tokyo-tower', name: 'Tokyo', answer: { lat: 35.6586, lng: 139.7454 } }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [round, setRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);

  const startRound = () => {
    setRound((prev) => prev + 1);
    setCurrentQuestion(QUESTIONS[0]);
    setLastResult(null);
  };

  const submitGuess = (guess: LatLng) => {
    if (!currentQuestion) return null;
    const distanceKm = haversineKm(guess, currentQuestion.answer);
    const gainedScore = scoreByDistance(distanceKm);
    setTotalScore((prev) => prev + gainedScore);
    const result = { questionName: currentQuestion.name, distanceKm, gainedScore };
    setLastResult(result);
    return result;
  };

  const resetGame = () => {
    setRound(0);
    setTotalScore(0);
    setCurrentQuestion(null);
    setLastResult(null);
  };

  const value = useMemo(
    () => ({ round, totalScore, currentQuestion, lastResult, startRound, submitGuess, resetGame }),
    [round, totalScore, currentQuestion, lastResult]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
