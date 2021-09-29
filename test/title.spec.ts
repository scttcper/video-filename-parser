import test from 'ava';

import { parseTitleAndYear } from '../src/index.js';

const cases: Array<[string, { title: string; year: string | null }]> = [
  [
    'The.Man.from.U.N.C.L.E.2015.1080p.BluRay.x264-SPARKS',
    { title: 'The Man from U.N.C.L.E.', year: '2015' },
  ],
  ['1941.1979.EXTENDED.720p.BluRay.X264-AMIABLE', { title: '1941', year: '1979' }],
  [
    'MY MOVIE (2016) [R][Action, Horror][720p.WEB-DL.AVC.8Bit.6ch.AC3].mkv',
    { title: 'MY MOVIE', year: '2016' },
  ],
  ['R.I.P.D.2013.720p.BluRay.x264-SPARKS', { title: 'R.I.P.D.', year: '2013' }],
  ['V.H.S.2.2013.LIMITED.720p.BluRay.x264-GECKOS', { title: 'V.H.S. 2', year: '2013' }],
  [
    'This Is A Movie (1999) [IMDB #] <Genre, Genre, Genre> {ACTORS} !DIRECTOR +MORE_SILLY_STUFF_NO_ONE_NEEDS ?',
    { title: 'This Is A Movie', year: '1999' },
  ],
  ['We Are the Best!.2013.720p.H264.mkv', { title: 'We Are the Best!', year: '2013' }],
  [
    '(500).Days.Of.Summer.(2009).DTS.1080p.BluRay.x264.NLsubs',
    { title: '(500) Days Of Summer', year: '2009' },
  ],
  ['To.Live.and.Die.in.L.A.1985.1080p.BluRay', { title: 'To Live and Die in L.A.', year: '1985' }],
  ['A.I.Artificial.Intelligence.(2001)', { title: 'A.I. Artificial Intelligence', year: '2001' }],
  ['A.Movie.Name.(1998)', { title: 'A Movie Name', year: '1998' }],
  ['www.Torrenting.com - Revenge.2008.720p.X264-DIMENSION', { title: 'Revenge', year: '2008' }],
  ['Thor: The Dark World 2013', { title: 'Thor The Dark World', year: '2013' }],
  [
    'Resident.Evil.The.Final.Chapter.2016',
    { title: 'Resident Evil The Final Chapter', year: '2016' },
  ],
  [
    'Mission Impossible: Rogue Nation (2015)�[XviD - Ita Ac3 - SoftSub Ita]azione, spionaggio, thriller *Prima Visione* Team mulnic Tom Cruise',
    { title: 'Mission Impossible Rogue Nation', year: '2015' },
  ],
  ['Scary.Movie.2000.FRENCH..BluRay.-AiRLiNE', { title: 'Scary Movie', year: '2000' }],
  ['My Movie 1999 German Bluray', { title: 'My Movie', year: '1999' }],
  [
    'Leaving Jeruselem by Railway (1897) [DVD].mp4',
    { title: 'Leaving Jeruselem by Railway', year: '1897' },
  ],
  ['Climax.2018.1080p.AMZN.WEB-DL.DD5.1.H.264-NTG', { title: 'Climax', year: '2018' }],
  [
    'Movie.Title.Imax.2018.1080p.AMZN.WEB-DL.DD5.1.H.264-NTG',
    { title: 'Movie Title', year: '2018' },
  ],
  ['The.Middle.720p.HEVC.x265-MeGusta-Pre', { title: 'The Middle', year: null }],
  ['The.Middle.HEVC.x265-MeGusta-Pre', { title: 'The Middle', year: null }],
  ['Blade Runner 2049 2017', { title: 'Blade Runner 2049', year: '2017' }],
  ['Blade Runner 2049 (2017)', { title: 'Blade Runner 2049', year: '2017' }],
  [
    'Scarface.Anniversary.Edition.1983.INTERNAL.DVDRip.XviD-VoMiT',
    { title: 'Scarface', year: '1983' },
  ],
  [
    'Ouija.Origin.of.Evil.2016.MULTi.TRUEFRENCH.1080p.BluRay.x264-MELBA',
    { title: 'Ouija Origin of Evil', year: '2016' },
  ],
  ['Appaloosa.1080p.Bluray.x264-1920', { title: 'Appaloosa', year: null }],
  ['Inglorious.Basterds.CAM.XviD-CAMELOT', { title: 'Inglorious Basterds', year: null }],
  ['Inglourious.Basterds.SCR.XViD-xSCR', { title: 'Inglourious Basterds', year: null }],
  ['No.Country.for.Old.Men.DVDRip.XviD-DiAMOND', { title: 'No Country for Old Men', year: null }],
  ['The.Fighter.DVDR-MPTDVD', { title: 'The Fighter', year: null }],
  ['Sunshine.Cleaning.DVDR-Replica', { title: 'Sunshine Cleaning', year: null }],
  [
    'Scarface.The.Uncut.Version.1983.DVDRip.Divx.AC3.iNTERNAL-FFM',
    { title: 'Scarface', year: '1983' },
  ],
  ['Casino.10TH.ANNiVERSARY.1995.iNTERNAL.DVDRiP.XViD-KiSS', { title: 'Casino', year: '1995' }],
  [
    'Get.Him.To.The.Greek.UNRATED.FRENCH.720p.BluRay.x264-NERDHD',
    { title: 'Get Him To The Greek', year: null },
  ],
  [
    'The.Social.Network.German.720p.BluRay.x264-DECENT',
    // Not sure what to do about this case. You would need to know the movie title
    { title: 'The Social Network German', year: null },
  ],
  [
    'The.Outsiders.DC.German.1983.AC3.BDRip.XviD.INTERNAL-ARC',
    { title: 'The Outsiders', year: '1983' },
  ],
];

for (const [title, result] of cases) {
  test(`parse title "${title}"`, t => {
    t.deepEqual(parseTitleAndYear(title), result);
  });
}
