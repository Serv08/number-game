export type GuessResult = {
  correctNumber: number;
  correctPosition: number;
};

export function evaluateGuess(secret: string, guess: string): GuessResult {
  if (secret.length !== guess.length) {
    throw new Error('Secret and guess must have the same length.');
  }

  const secretCounts = new Map<string, number>();
  const guessCounts = new Map<string, number>();

  for (const char of secret) {
    secretCounts.set(char, (secretCounts.get(char) ?? 0) + 1);
  }

  for (const char of guess) {
    guessCounts.set(char, (guessCounts.get(char) ?? 0) + 1);
  }

  let correctNumber = 0;
  for (const [char, count] of secretCounts.entries()) {
    const guessCount = guessCounts.get(char) ?? 0;
    correctNumber += Math.min(count, guessCount);
  }

  let correctPosition = 0;
  for (let index = 0; index < secret.length; index += 1) {
    if (secret[index] === guess[index]) {
      correctPosition += 1;
    }
  }

  return {
    correctNumber,
    correctPosition,
  };
}
