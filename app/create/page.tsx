import Link from 'next/link';
import { createDummyRoom } from './actions';

export default function CreatePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/30">
        <h1 className="text-3xl font-semibold">Create a room</h1>
        <p className="mt-3 text-slate-300">
          Start a new duel and share the room code with a friend.
        </p>
        <form action={createDummyRoom} className="mt-8 space-y-4">
          <input
            type="text"
            name="playerId"
            placeholder="Player name"
            defaultValue="Test Player"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0"
            required
          />
          <p className="text-sm text-slate-400">Using “Test Player” will open the demo room with code 00000.</p>
          <button
            type="submit"
            className="rounded-2xl bg-white px-5 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Create room
          </button>
        </form>
        <Link href="/" className="mt-6 inline-block text-sm text-slate-400 hover:text-white">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
