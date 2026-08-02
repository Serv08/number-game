import { FeedbackIndicators } from './FeedbackIndicators';

interface GuessHistoryProps {
  guesses: Array<{
    guess: string;
    correctNumber: number;
    correctPosition: number;
  }>;
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-[0_18px_70px_rgba(2,6,23,0.35)] sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Track</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Guess history</h3>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          {guesses.length} turns
        </span>
      </div>

      {guesses.length === 0 ? (
        <div className="mt-4 rounded-[22px] border border-dashed border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-400">
          No guesses yet. Your first move will appear here.
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {guesses.map((entry, index) => (
            <li
              key={`${entry.guess}-${index}`}
              className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Turn {guesses.length - index}</p>
                  <p className="mt-1 font-mono text-lg font-semibold tracking-[0.25em] text-white">{entry.guess}</p>
                </div>
                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  {index === 0 ? 'Latest' : 'Past'}
                </div>
              </div>
              <FeedbackIndicators correctNumber={entry.correctNumber} correctPosition={entry.correctPosition} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
