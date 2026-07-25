import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { evaluateGuess } from '@/lib/game';

export async function POST(request: Request) {
  const payload = await request.json();
  const { roomCode, playerId, guess } = payload;

  if (!roomCode || !playerId || !guess) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const game = await prisma.game.findUnique({ where: { roomCode } });

  if (!game) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  }

  const secret = game.player1Id === playerId ? game.player2Secret : game.player1Secret;
  const result = evaluateGuess(secret ?? '', guess);

  await prisma.guess.create({
    data: {
      gameId: game.id,
      playerId,
      guess,
      correctNumber: result.correctNumber,
      correctPosition: result.correctPosition,
    },
  });

  const nextTurn = game.turn === 'player1' ? 'player2' : 'player1';
  const nextStatus = result.correctPosition === 4 ? 'finished' : 'in-progress';

  await prisma.game.update({
    where: { id: game.id },
    data: {
      turn: nextTurn,
      status: nextStatus,
      winner: result.correctPosition === 4 ? playerId : null,
    },
  });

  return NextResponse.json({
    ok: true,
    correctNumber: result.correctNumber,
    correctPosition: result.correctPosition,
    turn: nextTurn,
    status: nextStatus,
  });
}
