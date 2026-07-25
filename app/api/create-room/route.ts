import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const formData = await request.formData();
  const playerId = formData.get('playerId')?.toString() ?? 'player1';

  const roomCode = nanoid(6).toUpperCase();

  const game = await prisma.game.create({
    data: {
      roomCode,
      status: 'waiting',
      player1Id: playerId,
      turn: 'player1',
    },
  });

  return NextResponse.redirect(new URL(`/room/${game.roomCode}`, request.url));
}
