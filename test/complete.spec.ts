import test from 'ava';

import { isComplete } from '../src/complete.js';

const cases: Array<[string, boolean]> = [
  ['Cars.2.DVDR-TGP', true],
  ['Cars.2.2011.EN.SE.FI.PAL.DVDR-AMIRITE', true],
  ['The.Outsiders.1983.DUAL.COMPLETE.BLURAY-THEORY', true],
];

for (const [title, result] of cases) {
  test(`get isComplete from "${title}"`, t => {
    t.is(isComplete(title), result);
  });
}
