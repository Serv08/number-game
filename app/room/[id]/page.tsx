import { notFound } from 'next/navigation';
import { GameBoard } from '@/components/GameBoard';
import { prisma } from '@/lib/db';

interface RoomPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ playerId?: string }>;
}

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { id } = await params;
  const { playerId: requestedPlayerId } = await searchParams;
  const game = await prisma.game.findUnique({
    where: { roomCode: id },
  });

  if (!game) {
    notFound();
  }

  const playerId = requestedPlayerId?.trim() || `player-${game.id.slice(0, 4)}`;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-900">
      <GameBoard roomCode={game.roomCode} playerId={playerId} />
    </main>
  );
}
