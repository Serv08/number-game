import type { GuessResult } from '../game';

export interface AIContext {
  previousGuesses: Array<{
    guess: string;
    result: GuessResult;
  }>;
  secretLength: number;
}

export interface AIEngine {
  readonly name: string;
  chooseGuess(context: AIContext): string;
}
