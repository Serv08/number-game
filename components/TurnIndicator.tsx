interface TurnIndicatorProps {
  turn: string;
  status: string;
}

export function TurnIndicator({ turn, status }: TurnIndicatorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Current turn</p>
      <p className="mt-1 text-lg font-semibold text-slate-800">{turn}</p>
      <p className="mt-2 text-sm text-slate-600">Status: {status}</p>
    </div>
  );
}
