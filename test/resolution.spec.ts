import { parseResolution, Resolution } from '../src';

describe('parseResolution', () => {
  const cases: Array<[string, Resolution | null]> = [
    ['Oceans.Thirteen.2007.iNTERNAL.720p.BluRay.x264-MHQ', Resolution.R720P],
    ['Rocketman 2019 2160p UHD BluRay x265-TERMiNAL', Resolution.R2160P],
    ['Alita Battle Angel 2019 1080p BluRay x264-SPARKS', Resolution.R1080P],
    ['Alita Battle Angel 2019 HDRip AC3 x264-CMRG', null],
    ['Alita Battle Angel 2019 2160p WEB-DL DD+5 1 HEVC-DEFLATE[NO RAR]', Resolution.R2160P],
    ['Alita: Battle Angel 2019 BRRip AC3 x264-CMRG', null],
  ];
  test.each(cases)('should parse %s', (title, expected) => {
    expect(parseResolution(title)).toBe(expected);
  });
});
