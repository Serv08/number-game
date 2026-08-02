import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Multiplayer challenge</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Number Duel</h1>
        <p className="mt-4 text-lg text-slate-300">
          Choose a room-based duel or jump into a polished solo match against an AI opponent.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/create"
            className="rounded-2xl bg-white px-5 py-3 text-center text-base font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Create Room
          </Link>
          <Link
            href="/join"
            className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-base font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Join Room
          </Link>
          <Link
            href="/play"
            className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-center text-base font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
          >
            Play vs AI
          </Link>
        </div>
      </div>
    </main>
  );
}
