interface GameStatusBannerProps {
  label: string;
  tone: 'player' | 'waiting' | 'ai' | 'opponent';
}

export function GameStatusBanner({ label, tone }: GameStatusBannerProps) {
  const toneClasses = {
    player: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
    waiting: 'border-amber-400/30 bg-amber-500/15 text-amber-200',
    ai: 'border-violet-400/30 bg-violet-500/15 text-violet-200',
    opponent: 'border-sky-400/30 bg-sky-500/15 text-sky-200',
  };

  return (
    <div className={`rounded-[24px] border px-4 py-5 text-center shadow-lg shadow-black/20 ${toneClasses[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] opacity-80">Current turn</p>
      <p className="mt-2 text-2xl font-semibold tracking-[0.18em]">{label}</p>
    </div>
  );
}
