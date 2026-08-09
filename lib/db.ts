import { PrismaClient } from '@prisma/client';

type GameRecord = {
  id: string;
  roomCode: string;
  status: string;
  player1Id?: string | null;
  player2Id?: string | null;
  player1Secret?: string | null;
  player2Secret?: string | null;
  turn?: string | null;
  winner?: string | null;
  createdAt: Date;
};

type GuessRecord = {
  id: string;
  gameId: string;
  playerId: string;
  guess: string;
  correctNumber: number;
  correctPosition: number;
  createdAt: Date;
};

type PrismaLikeClient = {
  game: {
    findUnique: (args: { where: Record<string, unknown> }) => Promise<GameRecord | null>;
    create: (args: { data: Partial<GameRecord> }) => Promise<GameRecord>;
    update: (args: { where: Record<string, unknown>; data: Partial<GameRecord> }) => Promise<GameRecord>;
  };
  guess: {
    create: (args: { data: Partial<GuessRecord> }) => Promise<GuessRecord>;
    findMany: (args: { where?: Record<string, unknown>; orderBy?: Record<string, string> }) => Promise<GuessRecord[]>;
  };
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | PrismaLikeClient | undefined;
};

function createFallbackPrismaClient(): PrismaLikeClient {
  const games = new Map<string, GameRecord>();
  const guesses: GuessRecord[] = [];

  const makeId = () => `fallback-${Math.random().toString(36).slice(2, 10)}`;

  return {
    game: {
      async findUnique({ where }) {
        if (where?.roomCode) {
          return games.get(where.roomCode as string) ?? null;
        }

        if (where?.id) {
          return games.get(where.id as string) ?? null;
        }

        return null;
      },
      async create({ data }) {
        const game = {
          id: (data.id as string) ?? makeId(),
          roomCode: data.roomCode as string,
          status: (data.status as string) ?? 'waiting',
          player1Id: data.player1Id as string | null | undefined,
          player2Id: data.player2Id as string | null | undefined,
          player1Secret: data.player1Secret as string | null | undefined,
          player2Secret: data.player2Secret as string | null | undefined,
          turn: data.turn as string | null | undefined,
          winner: data.winner as string | null | undefined,
          createdAt: new Date(),
        } satisfies GameRecord;

        games.set(game.id, game);
        games.set(game.roomCode, game);
        return game;
      },
      async update({ where, data }) {
        const existing = where?.id
          ? games.get(where.id as string)
          : where?.roomCode
            ? games.get(where.roomCode as string)
            : undefined;

        if (!existing) {
          throw new Error('Game not found in fallback store.');
        }

        const updated = {
          ...existing,
          ...data,
          id: existing.id,
          roomCode: existing.roomCode,
          createdAt: existing.createdAt,
        } satisfies GameRecord;

        games.set(updated.id, updated);
        games.set(updated.roomCode, updated);
        return updated;
      },
    },
    guess: {
      async create({ data }) {
        const guess = {
          id: (data.id as string) ?? makeId(),
          gameId: data.gameId as string,
          playerId: data.playerId as string,
          guess: data.guess as string,
          correctNumber: data.correctNumber as number,
          correctPosition: data.correctPosition as number,
          createdAt: new Date(),
        } satisfies GuessRecord;

        guesses.push(guess);
        return guess;
      },
      async findMany({ where, orderBy }) {
        const filtered = guesses.filter((entry) => {
          if (where?.gameId && entry.gameId !== (where.gameId as string)) {
            return false;
          }
          return true;
        });

        if (orderBy?.createdAt === 'desc') {
          filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else {
          filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        }

        return filtered;
      },
    },
  };
}

function createPrismaClient(): PrismaClient | PrismaLikeClient {
  if (!process.env.DATABASE_URL?.trim()) {
    return createFallbackPrismaClient();
  }

  try {
    return new PrismaClient();
  } catch {
    return createFallbackPrismaClient();
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
