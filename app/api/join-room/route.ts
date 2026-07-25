import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const formData = await request.formData();
  const roomCode = formData.get('roomCode')?.toString();
  const playerId = formData.get('playerId')?.toString() ?? 'player2';

  if (!roomCode) {
    return NextResponse.json({ error: 'Room code is required.' }, { status: 400 });
  }

  const existingGame = await prisma.game.findUnique({
    where: { roomCode },
  });

  if (!existingGame) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  }

  if (existingGame.player2Id) {
    return NextResponse.json({ error: 'Room is already full.' }, { status: 409 });
  }

  const game = await prisma.game.update({
    where: { id: existingGame.id },
    data: {
      player2Id: playerId,
      status: 'in-progress',
    },
  });

  return NextResponse.redirect(new URL(`/room/${game.roomCode}`, request.url));
}
