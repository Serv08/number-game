import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateGuess, validateSecret } from '../lib/game';

test('evaluateGuess counts matching digits and positions correctly', () => {
  const result = evaluateGuess('4821', '4182');

  assert.deepEqual(result, {
    correctNumber: 4,
    correctPosition: 1,
  });
});

test('validateSecret rejects invalid lengths and duplicate digits', () => {
  assert.equal(validateSecret('123').isValid, false);
  assert.equal(validateSecret('1123').isValid, false);
  assert.equal(validateSecret('1234').isValid, true);
  assert.equal(validateSecret('1234', { allowRepeatingDigits: true }).isValid, true);
});
