import { simplifyTitle, releaseTitleCleaner } from '../src/simplifyTitle';

describe('releaseTitleCleaner', () => {
  it('should return null for empty title', () => {
    expect(releaseTitleCleaner('')).toBe(null);
  });

  const titleCases: Array<[string, string]> = [
    ['Mission Impossible Rogue Nation', 'Mission Impossible Rogue Nation'],
    ['Passengers', 'Passengers'],
    ['1941', '1941'],
    ['A.I.Artificial.Intelligence', 'A.I. Artificial Intelligence'],
    ['(500).Days.Of.Summer', '(500) Days Of Summer'],
    ['We Are the Best!', 'We Are the Best!'],
    ['V.H.S.2', 'V.H.S. 2'],
    ['The.Man.from.U.N.C.L.E', 'The Man from U.N.C.L.E.'],
    ['The.Middle.', 'The Middle'],
  ];
  it.each(titleCases)('should cleanup movie title "%s"', (title, expected) => {
    expect(releaseTitleCleaner(title)).toBe(expected);
  });
});

describe('simplifyTitle', () => {
  const eachCases: Array<[string, string]> = [
    [
      'The.Man.from.U.N.C.L.E.2015.1080p.BluRay.x264-SPARKS',
      'The.Man.from.U.N.C.L.E.2015..BluRay.-SPARKS',
    ],
    [
      'Movie.Title.Imax.2018.1080p.AMZN.WEB-DL.DD5.1.H.264-NTG',
      'Movie.Title.Imax.2018..AMZN.WEB-DL.DD5.1.H.264-NTG',
    ],
    [
      'Thunderbirds.Are.Go.S01E10.Tunnels.Of.Time.720p.HDTV.x264-RDVAS[rartv]',
      'Thunderbirds.Are.Go.S01E10.Tunnels.Of.Time..HDTV.-RDVAS',
    ],
    ['The.Middle.720p.HEVC.x265-MeGusta-Pre', 'The.Middle...-MeGusta-Pre'],
    ['[REQ] The.Middle.720p.HEVC.x265-MeGusta-Pre', 'The.Middle...-MeGusta-Pre'],
  ];
  it.each(eachCases)('should simplify "%s"', (input, expected) => {
    expect(simplifyTitle(input)).toBe(expected);
  });
});
