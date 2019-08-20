import { parseSource, Source } from '../src';

describe('source', () => {
  const cases: Array<[string, Source | null]> = [
    ['Oceans.Thirteen.2007.iNTERNAL.720p.BluRay.x264-MHQ', Source.BLURAY],
    ['Rocketman 2019 2160p UHD BluRay x265-TERMiNAL', Source.BLURAY],
    ['Alita Battle Angel 2019 2160p WEB-DL DD+5 1 HEVC-DEFLATE[NO RAR]', Source.WEBDL],
    ['Alita: Battle Angel 2019 BRRip AC3 x264-CMRG', Source.BLURAY],
  ];
  test.each(cases)('should parse source "%s"', (title, expected) => {
    expect(parseSource(title)).toBe(expected);
  });
});
