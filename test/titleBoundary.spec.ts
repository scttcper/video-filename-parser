import { expect, it } from 'vitest';

import { parseResolution, parseTitleAndYear, Resolution } from '../src/index.js';

// A title without a year ends at the first resolution token, while the resolution itself is picked
// by priority so an explicit 1080p beats a bare 4K or FHD
const cases: Array<[string, string, Resolution]> = [
  ['Movie Name 4K 2160p BluRay', 'Movie Name', Resolution.R2160P],
  ['Movie Name FHD 1080p WEB-DL', 'Movie Name', Resolution.R1080P],
  ['Movie Name 720p 4K', 'Movie Name', Resolution.R720P],
  [
    'Series.Title.S04E11.Teddys.Choice.FHD.1080p.Web-DL',
    'Series Title S04E11 Teddys Choice',
    Resolution.R1080P,
  ],
];

for (const [title, expectedTitle, resolution] of cases) {
  it(`ends the title at the first resolution token in "${title}"`, () => {
    expect(parseTitleAndYear(title).title).toBe(expectedTitle);
    expect(parseResolution(title).resolution).toBe(resolution);
  });
}
