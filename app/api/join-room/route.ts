import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const formData = await request.formData();
  const roomCode = formData.get('roomCode')?.toString()?.trim();
  const playerId = formData.get('playerId')?.toString().trim() ?? 'player2';

  if (!roomCode) {
    return NextResponse.json({ error: 'Room code is required.' }, { status: 400 });
  }

  const isTestRoom = roomCode.toUpperCase() === '00000';

  let existingGame = await prisma.game.findUnique({
    where: { roomCode: isTestRoom ? '00000' : roomCode },
  });

  if (!existingGame && isTestRoom) {
    existingGame = await prisma.game.create({
      data: {
        roomCode: '00000',
        status: 'waiting',
        player1Id: 'Test Player',
        turn: 'player1',
      },
    });
  }

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
