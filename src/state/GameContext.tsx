import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { QUESTIONS, questionToAnswerLatLng, type Question } from '../data/questions';
import { haversineKm, scoreByDistance, type LatLng } from '../lib/scoring';

const TOTAL_ROUNDS = 3;
const ROUND_SECONDS = 30;

export type RoundStatus = 'idle' | 'playing' | 'scored' | 'finished';

type RoundResult = {
  questionId: string;
  country: string;
  distanceKm: number;
  gainedScore: number;
};

type GameContextType = {
  round: number;
  totalRounds: number;
  totalScore: number;
  timer: number;
  status: RoundStatus;
  currentQuestion: Question | null;
  currentGuess: LatLng | null;
  roundResults: RoundResult[];
  isGuestAuthenticated: boolean;
  startRound: () => void;
  updateGuess: (guess: LatLng) => void;
  submitGuess: () => RoundResult | null;
  goToNextRound: () => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function getQuestionByRound(round: number): Question {
  const index = (round - 1) % QUESTIONS.length;
  return QUESTIONS[index];
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [round, setRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timer] = useState(ROUND_SECONDS);
  const [status, setStatus] = useState<RoundStatus>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentGuess, setCurrentGuess] = useState<LatLng | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [isGuestAuthenticated] = useState(true);

  const startRound = () => {
    if (status === 'playing') return;
    const nextRound = round === 0 ? 1 : round;
    setRound(nextRound);
    setCurrentQuestion(getQuestionByRound(nextRound));
    setCurrentGuess(null);
    setStatus('playing');
  };

  const updateGuess = (guess: LatLng) => {
    if (status !== 'playing') return;
    setCurrentGuess(guess);
  };

  const submitGuess = () => {
    if (!currentQuestion || !currentGuess || status !== 'playing') return null;
    const distanceKm = haversineKm(currentGuess, questionToAnswerLatLng(currentQuestion));
    const gainedScore = scoreByDistance(distanceKm);
    const result: RoundResult = {
      questionId: currentQuestion.id,
      country: currentQuestion.country,
      distanceKm,
      gainedScore
    };
    setRoundResults((prev) => [...prev, result]);
    setTotalScore((prev) => prev + gainedScore);
    setStatus(round >= TOTAL_ROUNDS ? 'finished' : 'scored');
    return result;
  };

  const goToNextRound = () => {
    if (status !== 'scored') return;
    const nextRound = round + 1;
    setRound(nextRound);
    setCurrentQuestion(getQuestionByRound(nextRound));
    setCurrentGuess(null);
    setStatus('playing');
  };

  const resetGame = () => {
    setRound(0);
    setTotalScore(0);
    setStatus('idle');
    setCurrentQuestion(null);
    setCurrentGuess(null);
    setRoundResults([]);
  };

  const value = useMemo(
    () => ({
      round,
      totalRounds: TOTAL_ROUNDS,
      totalScore,
      timer,
      status,
      currentQuestion,
      currentGuess,
      roundResults,
      isGuestAuthenticated,
      startRound,
      updateGuess,
      submitGuess,
      goToNextRound,
      resetGame
    }),
    [round, totalScore, timer, status, currentQuestion, currentGuess, roundResults, isGuestAuthenticated]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
