import { evaluateGuess } from '../game';
import type { AIContext } from './types';

export function generateAllCandidates(secretLength: number): string[] {
  const candidates: string[] = [];

  const build = (prefix: string) => {
    if (prefix.length === secretLength) {
      candidates.push(prefix);
      return;
    }

    const startDigit = prefix.length === 0 ? 1 : 0;
    for (let digit = startDigit; digit <= 9; digit += 1) {
      const nextDigit = String(digit);
      if (prefix.includes(nextDigit)) {
        continue;
      }
      build(prefix + nextDigit);
    }
  };

  build('');
  return candidates;
}

export function generateDistinctCandidate(secretLength: number): string {
  const candidates = generateAllCandidates(secretLength);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? '';
}

export function getMatchingCandidates(context: AIContext, allCandidates: string[]): string[] {
  return allCandidates.filter((candidate) =>
    context.previousGuesses.every(({ guess, result }) => {
      const comparison = evaluateGuess(candidate, guess);
      return comparison.correctNumber === result.correctNumber && comparison.correctPosition === result.correctPosition;
    }),
  );
}
