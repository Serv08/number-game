'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function createDummyRoom(formData: FormData) {
  const playerId = formData.get('playerId')?.toString().trim() || 'Test Player';

  const roomCode = '00000';
  const existingGame = await prisma.game.findUnique({
    where: { roomCode },
  });

  if (existingGame) {
    await prisma.game.update({
      where: { id: existingGame.id },
      data: {
        status: 'waiting',
        player1Id: playerId,
        player2Id: null,
        turn: 'player1',
        winner: null,
      },
    });
  } else {
    await prisma.game.create({
      data: {
        roomCode,
        status: 'waiting',
        player1Id: playerId,
        turn: 'player1',
      },
    });
  }

  redirect(`/room/${roomCode}`);
}
