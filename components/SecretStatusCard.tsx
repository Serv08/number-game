interface SecretStatusCardProps {
  title: string;
  locked: boolean;
  value?: string;
}

export function SecretStatusCard({ title, locked, value }: SecretStatusCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{title}</p>
      <div className="mt-3 flex min-h-[54px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-3">
        {locked ? (
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Secret locked</span>
        ) : (
          <span className="font-mono text-lg tracking-[0.3em] text-white">{value}</span>
        )}
      </div>
    </div>
  );
}
