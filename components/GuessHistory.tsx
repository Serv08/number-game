interface GuessHistoryProps {
  guesses: Array<{
    guess: string;
    correctNumber: number;
    correctPosition: number;
  }>;
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Guess history
      </h3>
      {guesses.length === 0 ? (
        <p className="text-sm text-slate-500">No guesses yet.</p>
      ) : (
        <ul className="space-y-2">
          {guesses.map((entry, index) => (
            <li
              key={`${entry.guess}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <span className="font-semibold text-slate-700">{entry.guess}</span>
              <span className="text-slate-500">
                {entry.correctNumber} correct numbers · {entry.correctPosition} correct positions
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
