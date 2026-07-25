import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Multiplayer challenge</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">Number Duel</h1>
        <p className="mt-4 text-lg text-slate-300">
          Create a room or join an existing one to play a turn-based number guessing game.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create"
            className="flex-1 rounded-2xl bg-white px-5 py-3 text-center text-base font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Create Room
          </Link>
          <Link
            href="/join"
            className="flex-1 rounded-2xl border border-slate-700 px-5 py-3 text-center text-base font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Join Room
          </Link>
        </div>
      </div>
    </main>
  );
}
