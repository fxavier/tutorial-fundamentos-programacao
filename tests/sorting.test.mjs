import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortFrames, SORTS, binarySearchSteps } from '../.tmp/sorting.mjs';

const base = [5, 3, 8, 1, 9, 2, 7, 4];
const expected = [...base].sort((a, b) => a - b);

for (const s of SORTS) {
  test(`${s.id} ordena corretamente`, () => {
    const frames = sortFrames(base, s.id);
    assert.deepEqual(frames.at(-1).array, expected);
    assert.ok(frames.length > 2);
  });
  test(`${s.id} lida com casos limite`, () => {
    assert.deepEqual(sortFrames([], s.id).at(-1).array, []);
    assert.deepEqual(sortFrames([1], s.id).at(-1).array, [1]);
    assert.deepEqual(sortFrames([2, 1], s.id).at(-1).array, [1, 2]);
    assert.deepEqual(sortFrames([3, 3, 3], s.id).at(-1).array, [3, 3, 3]);
    assert.deepEqual(sortFrames([1, 2, 3, 4], s.id).at(-1).array, [1, 2, 3, 4]);
    assert.deepEqual(sortFrames([4, 3, 2, 1], s.id).at(-1).array, [1, 2, 3, 4]);
  });
}

test('pesquisa binaria', () => {
  const v = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const s = binarySearchSteps(v, 23);
  assert.equal(s.at(-1).found, true);
  assert.ok(s.length <= 4);
  assert.equal(binarySearchSteps(v, 7).at(-1).found, false);
});
