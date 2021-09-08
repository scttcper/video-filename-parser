import test from 'ava';

import { removeFileExtension } from '../src/index.js';

const cases: Array<[string, string]> = [
  [
    'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS.mkv',
    'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
  ],
  ['melite-spr-720p-rpk.mkv', 'melite-spr-720p-rpk'],
];

for (const [title, result] of cases) {
  test(`remove extension of "${title}"`, t => {
    t.is(removeFileExtension(title), result);
  });
}
