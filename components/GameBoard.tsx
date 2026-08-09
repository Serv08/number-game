'use client';

import { useEffect, useMemo, useState } from 'react';
import { GameHeader } from './GameHeader';
import { GameStatusBanner } from './GameStatusBanner';
import { SecretStatusCard } from './SecretStatusCard';
import { NumberInput } from './NumberInput';
import { GuessHistory } from './GuessHistory';
import { NumericKeypad } from './NumericKeypad';

interface GameBoardProps {
  roomCode: string;
  playerId: string;
}

interface GuessEntry {
  guess: string;
  correctNumber: number;
  correctPosition: number;
  playerId?: string;
}

export function GameBoard({ roomCode, playerId }: GameBoardProps) {
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [status, setStatus] = useState('in-progress');
  const [turn, setTurn] = useState('player1');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('Enter your 4-digit guess to begin the duel.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshGameState = async () => {
    try {
      const response = await fetch(`/api/game-state?roomCode=${encodeURIComponent(roomCode)}`);
      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      if (payload.guesses) {
        setGuesses(payload.guesses);
      }
      if (payload.game) {
        setStatus(payload.game.status ?? 'in-progress');
        setTurn(payload.game.turn ?? 'player1');
        if (payload.game.winner) {
          setMessage(payload.game.winner === playerId ? 'You solved the secret and won the round.' : 'Your opponent solved the secret first.');
        }
      }
    } catch {
      // Keep the local board responsive even if a refresh call fails.
    }
  };

  useEffect(() => {
    void refreshGameState();
    const interval = window.setInterval(() => {
      void refreshGameState();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [roomCode, playerId]);

  const handleSubmit = async () => {
    if (guess.length !== 4) {
      setError('Please enter exactly 4 digits.');
      setMessage('Use the keypad to enter a full 4-digit guess.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const response = await fetch('/api/make-guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, playerId, guess }),
    });

    if (response.ok) {
      const data = await response.json();
      setGuesses((current) => [{ guess, correctNumber: data.correctNumber, correctPosition: data.correctPosition, playerId }, ...current]);
      setTurn(data.turn ?? turn);
      setStatus(data.status ?? status);
      setGuess('');
      setMessage(data.message ?? 'Guess submitted.');
    } else {
      const payload = await response.json().catch(() => ({ error: 'Something went wrong.' }));
      setError(payload.error ?? 'Something went wrong.');
      setMessage(payload.error ?? 'Something went wrong.');
    }

    setIsSubmitting(false);
  };

  const bannerTone = useMemo(() => {
    if (status === 'finished') {
      return 'waiting' as const;
    }
    if (turn === 'player1') {
      return 'player' as const;
    }
    return 'opponent' as const;
  }, [status, turn]);

  const bannerLabel = status === 'finished' ? 'GAME OVER' : turn === 'player1' ? 'YOUR TURN' : 'OPPONENT TURN';

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 px-2 py-3 text-white sm:px-4 sm:py-6 lg:px-6">
      <GameHeader mode="Multiplayer" roomCode={roomCode} turnNumber={guesses.length + 1} currentPlayer={status === 'finished' ? 'Round complete' : turn === 'player1' ? 'You' : 'Opponent'} />

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <GameStatusBanner label={bannerLabel} tone={bannerTone} />

          <p className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            {message}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <SecretStatusCard title="You" locked={false} value="••••" />
            <SecretStatusCard title="Opponent" locked={true} value="••••" />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-[0_18px_70px_rgba(2,6,23,0.35)] sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Guess entry</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Make your move</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                {guess.length}/4
              </span>
            </div>

            <div className="mt-4">
              <NumberInput value={guess} onChange={setGuess} placeholder="Enter 4 digits" maxDigits={4} />
            </div>

            <div className="mt-4">
              <NumericKeypad
                value={guess}
                maxDigits={4}
                onDigit={(digit) => setGuess((current) => (current.length < 4 ? `${current}${digit}` : current))}
                onDelete={() => setGuess((current) => current.slice(0, -1))}
                onClear={() => setGuess('')}
                onComplete={() => handleSubmit()}
              />
            </div>

            {error ? <p className="mt-3 text-sm font-medium text-rose-300">{error}</p> : null}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={guess.length !== 4 || isSubmitting}
              className="mt-5 w-full rounded-[22px] bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Guess'}
            </button>
          </div>
        </div>

        <GuessHistory guesses={guesses} />
      </div>
    </div>
  );
}
