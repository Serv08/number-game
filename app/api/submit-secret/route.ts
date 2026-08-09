import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSecret } from '@/lib/game';

export async function POST(request: Request) {
  const payload = await request.json();
  const { roomCode, playerId, secret } = payload;

  if (!roomCode || !playerId || !secret) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const validation = validateSecret(secret, { length: 4, allowRepeatingDigits: false });
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const game = await prisma.game.findUnique({ where: { roomCode } });

  if (!game) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  }

  if (game.status === 'finished') {
    return NextResponse.json({ error: 'This room has already ended.' }, { status: 409 });
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

  const updatedGame = await prisma.game.findUnique({ where: { id: game.id } });
  const nextStatus = updatedGame?.player1Secret && updatedGame?.player2Secret ? 'in-progress' : 'waiting';

  return NextResponse.json({ ok: true, status: nextStatus });
}
