export type GameStatus = 'waiting' | 'in-progress' | 'finished';

export interface GameRecord {
  id: string;
  roomCode: string;
  status: GameStatus;
  player1Id?: string | null;
  player2Id?: string | null;
  player1Secret?: string | null;
  player2Secret?: string | null;
  turn?: string | null;
  winner?: string | null;
  createdAt: string;
}

export interface GuessRecord {
  id: string;
  gameId: string;
  playerId: string;
  guess: string;
  correctNumber: number;
  correctPosition: number;
  createdAt: string;
}
