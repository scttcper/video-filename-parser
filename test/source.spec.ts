import { parseSource, Source } from '../src/source';

describe('source', () => {
  it('should parse source', () => {
    expect(parseSource('Oceans.Thirteen.2007.iNTERNAL.720p.BluRay.x264-MHQ')).toBe(Source.BLURAY);
    expect(parseSource('Rocketman 2019 2160p UHD BluRay x265-TERMiNAL')).toBe(Source.BLURAY);
    expect(parseSource('Alita Battle Angel 2019 2160p WEB-DL DD+5 1 HEVC-DEFLATE[NO RAR]')).toBe(Source.WEBDL);
    expect(parseSource('Alita: Battle Angel 2019 BRRip AC3 x264-CMRG')).toBe(Source.BLURAY);
  });
});
