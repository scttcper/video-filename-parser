import { filenameParse, ParsedFilename, Source, Resolution } from '../src';

const noEditions = {
  directors: false,
  extended: false,
  fanEdit: false,
  imax: false,
  remastered: false,
  theatrical: false,
  unrated: false,
};

describe('parseEditionText', () => {
  const cases: Array<[string, ParsedFilename]> = [
    [
      'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
      {
        edition: noEditions,
        resolution: Resolution.R720P,
        source: Source.BLURAY,
        title: 'Whats Eating Gilbert Grape',
        year: '1993',
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
      },
    ],
  ];
  test.each(cases)('should get edition of "%s"', (title, expected) => {
    expect(filenameParse(title)).toEqual(expected);
  });
});
