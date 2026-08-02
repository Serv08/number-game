import { generateAllCandidates, generateDistinctCandidate, getMatchingCandidates } from './shared';
import type { AIContext, AIEngine } from './types';

export class MediumAI implements AIEngine {
  readonly name = 'Medium';

  chooseGuess(context: AIContext): string {
    const allCandidates = generateAllCandidates(context.secretLength);
    const matchingCandidates = getMatchingCandidates(context, allCandidates);
    const availableCandidates = matchingCandidates.filter((candidate) => !context.previousGuesses.some((entry) => entry.guess === candidate));

    if (availableCandidates.length > 0) {
      return availableCandidates[0];
    }

    const fallbackCandidates = allCandidates.filter((candidate) => !context.previousGuesses.some((entry) => entry.guess === candidate));
    return fallbackCandidates[0] ?? generateDistinctCandidate(context.secretLength);
  }
}
