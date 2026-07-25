import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const payload = await request.json();
  const { roomCode, playerId, secret } = payload;

  if (!roomCode || !playerId || !secret) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const game = await prisma.game.findUnique({ where: { roomCode } });

  if (!game) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  }

  if (game.player1Id === playerId) {
    await prisma.game.update({
      where: { id: game.id },
      data: { player1Secret: secret },
    });
  }

  if (game.player2Id === playerId) {
    await prisma.game.update({
      where: { id: game.id },
      data: { player2Secret: secret },
    });
  }

  return NextResponse.json({ ok: true });
}
