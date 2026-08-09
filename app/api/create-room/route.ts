import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
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
  const playerId = String(payload.playerId ?? '').trim() || 'player1';
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

  const redirectUrl = new URL(`/room/${game.roomCode}`, request.url);
  redirectUrl.searchParams.set('playerId', playerId);

  return NextResponse.redirect(redirectUrl);
}
