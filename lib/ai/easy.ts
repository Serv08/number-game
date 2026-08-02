import { generateAllCandidates, generateDistinctCandidate } from './shared';
import type { AIContext, AIEngine } from './types';

export class EasyAI implements AIEngine {
  readonly name = 'Easy';

  chooseGuess(context: AIContext): string {
    const { secretLength, previousGuesses } = context;
    const usedGuesses = new Set(previousGuesses.map((entry) => entry.guess));
    const allCandidates = generateAllCandidates(secretLength);
    const availableCandidates = allCandidates.filter((candidate) => !usedGuesses.has(candidate));

    if (availableCandidates.length > 0) {
      return availableCandidates[Math.floor(Math.random() * availableCandidates.length)] ?? generateDistinctCandidate(secretLength);
    }

    return generateDistinctCandidate(secretLength);
  }
}
