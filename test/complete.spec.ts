import { describe, expect, test } from '@jest/globals';

import { isComplete } from '../src/complete';

describe('isComplete', () => {
  const cases: Array<[string, boolean]> = [
    ['Cars.2.DVDR-TGP', true],
    ['Cars.2.2011.EN.SE.FI.PAL.DVDR-AMIRITE', true],
    ['The.Outsiders.1983.DUAL.COMPLETE.BLURAY-THEORY', true],
  ];

  test.each(cases)('should get edition of "%s"', (title, expected) => {
    expect(Boolean(isComplete(title))).toBe(expected);
  });
});
