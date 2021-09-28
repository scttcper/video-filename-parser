import test from 'ava';

import { releaseTitleCleaner, simplifyTitle } from '../src/simplifyTitle.js';

test('return null for empty title', t => {
  t.is(releaseTitleCleaner(''), null);
});

const cleanupCases: Array<[string, string]> = [
  ['Mission Impossible Rogue Nation', 'Mission Impossible Rogue Nation'],
  ['Passengers', 'Passengers'],
  ['1941', '1941'],
  ['A.I.Artificial.Intelligence', 'A.I. Artificial Intelligence'],
  ['(500).Days.Of.Summer', '(500) Days Of Summer'],
  ['We Are the Best!', 'We Are the Best!'],
  ['V.H.S.2', 'V.H.S. 2'],
  ['The.Man.from.U.N.C.L.E', 'The Man from U.N.C.L.E.'],
  ['The.Middle.', 'The Middle'],
  ['Incassable.TRUE.FRENCH.PROPER.READ.NFO.DVDRiP.DiVX.SBC-KFT', 'Incassable'],
];
for (const [title, result] of cleanupCases) {
  test(`cleanup movie title "${title}"`, t => {
    t.is(releaseTitleCleaner(title), result);
  });
}

const simplifyCases: Array<[string, string]> = [
  ['The.Man.from.U.N.C.L.E.2015.1080p.BluRay.x264-SPARKS', 'The.Man.from.U.N.C.L.E.2015...-SPARKS'],
  [
    'Movie.Title.Imax.2018.1080p.AMZN.WEB-DL.DD5.1.H.264-NTG',
    'Movie.Title.Imax.2018....DD5.1.H.264-NTG',
  ],
  [
    'Thunderbirds.Are.Go.S01E10.Tunnels.Of.Time.720p.HDTV.x264-RDVAS[rartv]',
    'Thunderbirds.Are.Go.S01E10.Tunnels.Of.Time...-RDVAS',
  ],
  ['The.Middle.720p.HEVC.x265-MeGusta-Pre', 'The.Middle...-MeGusta-Pre'],
  ['[REQ] The.Middle.720p.HEVC.x265-MeGusta-Pre', 'The.Middle...-MeGusta-Pre'],
  [
    'Spider-Man Far from Home.2019.1080p.HDRip.X264.AC3-EVO',
    'Spider-Man Far from Home.2019....AC3-EVO',
  ],
  ['Inglorious.Basterds.CAM.XviD-CAMELOT', 'Inglorious.Basterds..-CAMELOT'],
  ['The.Fighter.DVDR-MPTDVD', 'The.Fighter.-MPTDVD'],
];
for (const [title, result] of simplifyCases) {
  test(`cleanup simplify "${title}"`, t => {
    t.is(simplifyTitle(title), result);
  });
}
