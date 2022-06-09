import { expect, it } from 'vitest';

import { AudioCodec } from '../src/audioCodec.js';
import { filenameParse, Language, Resolution, Source, VideoCodec } from '../src/index.js';

const movieCases: Array<[string, any]> = [
  [
    'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
    {
      resolution: Resolution.R720P,
      sources: [Source.BLURAY],
      title: 'Whats Eating Gilbert Grape',
      year: '1993',
      videoCodec: VideoCodec.X264,
      group: 'SiNNERS',
      revision: { version: 1, real: 0 },
      languages: [Language.English],
    },
  ],
  [
    'Timecop.1994.PROPER.1080p.BluRay.x264-Japhson',
    {
      resolution: Resolution.R1080P,
      sources: [Source.BLURAY],
      title: 'Timecop',
      year: '1994',
      videoCodec: VideoCodec.X264,
      group: 'Japhson',
      revision: { version: 2, real: 0 },
      languages: [Language.English],
    },
  ],
  [
    'This.is.40.2012.PROPER.UNRATED.720p.BluRay.MULti.x264-Felony',
    {
      edition: { unrated: true },
      resolution: Resolution.R720P,
      sources: [Source.BLURAY],
      title: 'This is 40',
      year: '2012',
      videoCodec: VideoCodec.X264,
      group: 'Felony',
      revision: { version: 2, real: 0 },
      languages: [Language.English],
      multi: true,
    },
  ],
  [
    'Spider-Man Far from Home.2019.1080p.HDRip.X264.AC3-EVO',
    {
      resolution: Resolution.R1080P,
      sources: [Source.WEBDL],
      title: 'Spider-Man Far from Home',
      year: '2019',
      videoCodec: VideoCodec.X264,
      audioCodec: AudioCodec.DOLBY,
      group: 'EVO',
      revision: { version: 1, real: 0 },
      languages: [Language.English],
    },
  ],
  [
    'Togo 2019 2160p HDR DSNP WEBRip DDPAtmos 5 1 X265-TrollUHD',
    {
      resolution: Resolution.R2160P,
      sources: [Source.WEBRIP],
      title: 'Togo',
      year: '2019',
      group: 'TrollUHD',
    },
  ],
  [
    'Ex Machina 2015 UHD BluRay 2160p DTS-X 7 1 HDR x265 10bit-CHD',
    {
      title: 'Ex Machina',
      year: '2015',
      group: 'CHD',
      resolution: Resolution.R2160P,
    },
  ],
  [
    'Apprentice.2016.COMPLETE.BLURAY-UNRELiABLE',
    {
      title: 'Apprentice',
      year: '2016',
      group: 'UNRELiABLE',
      resolution: Resolution.R1080P,
      complete: true,
    },
  ],
  [
    'Indiana.Jones.and.the.Temple.of.Doom.1984.Complete.UHD.Bluray-JONES',
    {
      title: 'Indiana Jones and the Temple of Doom',
      year: '1984',
      group: 'JONES',
      resolution: Resolution.R2160P,
      complete: true,
    },
  ],
];

for (const [title, result] of movieCases) {
  it(`parse movie title "${title}"`, () => {
    expect(filenameParse(title)).toEqual(expect.objectContaining(result));
  });
}

const tvCases: Array<[string, any]> = [
  [
    'Its Always Sunny in Philadelphia S14E04 720p WEB H264-METCON',
    {
      resolution: Resolution.R720P,
      sources: [Source.WEBDL],
      title: 'Its Always Sunny in Philadelphia',
      videoCodec: VideoCodec.H264,
      group: 'METCON',
      revision: { version: 1, real: 0 },
      languages: [Language.English],
      seasons: [14],
      episodeNumbers: [4],
      isTv: true,
    },
  ],
];
for (const [title, result] of tvCases) {
  it(`parse tv show title "${title}"`, () => {
    expect(filenameParse(title, true)).toEqual(expect.objectContaining(result));
  });
}

const dailyTvCases: Array<[string, any]> = [
  [
    'NFL 2019 10 06 Chicago Bears vs Oakland Raiders Highlights 720p HEVC x265-MeGusta',
    {
      resolution: Resolution.R720P,
      sources: [Source.WEBDL],
      title: 'NFL',
      videoCodec: VideoCodec.X265,
      group: 'MeGusta',
      revision: { version: 1, real: 0 },
      languages: [Language.English],
      airDate: new Date(2019, 9, 6),
      isTv: true,
    },
  ],
];
for (const [title, result] of dailyTvCases) {
  it(`parse daily tv show title "${title}"`, () => {
    expect(filenameParse(title, true)).toEqual(expect.objectContaining(result));
  });
}
