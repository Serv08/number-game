'use client';

import { useState } from 'react';
import { NumberInput } from './NumberInput';
import { GuessHistory } from './GuessHistory';
import { TurnIndicator } from './TurnIndicator';

interface GameBoardProps {
  roomCode: string;
  playerId: string;
}

export function GameBoard({ roomCode, playerId }: GameBoardProps) {
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<Array<{ guess: string; correctNumber: number; correctPosition: number }>>([]);
  const [status, setStatus] = useState('in-progress');
  const [turn, setTurn] = useState('player1');

  const handleSubmit = async () => {
    if (guess.length !== 4) {
      return;
    }

    const response = await fetch('/api/make-guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, playerId, guess }),
    });

    if (response.ok) {
      const data = await response.json();
      setGuesses((current) => [...current, { guess, correctNumber: data.correctNumber, correctPosition: data.correctPosition }]);
      setTurn(data.turn ?? turn);
      setStatus(data.status ?? status);
      setGuess('');
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Room</p>
          <h1 className="text-3xl font-semibold text-slate-900">{roomCode}</h1>
        </div>
        <TurnIndicator turn={turn} status={status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xl font-semibold text-slate-900">Make a guess</h2>
          <NumberInput value={guess} onChange={setGuess} />
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Submit Guess
          </button>
        </div>

        <GuessHistory guesses={guesses} />
      </div>
    </div>
  );
}
