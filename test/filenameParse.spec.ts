import { filenameParse, ParsedFilename, Source, Resolution, Edition, Codec, QualitySource } from '../src';

const noEditions: Edition = {
  directors: false,
  extended: false,
  fanEdit: false,
  imax: false,
  remastered: false,
  theatrical: false,
  unrated: false,
  limited: false,
};

describe('filenameParse', () => {
  const cases: Array<[string, ParsedFilename]> = [
    [
      'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
      {
        edition: noEditions,
        resolution: Resolution.R720P,
        source: Source.BLURAY,
        title: 'Whats Eating Gilbert Grape',
        year: '1993',
        codec: Codec.X264,
        group: 'SiNNERS',
        revision: { version: 1, real: 0 },
        qualitySource: QualitySource.NAME,
      },
    ],
    [
      'Timecop.1994.PROPER.1080p.BluRay.x264-Japhson',
      {
        edition: noEditions,
        resolution: Resolution.R1080P,
        source: Source.BLURAY,
        title: 'Timecop',
        year: '1994',
        codec: Codec.X264,
        group: 'Japhson',
        revision: { version: 2, real: 0 },
        qualitySource: QualitySource.NAME,
      },
    ],
    [
      'This.is.40.2012.PROPER.UNRATED.720p.BluRay.x264-Felony',
      {
        edition: { ...noEditions, unrated: true },
        resolution: Resolution.R720P,
        source: Source.BLURAY,
        title: 'This is 40',
        year: '2012',
        codec: Codec.X264,
        group: 'Felony',
        revision: { version: 2, real: 0 },
        qualitySource: QualitySource.NAME,
      },
    ],
  ];
  test.each(cases)('should get filename of "%s"', (title, expected) => {
    expect(filenameParse(title)).toEqual(expected);
  });
});
