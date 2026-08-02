'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { createAIEngine } from '@/lib/ai';
import { evaluateGuess } from '@/lib/game';
import { NumberInput } from './NumberInput';
import { WinModal } from './WinModal';

const SECRET_LENGTH = 5;
const AI_DELAY_MS = 1300;

type Turn = 'player' | 'ai';
type Winner = 'player' | 'ai' | null;

interface HistoryEntry {
  id: number;
  turn: Turn;
  guess: string;
  result: {
    correctNumber: number;
    correctPosition: number;
  };
}

function generateSecret(length = SECRET_LENGTH): string {
  const digits = Array.from({ length: 10 }, (_, index) => String(index));
  const available = [...digits];
  let secret = '';

  for (let index = 0; index < length; index += 1) {
    const pool = index === 0 ? available.filter((digit) => digit !== '0') : available;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const digit = pool[randomIndex];
    secret += digit;
    available.splice(available.indexOf(digit), 1);
  }

  return secret;
}

export function AIOpponentGame() {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [playerSecret, setPlayerSecret] = useState('12345');
  const [aiSecret, setAiSecret] = useState('');
  const [playerGuess, setPlayerGuess] = useState('');
  const [turn, setTurn] = useState<Turn>('player');
  const [winner, setWinner] = useState<Winner>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState('Enter your secret number to begin the duel.');
  const [revealAiSecret, setRevealAiSecret] = useState(false);
  const [revealPlayerSecret, setRevealPlayerSecret] = useState(false);
  const [skipAiDelay, setSkipAiDelay] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);

  const isDevelopment = process.env.NODE_ENV === 'development';

  const startGame = (secret: string) => {
    if (secret.length !== SECRET_LENGTH || new Set(secret).size !== SECRET_LENGTH) {
      setMessage('Please enter five unique digits to begin the duel.');
      return;
    }

    const generatedSecret = generateSecret();
    setPlayerSecret(secret);
    setAiSecret(generatedSecret);
    setPhase('playing');
    setTurn('player');
    setWinner(null);
    setHistory([]);
    setPlayerGuess('');
    setIsThinking(false);
    setMessage('You start. Try to crack the AI secret.');
  };

  const submitPlayerGuess = (guessValue = playerGuess) => {
    if (phase !== 'playing' || turn !== 'player') {
      return;
    }

    if (guessValue.length !== SECRET_LENGTH || new Set(guessValue).size !== SECRET_LENGTH) {
      setMessage('Please enter five unique digits.');
      return;
    }

    const result = evaluateGuess(aiSecret, guessValue);
    const nextEntry: HistoryEntry = {
      id: Date.now(),
      turn: 'player',
      guess: guessValue,
      result,
    };

    if (guessValue === aiSecret) {
      setWinner('player');
      setPhase('finished');
      setTurn('player');
      setHistory((current) => [...current, nextEntry]);
      setMessage('You cracked the AI secret. You win!');
      return;
    }

    setHistory((current) => [...current, nextEntry]);
    setTurn('ai');
    setMessage('The AI is considering a response...');
    setPlayerGuess('');
    setIsThinking(true);

    const aiEngine = createAIEngine('Hard');
    const previousAiGuesses = history.filter((entry) => entry.turn === 'ai').map((entry) => ({
      guess: entry.guess,
      result: entry.result,
    }));

    window.setTimeout(() => {
      const aiGuess = aiEngine.chooseGuess({
        previousGuesses: previousAiGuesses,
        secretLength: SECRET_LENGTH,
      });
      const aiResult = evaluateGuess(playerSecret, aiGuess);
      const aiEntry: HistoryEntry = {
        id: Date.now() + 1,
        turn: 'ai',
        guess: aiGuess,
        result: aiResult,
      };

      if (aiGuess === playerSecret) {
        setWinner('ai');
        setPhase('finished');
        setTurn('ai');
        setHistory((current) => [...current, aiEntry]);
        setMessage('The AI cracked your secret. You lose.');
      } else {
        setHistory((current) => [...current, aiEntry]);
        setTurn('player');
        setMessage(`The AI guessed ${aiGuess}. Your turn again.`);
      }
      setIsThinking(false);
    }, skipAiDelay ? 0 : AI_DELAY_MS);
  };

  const resetGame = () => {
    setPhase('setup');
    setPlayerSecret('12345');
    setAiSecret('');
    setPlayerGuess('');
    setTurn('player');
    setWinner(null);
    setHistory([]);
    setIsThinking(false);
    setMessage('Enter your secret number to begin the duel.');
    setRevealAiSecret(false);
    setRevealPlayerSecret(false);
    setShowDevTools(false);
  };

  const applyDevAction = (action: 'ai-win' | 'player-win' | 'reveal-ai' | 'reveal-player') => {
    if (!isDevelopment) {
      return;
    }

    switch (action) {
      case 'ai-win':
        setWinner('ai');
        setPhase('finished');
        setTurn('ai');
        setMessage('Developer override: AI win forced.');
        break;
      case 'player-win':
        setWinner('player');
        setPhase('finished');
        setTurn('player');
        setMessage('Developer override: player win forced.');
        break;
      case 'reveal-ai':
        setRevealAiSecret((current) => !current);
        break;
      case 'reveal-player':
        setRevealPlayerSecret((current) => !current);
        break;
      default:
        break;
    }
  };

  const statusBadge = useMemo(() => {
    if (winner === 'player') {
      return 'You win';
    }
    if (winner === 'ai') {
      return 'AI wins';
    }
    if (turn === 'player') {
      return 'Your turn';
    }
    return 'AI turn';
  }, [turn, winner]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      {winner ? (
        <WinModal
          winner={winner}
          playerSecret={playerSecret}
          aiSecret={aiSecret}
          turns={history.length}
          onPlayAgain={resetGame}
          onReturnHome={() => window.location.assign('/')}
        />
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Play vs AI</p>
          <h1 className="text-3xl font-semibold text-slate-900">Solo duel</h1>
        </div>
        <div className="flex items-center gap-2">
          {isDevelopment ? (
            <button
              type="button"
              onClick={() => setShowDevTools((current) => !current)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              ⚙ Dev tools
            </button>
          ) : null}
          <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            ← Back home
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Game setup</p>
              <h2 className="mt-2 text-2xl font-semibold">Enter your secret</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${turn === 'ai' && !winner ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {statusBadge}
            </span>
          </div>

          {phase === 'setup' ? (
            <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-300">Use the preset demo secret or enter your own. The AI will generate its own five-digit secret and the duel will begin.</p>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
                <span>Demo secret</span>
                <span className="font-mono font-semibold tracking-[0.25em] text-white">12345</span>
              </div>
              <NumberInput
                value={playerSecret}
                onChange={setPlayerSecret}
                placeholder="Enter your 5-digit secret"
                maxDigits={SECRET_LENGTH}
                onComplete={(value) => startGame(value)}
                allowRepeatingDigits={false}
              />
              <button
                type="button"
                onClick={() => startGame(playerSecret)}
                disabled={playerSecret.length !== SECRET_LENGTH}
                className="w-full rounded-2xl bg-white px-5 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Start demo duel
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Your secret</p>
                  <p className="mt-1 font-mono text-lg tracking-[0.3em] text-white">{revealPlayerSecret ? playerSecret : '• • • • •'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">AI secret</p>
                  <p className="mt-1 font-mono text-lg tracking-[0.3em] text-white">{revealAiSecret ? aiSecret : '• • • • •'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all duration-300">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Current turn</p>
                <p className="mt-2 text-xl font-semibold text-white">{turn === 'player' ? 'Your guess' : 'AI guess'}</p>
                <p className="mt-3 text-sm text-slate-300">{message}</p>
                {isThinking ? (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-500/10 px-3 py-2 text-amber-300 transition-all duration-300">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-300" />
                    <span className="font-medium">AI is thinking...</span>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Enter your guess</p>
                <NumberInput
                  value={playerGuess}
                  onChange={setPlayerGuess}
                  placeholder="Enter your 5-digit guess"
                  maxDigits={SECRET_LENGTH}
                  onComplete={(value) => submitPlayerGuess(value)}
                  allowRepeatingDigits={false}
                />
                <button
                  type="button"
                  onClick={() => submitPlayerGuess(playerGuess)}
                  disabled={turn !== 'player' || playerGuess.length !== SECRET_LENGTH || phase !== 'playing'}
                  className="mt-4 w-full rounded-2xl bg-white px-5 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Submit guess
                </button>
              </div>
            </div>
          )}

          {isDevelopment ? (
            <div className={`mt-6 overflow-hidden rounded-[24px] border border-slate-800 bg-slate-900/70 transition-all duration-300 ${showDevTools ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Developer tools</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={() => applyDevAction('ai-win')} className="rounded-2xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                    Force AI win
                  </button>
                  <button type="button" onClick={() => applyDevAction('player-win')} className="rounded-2xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                    Force player win
                  </button>
                  <button type="button" onClick={() => applyDevAction('reveal-ai')} className="rounded-2xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                    {revealAiSecret ? 'Hide AI secret' : 'Reveal AI secret'}
                  </button>
                  <button type="button" onClick={() => applyDevAction('reveal-player')} className="rounded-2xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                    {revealPlayerSecret ? 'Hide player secret' : 'Reveal player secret'}
                  </button>
                </div>
                <label className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                  <input type="checkbox" checked={skipAiDelay} onChange={() => setSkipAiDelay((current) => !current)} className="h-4 w-4 rounded border-slate-700 bg-slate-950" />
                  Skip AI delay
                </label>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Turn history</p>
              <h2 className="text-2xl font-semibold text-slate-900">Results</h2>
            </div>
            <button type="button" onClick={resetGame} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Reset
            </button>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              No guesses yet. The first attempt will start the turn history.
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{entry.turn === 'player' ? 'You' : 'AI'}</p>
                    <p className="font-mono text-sm text-slate-700">{entry.guess}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {entry.result.correctNumber} correct numbers • {entry.result.correctPosition} correct positions
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
