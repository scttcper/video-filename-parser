import {
  filenameParse,
  ParsedFilename,
  Source,
  Resolution,
  Edition,
  VideoCodec,
  QualitySource,
  Language,
  ParsedTvInfo,
} from '../src';
import { AudioCodec } from '../src/audioCodec';

const noEditions: Edition = {
  directors: false,
  extended: false,
  fanEdit: false,
  imax: false,
  remastered: false,
  theatrical: false,
  unrated: false,
  limited: false,
  hdr: false,
  internal: false,
};

const tvDefaults: ParsedTvInfo = {
  seasons: [],
  episodeNumbers: [],
  airDate: null,
  fullSeason: false,
  isPartialSeason: false,
  isMultiSeason: false,
  isSeasonExtra: false,
  isSpecial: false,
  seasonPart: 0,
};

describe('filenameParse', () => {
  const movieCases: Array<[string, ParsedFilename]> = [
    [
      'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
      {
        ...tvDefaults,
        edition: noEditions,
        resolution: Resolution.R720P,
        sources: [Source.BLURAY],
        title: 'Whats Eating Gilbert Grape',
        year: '1993',
        videoCodec: VideoCodec.X264,
        audioCodec: null,
        audioChannels: null,
        group: 'SiNNERS',
        revision: { version: 1, real: 0 },
        qualitySource: QualitySource.NAME,
        languages: [Language.English],
        seasons: [],
        isTv: false,
      },
    ],
    [
      'Timecop.1994.PROPER.1080p.BluRay.x264-Japhson',
      {
        ...tvDefaults,
        edition: noEditions,
        resolution: Resolution.R1080P,
        sources: [Source.BLURAY],
        title: 'Timecop',
        year: '1994',
        videoCodec: VideoCodec.X264,
        audioCodec: null,
        audioChannels: null,
        group: 'Japhson',
        revision: { version: 2, real: 0 },
        qualitySource: QualitySource.NAME,
        languages: [Language.English],
        isTv: false,
      },
    ],
    [
      'This.is.40.2012.PROPER.UNRATED.720p.BluRay.x264-Felony',
      {
        ...tvDefaults,
        edition: { ...noEditions, unrated: true },
        resolution: Resolution.R720P,
        sources: [Source.BLURAY],
        title: 'This is 40',
        year: '2012',
        videoCodec: VideoCodec.X264,
        audioCodec: null,
        audioChannels: null,
        group: 'Felony',
        revision: { version: 2, real: 0 },
        qualitySource: QualitySource.NAME,
        languages: [Language.English],
        isTv: false,
      },
    ],
    [
      'Spider-Man Far from Home.2019.1080p.HDRip.X264.AC3-EVO',
      {
        ...tvDefaults,
        edition: noEditions,
        resolution: Resolution.R1080P,
        sources: [Source.WEBDL],
        title: 'Spider-Man Far from Home',
        year: '2019',
        videoCodec: VideoCodec.X264,
        audioCodec: AudioCodec.DOLBY,
        audioChannels: null,
        group: 'EVO',
        revision: { version: 1, real: 0 },
        qualitySource: QualitySource.NAME,
        languages: [Language.English],
        isTv: false,
      },
    ],
  ];
  test.each(movieCases)('should get filename of "%s"', (title, expected) => {
    expect(filenameParse(title)).toEqual(expected);
  });

  const tvCases: Array<[string, ParsedFilename]> = [
    [
      'Its Always Sunny in Philadelphia S14E04 720p WEB H264-METCON',
      {
        ...tvDefaults,
        edition: noEditions,
        resolution: Resolution.R720P,
        sources: [Source.WEBDL],
        title: 'Its Always Sunny in Philadelphia',
        year: null,
        videoCodec: VideoCodec.X264,
        audioCodec: null,
        audioChannels: null,
        group: 'METCON',
        revision: { version: 1, real: 0 },
        qualitySource: QualitySource.NAME,
        languages: [Language.English],
        seasons: [14],
        episodeNumbers: [4],
        isTv: true,
      },
    ],
  ];
  it.each(tvCases)('should parse tv shows "%s"', (title, expected) => {
    expect(filenameParse(title, true)).toEqual(expected);
  });

  const dailyTvCases: Array<[string, ParsedFilename]> = [
    [
      'NFL 2019 10 06 Chicago Bears vs Oakland Raiders Highlights 720p HEVC x265-MeGusta',
      {
        ...tvDefaults,
        edition: noEditions,
        resolution: Resolution.R720P,
        sources: [Source.WEBDL],
        title: 'NFL',
        year: null,
        videoCodec: VideoCodec.X265,
        audioCodec: null,
        audioChannels: null,
        group: 'MeGusta',
        revision: { version: 1, real: 0 },
        qualitySource: QualitySource.NAME,
        languages: [Language.English],
        airDate: new Date(2019, 9, 6),
        isTv: true,
      },
    ],
  ];
  it.each(dailyTvCases)('should parse daily tv shows "%s"', (title, expected) => {
    expect(filenameParse(title, true)).toEqual(expected);
  });
});
