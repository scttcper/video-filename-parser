import { parseResolution, Resolution } from '../src/resolution';

describe('resolution', () => {
  it('should parse resolution', () => {
    expect(parseResolution('Oceans.Thirteen.2007.iNTERNAL.720p.BluRay.x264-MHQ')).toBe(Resolution.R720P);
    expect(parseResolution('Rocketman 2019 2160p UHD BluRay x265-TERMiNAL')).toBe(Resolution.R2160P);
    expect(parseResolution('Alita Battle Angel 2019 1080p BluRay x264-SPARKS')).toBe(Resolution.R1080P);
    expect(parseResolution('Alita Battle Angel 2019 HDRip AC3 x264-CMRG')).toBe(null);
    expect(parseResolution('Alita Battle Angel 2019 2160p WEB-DL DD+5 1 HEVC-DEFLATE[NO RAR]')).toBe(Resolution.R2160P);
    expect(parseResolution('Alita: Battle Angel 2019 BRRip AC3 x264-CMRG')).toBe(null);
  });
});
