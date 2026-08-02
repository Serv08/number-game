import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const formData = await request.formData();
  const playerId = formData.get('playerId')?.toString().trim() ?? 'player1';
  const isTestPlayer = ['test player', 'test', 'demo', 'dummy'].includes(playerId.toLowerCase());
  const roomCode = isTestPlayer ? '00000' : nanoid(6).toUpperCase();

  const existingGame = await prisma.game.findUnique({
    where: { roomCode },
  });

  const game = existingGame
    ? await prisma.game.update({
        where: { id: existingGame.id },
        data: {
          roomCode,
          status: 'waiting',
          player1Id: playerId,
          player2Id: null,
          turn: 'player1',
          winner: null,
        },
      })
    : await prisma.game.create({
        data: {
          roomCode,
          status: 'waiting',
          player1Id: playerId,
          turn: 'player1',
        },
      });

  return NextResponse.redirect(new URL(`/room/${game.roomCode}`, request.url));
}
