'use client';

interface WinModalProps {
  winner: 'player' | 'ai';
  playerSecret: string;
  aiSecret: string;
  turns: number;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export function WinModal({ winner, playerSecret, aiSecret, turns, onPlayAgain, onReturnHome }: WinModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900 p-6 text-white shadow-2xl shadow-slate-950/40">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-2xl">
            {winner === 'player' ? '🎉' : '🤖'}
          </div>
          <h2 className="mt-4 text-3xl font-semibold">{winner === 'player' ? 'YOU WIN' : 'AI WINS'}</h2>
          <p className="mt-2 text-sm text-slate-400">The duel is over after {turns} turns.</p>
        </div>

        <div className="mt-6 space-y-3 rounded-[24px] border border-slate-800 bg-slate-950/70 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Your secret</span>
            <span className="font-mono tracking-[0.25em]">{playerSecret}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">AI secret</span>
            <span className="font-mono tracking-[0.25em]">{aiSecret}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Turns</span>
            <span className="font-semibold">{turns}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onPlayAgain} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Play again
          </button>
          <button type="button" onClick={onReturnHome} className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
            Return home
          </button>
        </div>
      </div>
    </div>
  );
}
