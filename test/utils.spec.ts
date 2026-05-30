import { expect, it } from 'vitest';

import { removeEmpty } from '../src/utils.js';

it('removes null and undefined properties', () => {
  expect(
    removeEmpty({
      present: 'value',
      missing: undefined,
      empty: null,
      falseValue: false,
      zero: 0,
      emptyObject: {},
    }),
  ).toStrictEqual({
    present: 'value',
    falseValue: false,
    zero: 0,
    emptyObject: {},
  });
});
