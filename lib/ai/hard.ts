import { generateAllCandidates, generateDistinctCandidate, getMatchingCandidates } from './shared';
import type { AIContext, AIEngine } from './types';

export class HardAI implements AIEngine {
  readonly name = 'Hard';

  chooseGuess(context: AIContext): string {
    const allCandidates = generateAllCandidates(context.secretLength);
    const matchingCandidates = getMatchingCandidates(context, allCandidates);
    const availableCandidates = matchingCandidates.filter((candidate) => !context.previousGuesses.some((entry) => entry.guess === candidate));

    if (availableCandidates.length === 0) {
      return generateDistinctCandidate(context.secretLength);
    }

    if (availableCandidates.length === 1) {
      return availableCandidates[0];
    }

    const sortedCandidates = [...availableCandidates].sort((left, right) => {
      const leftScore = this.scoreCandidate(left, context);
      const rightScore = this.scoreCandidate(right, context);
      return leftScore - rightScore;
    });

    return sortedCandidates[0];
  }

  private scoreCandidate(candidate: string, context: AIContext): number {
    let score = 0;
    for (const previous of context.previousGuesses) {
      const result = this.getGuessFeedback(candidate, previous.guess);
      score += Math.abs(previous.result.correctNumber - result.correctNumber) + Math.abs(previous.result.correctPosition - result.correctPosition);
    }
    return score;
  }

  private getGuessFeedback(candidate: string, guess: string): { correctNumber: number; correctPosition: number } {
    const secretCounts = new Map<string, number>();
    const guessCounts = new Map<string, number>();

    for (const char of candidate) {
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
    for (let index = 0; index < candidate.length; index += 1) {
      if (candidate[index] === guess[index]) {
        correctPosition += 1;
      }
    }

    return { correctNumber, correctPosition };
  }

}
