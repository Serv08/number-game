import { EasyAI } from './easy';
import { HardAI } from './hard';
import { MediumAI } from './medium';
import type { AIEngine } from './types';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export function createAIEngine(difficulty: Difficulty): AIEngine {
  switch (difficulty) {
    case 'Easy':
      return new EasyAI();
    case 'Hard':
      return new HardAI();
    case 'Medium':
    default:
      return new MediumAI();
  }
}
