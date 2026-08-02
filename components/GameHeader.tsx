interface GameHeaderProps {
  mode: string;
  roomCode?: string;
  turnNumber: number;
  currentPlayer: string;
}

export function GameHeader({ mode, roomCode, turnNumber, currentPlayer }: GameHeaderProps) {
  return (
    <header className="rounded-[28px] border border-white/10 bg-slate-950/80 px-5 py-4 shadow-[0_20px_80px_rgba(2,6,23,0.45)] backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Number Duel</p>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{mode}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          {roomCode ? (
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 font-medium text-cyan-200">
              Room {roomCode}
            </span>
          ) : null}
          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 font-medium text-violet-200">
            Turn {turnNumber}
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-medium text-emerald-200">
            {currentPlayer}
          </span>
        </div>
      </div>
    </header>
  );
}
