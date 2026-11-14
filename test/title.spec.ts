import { expect, it } from 'vitest';

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
  ['1337x.to - Revenge.2008.720p.X264-DIMENSION', { title: 'Revenge', year: '2008' }],
  ['[ example.co.uk ] - Revenge.2008.720p.X264-DIMENSION', { title: 'Revenge', year: '2008' }],
  ['(tracker.xn--p1ai) Revenge.2008.720p.X264-DIMENSION', { title: 'Revenge', year: '2008' }],
  ['Revenge.2008.720p.X264-DIMENSION [example.co.uk]', { title: 'Revenge', year: '2008' }],
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
  ['Multiplicity (1996) [REPACK] [720p]', { title: 'Multiplicity', year: '1996' }],
  ['Multiplicity.1996.1080p.BluRay.X264-AMIABLE', { title: 'Multiplicity', year: '1996' }],
  ['Multiverse (2024) 720p WEB-DL', { title: 'Multiverse', year: '2024' }],
  [
    'Doctor.Strange.in.the.Multiverse.of.Madness.2022.2160p.UHD.BluRay.x265-SURCODE',
    { title: 'Doctor Strange in the Multiverse of Madness', year: '2022' },
  ],
  [
    'Doctor.Strange.in.the.Multiverse.of.Madness.2022.2160p.WEB.H265-SLOT',
    { title: 'Doctor Strange in the Multiverse of Madness', year: '2022' },
  ],
  ['Blade Runner 2049 2017', { title: 'Blade Runner 2049', year: '2017' }],
  ['Blade Runner 2049 (2017)', { title: 'Blade Runner 2049', year: '2017' }],
  [
    'Scarface.Anniversary.Edition.1983.INTERNAL.DVDRip.XviD-VoMiT',
    { title: 'Scarface', year: '1983' },
  ],
  [
    'The.Bone.Collector.1999.2160p.UHD.BluRay.x265-B0MBARDiERS',
    { title: 'The Bone Collector', year: '1999' },
  ],
  ['The.Collector.2009.1080p.BluRay.X264-AMIABLE', { title: 'The Collector', year: '2009' }],
  ['Uncut.Gems.2019.2160p.UHD.BluRay.x265-B0MBARDiERS', { title: 'Uncut Gems', year: '2019' }],
  ['A.Real.Pain.2024.1080p.WEB.H264-GROUP', { title: 'A Real Pain', year: '2024' }],
  ['Real.Steel.2011.1080p.BluRay.x264-GROUP', { title: 'Real Steel', year: '2011' }],
  ['Reality.2023.1080p.WEB.H264-GROUP', { title: 'Reality', year: '2023' }],
  ['Polish.Wedding.1998.1080p.WEB.H264-GROUP', { title: 'Polish Wedding', year: '1998' }],
  [
    'Movie.Title.Directors.Cut.2019.1080p.BluRay.x264-GROUP',
    { title: 'Movie Title', year: '2019' },
  ],
  ['Movie.Title.Final.Cut.1982.1080p.BluRay.x264-GROUP', { title: 'Movie Title', year: '1982' }],
  [
    'Movie.Title.Extended.Edition.2010.1080p.BluRay.x264-GROUP',
    { title: 'Movie Title', year: '2010' },
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
    { title: 'The Social Network', year: null },
  ],
  [
    'The.Outsiders.DC.German.1983.AC3.BDRip.XviD.INTERNAL-ARC',
    { title: 'The Outsiders', year: '1983' },
  ],
  [
    'The.Girl.in.the.Spiders.Web.2018.2160p.UHD.BluRay.x265-VALiS',
    { title: 'The Girl in the Spiders Web', year: '2018' },
  ],
];

// From Radarr's ParserFixture
const radarrCases: Array<[string, { title: string; year: string | null }]> = [
  // Anime
  ['[MTBB] Kimi no Na wa. (2016) v2 [97681524].mkv', { title: 'Kimi no Na wa', year: '2016' }],
  [
    '[sam] Toward the Terra (1980) [BD 1080p TrueHD].mkv',
    { title: 'Toward the Terra', year: '1980' },
  ],
  [
    "[Arid] Cowboy Bebop - Knockin' on Heaven's Door v2 [00F4CDA0].mkv",
    { title: "Cowboy Bebop - Knockin' on Heaven's Door", year: null },
  ],
  [
    "[sam] Goblin Slayer - Goblin's Crown [BD 1080p FLAC] [CD298D48].mkv",
    { title: "Goblin Slayer - Goblin's Crown", year: null },
  ],
  // German and TrueFrench tracker names
  ['Cars.2.German.DL.720p.BluRay.x264-EmpireHD', { title: 'Cars 2', year: null }],
  [
    'Der.Film.deines.Lebens.German.2011.PAL.DVDR-ETM',
    { title: 'Der Film deines Lebens', year: '2011' },
  ],
  ['Passengers.German.DL.AC3.Dubbed..BluRay.x264-PsO', { title: 'Passengers', year: null }],
  // Single letters and Dr.
  [
    'Movie.War.Q.EXTENDED.CUT.2013.German.DL.1080p.BluRay.x264-HQX',
    { title: 'Movie War Q', year: '2013' },
  ],
  [
    'Die.fantastische.Reise.des.Dr.Dolittle.2020.German.DL.LD.1080p.WEBRip.x264-PRD',
    { title: 'Die fantastische Reise des Dr. Dolittle', year: '2020' },
  ],
  // a.k.a.
  [
    'Sydney A.K.A. Hard Eight 1996 1080p AMZN WEB-DL DD+ 2.0 H.264.mkv',
    { title: 'Sydney AKA Hard Eight', year: '1996' },
  ],
  // Year first folders, bracketed tags aren't years
  ['(1995) Movie Name', { title: 'Movie Name', year: '1995' }],
  ['World Movie Z Movie [2023]', { title: 'World Movie Z Movie', year: '2023' }],
  [
    'My.Movie.Assembly.Cut.1992.REPACK.1080p.BluRay.DD5.1.x264-Group',
    { title: 'My Movie', year: '1992' },
  ],
  // Underscores, file extensions and unclosed brackets
  ['Some_Anime_Show_e66_time_is_money', { title: 'Some Anime Show e66 time is money', year: null }],
  ['The.Series.S02E15.mkv', { title: 'The Series S02E15', year: null }],
];

for (const [title, result] of [...cases, ...radarrCases]) {
  it(`parse title "${title}"`, () => {
    expect(parseTitleAndYear(title)).toEqual(result);
  });
}
