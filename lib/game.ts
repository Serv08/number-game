export type GuessResult = {
  correctNumber: number;
  correctPosition: number;
};

export interface SecretValidationResult {
  isValid: boolean;
  message: string;
  length: number;
  hasDuplicateDigits: boolean;
}

export function validateSecret(
  secret: string,
  options: { length?: number; allowRepeatingDigits?: boolean } = {},
): SecretValidationResult {
  const length = options.length ?? 4;
  const allowRepeatingDigits = options.allowRepeatingDigits ?? false;

  if (secret.length !== length) {
    return {
      isValid: false,
      message: `Please enter ${length} digits.`,
      length,
      hasDuplicateDigits: false,
    };
  }

  const hasDuplicateDigits = new Set(secret).size !== secret.length;
  if (hasDuplicateDigits && !allowRepeatingDigits) {
    return {
      isValid: false,
      message: 'Digits must be unique.',
      length,
      hasDuplicateDigits: true,
    };
  }

  return {
    isValid: true,
    message: 'Looks good.',
    length,
    hasDuplicateDigits,
  };
}

export function evaluateGuess(secret: string, guess: string): GuessResult {
  const validation = validateSecret(secret, { length: secret.length, allowRepeatingDigits: true });
  if (!validation.isValid) {
    throw new Error(validation.message);
  }

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
