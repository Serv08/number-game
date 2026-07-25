import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomCode = searchParams.get('roomCode');

  if (!roomCode) {
    return NextResponse.json({ error: 'Room code is required.' }, { status: 400 });
  }

  const game = await prisma.game.findUnique({ where: { roomCode } });

  if (!game) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
  }

  return NextResponse.json({ game });
}
