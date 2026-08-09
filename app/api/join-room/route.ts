import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

async function readPayload(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const payload = await request.json().catch(() => ({}));
    return payload as Record<string, unknown>;
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return {} as Record<string, unknown>;
  }

  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? value.name : value]),
  ) as Record<string, unknown>;
}

export async function POST(request: Request) {
  const payload = await readPayload(request);
  const roomCode = String(payload.roomCode ?? '').trim();
  const playerId = String(payload.playerId ?? '').trim() || 'player2';

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

  const redirectUrl = new URL(`/room/${game.roomCode}`, request.url);
  redirectUrl.searchParams.set('playerId', playerId);

  return NextResponse.redirect(redirectUrl);
}
