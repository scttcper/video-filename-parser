import { describe, expect, test } from '@jest/globals';

import { removeFileExtension } from '../src';

describe('removeFileExtension', () => {
  const cases: Array<[string, string]> = [
    [
      'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS.mkv',
      'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
    ],
    ['melite-spr-720p-rpk.mkv', 'melite-spr-720p-rpk'],
  ];
  test.each(cases)('should remove extension of "%s"', (title, expected) => {
    expect(removeFileExtension(title)).toBe(expected);
  });
});
