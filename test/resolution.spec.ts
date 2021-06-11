import { describe, expect, test } from '@jest/globals';

import { parseResolution, Resolution } from '../src';

describe('parseResolution', () => {
  const cases: Array<[string, ReturnType<typeof parseResolution>['resolution']]> = [
    ['Oceans.Thirteen.2007.iNTERNAL.720p.BluRay.x264-MHQ', Resolution.R720P],
    ['Rocketman 2019 2160p UHD BluRay x265-TERMiNAL', Resolution.R2160P],
    ['Alita Battle Angel 2019 1080p BluRay x264-SPARKS', Resolution.R1080P],
    ['Alita Battle Angel 2019 HDRip AC3 x264-CMRG', undefined],
    ['Alita Battle Angel 2019 2160p WEB-DL DD+5 1 HEVC-DEFLATE[NO RAR]', Resolution.R2160P],
    ['Alita: Battle Angel 2019 BRRip AC3 x264-CMRG', undefined],
    ['Revolution.S01E02.Chained.Heat.[Bluray720p].mkv', Resolution.R720P],
    ['WEEDS.S03E01-06.DUAL.720p.Blu-ray.AC3.-HELLYWOOD.avi', Resolution.R720P],
    ['Revolution.S01E02.Chained.Heat.[Bluray1080p].mkv', Resolution.R1080P],
    ['27.Dresses.2008.REMUX.2160p.Bluray.AVC.DTS-HR.MA.5.1-LEGi0N', Resolution.R2160P],
    ['Deadpool 2016 2160p 4K UltraHD BluRay DTS-HD MA 7 1 x264-Whatevs', Resolution.R2160P],
    ['Deadpool 2016 4K 2160p UltraHD BluRay AAC2 0 HEVC x265', Resolution.R2160P],
    ['The Martian 2015 2160p Ultra HD BluRay DTS-HD MA 7 1 x264-Whatevs', Resolution.R2160P],
    ['The Revenant 2015 2160p UHD BluRay FLAC 7 1 x264-Whatevs', Resolution.R2160P],
    ['Into the Inferno 2016 2160p Netflix WEBRip DD5 1 x264-Whatevs', Resolution.R2160P],
    ['Indiana.Jones.and.the.Temple.of.Doom.1984.Complete.UHD.Bluray-JONES', Resolution.R2160P],
  ];
  test.each(cases)('should parse %s', (title, expected) => {
    expect(parseResolution(title).resolution).toBe(expected);
  });
});
