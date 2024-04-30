import { expect, it } from 'vitest';

import { removeFileExtension } from '../src/index.js';

const cases: [string, string][] = [
  [
    'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS.mkv',
    'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
  ],
  ['melite-spr-720p-rpk.mkv', 'melite-spr-720p-rpk'],
];

for (const [title, result] of cases) {
  it(`remove extension of "${title}"`, () => {
    expect(removeFileExtension(title)).toBe(result);
  });
}
