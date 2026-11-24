import { expect, it } from 'vitest';

import { parseMatchCollection, parseSeason, type Season } from '../src/index.js';

const fullSeasonRelease: Array<[string, string, number]> = [
  ['30.Rock.Season.04.HDTV.XviD-DIMENSION', '30 Rock', 4],
  ['Parks.and.Recreation.S02.720p.x264-DIMENSION', 'Parks and Recreation', 2],
  ['The.Office.US.S03.720p.x264-DIMENSION', 'The Office US', 3],
  ['Sons.of.Anarchy.S03.720p.BluRay-CLUEREWARD', 'Sons of Anarchy', 3],
  ['Adventure Time S02 720p HDTV x264 CRON', 'Adventure Time', 2],
  ['Sealab.2021.S04.iNTERNAL.DVDRip.XviD-VCDVaULT', 'Sealab 2021', 4],
  ['Hawaii Five 0 S01 720p WEB DL DD5 1 H 264 NT', 'Hawaii Five 0', 1],
  ['30 Rock S03 WS PDTV XviD FUtV', '30 Rock', 3],
  ['The Office Season 4 WS PDTV XviD FUtV', 'The Office', 4],
  ['Eureka Season 1 720p WEB DL DD 5 1 h264 TjHD', 'Eureka', 1],
  ['The Office Season4 WS PDTV XviD FUtV', 'The Office', 4],
  ['Eureka S 01 720p WEB DL DD 5 1 h264 TjHD', 'Eureka', 1],
  ['Doctor Who Confidential   Season 3', 'Doctor Who Confidential', 3],
  ['Fleming.S01.720p.WEBDL.DD5.1.H.264-NTb', 'Fleming', 1],
  ['Holmes.Makes.It.Right.S02.720p.HDTV.AAC5.1.x265-NOGRP', 'Holmes Makes It Right', 2],
  ['My.Series.S2014.720p.HDTV.x264-ME', 'My Series', 2014],
];
for (const [postTitle, title, season] of fullSeasonRelease) {
  it(`parse full season release "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seasons[0]).toBe(season);
    expect(result.seriesTitle).toBe(title);
  });
}

const dayEpisodeCases: Array<[string, string, Date]> = [
  [
    'Jimmy Fallon 2019 10 23 Michael Douglas 1080p HEVC x265-MeGusta',
    'Jimmy Fallon',
    new Date(2019, 9, 23),
  ],
  [
    'NFL.2019.10.06.Chicago.Bears.vs.Oakland.Raiders.Highlights.WEB.H264-LEViTATE',
    'NFL',
    new Date(2019, 9, 6),
  ],
  ['Series.Title.140226.720p.HDTV.x264-GRP', 'Series Title', new Date(2014, 1, 26)],
  [
    'Jimmy_Fallon_2019_10_23_Michael_Douglas_1080p_HEVC_x265-MeGusta',
    'Jimmy Fallon',
    new Date(2019, 9, 23),
  ],
];
for (const [postTitle, title, airDate] of dayEpisodeCases) {
  it(`parse day season release "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seriesTitle).toBe(title);
    expect(result.airDate).toEqual(airDate);
    expect(result.seasons.length).toBe(0);
  });
}

const seasonPackCases: Array<[string, string, number[]]> = [
  [
    'The Simpsons S01 - S10 FIXED MegaPack x264 AC3-DTS -jlw',
    'The Simpsons',
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ],
  ['The Wire S01-05 WS BDRip X264-REWARD-No Rars', 'The Wire', [1, 2, 3, 4, 5]],
  [
    'The Office S01-S09 720p BluRay WEB-DL nHD x264-NhaNc3',
    'The Office',
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ],
  ['[REQ] Reno 911! S01 - 06 Complete DVDRip XviD-Mixed', 'Reno 911!', [1, 2, 3, 4, 5, 6]],
];
for (const [postTitle, title, seasons] of seasonPackCases) {
  it(`parse multi season release "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seasons).toEqual(seasons);
    expect(result.seriesTitle).toBe(title);
    expect(result.isMultiSeason).toBe(true);
  });
}

const multiEpisodeCases: Array<[string, string, number, number[]]> = [
  ['The Morning Show S01E01-E03 2019 1080p WEBRip X264 AC3-EVO', 'The Morning Show', 1, [1, 2, 3]],
  // Repeated episode tokens keep the first episode, not only the last repetition
  ['Series.S03E01.S03E02.720p.HDTV.X264-DIMENSION', 'Series', 3, [1, 2]],
  ['Series.Title.2x04.2x05.720p.BluRay-FUTV', 'Series Title', 2, [4, 5]],
  [
    'Series Title - S07E22 - S07E23 - And Lots of Security.. [HDTV-720p].mkv',
    'Series Title',
    7,
    [22, 23],
  ],
  ['S02E04E05.720p.BluRay-FUTV', '', 2, [4, 5]],
  ['S02E03-04-05.720p.BluRay-FUTV', '', 2, [3, 4, 5]],
  ['Series.Title.103.104.720p.HDTV.X264-DIMENSION', 'Series Title', 1, [3, 4]],
  ['Series.10708.hdtv-lol.mp4', 'Series', 1, [7, 8]],
  ['grp-zoos01e11e12-1080p', 'grp-zoo', 1, [11, 12]],
  ['Series.S01E91-E100', 'Series', 1, [91, 92, 93, 94, 95, 96, 97, 98, 99, 100]],
  ['Series.S29E161-E165.PDTV.x264-FQM', 'Series', 29, [161, 162, 163, 164, 165]],
  ["Series's Sonarr - 8x01_02 - Free Falling", "Series's Sonarr", 8, [1, 2]],
  ['Series Title - [02x01-02] - Episode 1', 'Series Title', 2, [1, 2]],
  ['Series Title (S15E06-08) City Sushi', 'Series Title', 15, [6, 7, 8]],
  [
    'The Series And The Code - S42 Ep10718 - Ep10720',
    'The Series And The Code',
    42,
    [10_718, 10_719, 10_720],
  ],
  ['Series Title - S15E06-07 - City Sushi HDTV-720p', 'Series Title', 15, [6, 7]],
];
for (const [postTitle, title, season, episodes] of multiEpisodeCases) {
  it(`parse multi episode release "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seasons).toEqual([season]);
    expect(result.episodeNumbers).toEqual(episodes);
    expect(result.seriesTitle).toBe(title);
    expect(result.isMultiSeason).toBe(false);
  });
}

// Numbers in episode titles and resolutions are not extra episodes
const singleEpisodeCases: Array<[string, string, number, number]> = [
  ['Court.Cam.S02E01.1080p.WEB.h264-GRP', 'Court Cam', 2, 1],
  ['Series.S01E04.2-45.PM.[HDTV-720p].mkv', 'Series', 1, 4],
  ['Series-S07E12-31st_Century_Fox-[Bluray-1080p].mkv', 'Series', 7, 12],
  ['Series S08E20 50-50 Carla [DVD]', 'Series', 8, 20],
  ['Developers & Coders S02E10 6-50 to SLC [SDTV]', 'Developers & Coders', 2, 10],
  ['Series.Galaxy.S01E01.33.720p.HDDVD.x264-SiNNERS.mkv', 'Series Galaxy', 1, 1],
  ['The_Series_US_s06e19_04.28.2014_hdtv.x264.Poke.mp4', 'The Series US', 6, 19],
  ['Series Title - S02E01 1920x910', 'Series Title', 2, 1],
  ['Series-S03E14-720p-HDTV-X264-DIMENSION', 'Series', 3, 14],
  ['Big.Love.1x07.Eviction.DVDRip.XviD-FoV', 'Big Love', 1, 7],
  ['Klassen.S07E370.Et.Vildt.Venskab.DANISH.720p.WEB.h264-LSDK', 'Klassen', 7, 370],
  ['Stargate_Atlantis_4x16_Trio_DVDRip_Dual_XviD-CLT', 'Stargate Atlantis', 4, 16],
  ['Samurai.Jack.1x16.XVI.Jack.and.the.Smackback.SVCD.SD-6', 'Samurai Jack', 1, 16],
  [
    'Turning_Point_9_11_and_the_War_on_Terror_S01E01.mkv',
    'Turning Point 9 11 and the War on Terror',
    1,
    1,
  ],
];
for (const [postTitle, title, season, episode] of singleEpisodeCases) {
  it(`parse single episode release "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seasons).toEqual([season]);
    expect(result.episodeNumbers).toEqual([episode]);
    expect(result.seriesTitle).toBe(title);
  });
}

const absoluteRangeCases: Array<[string, string, number, number]> = [
  ['[Doutei] Some Good, Anime Show - 01-12 [BD][720p-AAC]', 'Some Good, Anime Show', 1, 12],
  ['[HorribleSubs] Some Anime Show!! (01-25) [1080p] (Batch)', 'Some Anime Show!!', 1, 25],
  [
    'Some Anime Show (2011) Episode 99-100 [1080p] [Dual.Audio] [x265]',
    'Some Anime Show (2011)',
    99,
    100,
  ],
  ['[ANBU-AonE]_SeriesTitle_26-27_[F224EF26].avi', 'SeriesTitle', 26, 27],
];
for (const [postTitle, title, first, last] of absoluteRangeCases) {
  it(`parse absolute episode range "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.episodeNumbers).toEqual(
      Array.from({ length: last - first + 1 }, (_, index) => first + index),
    );
    expect(result.seriesTitle).toBe(title);
  });
}

it('does not read a year range after an anime subgroup as absolute episodes', () => {
  expect(parseSeason('[Group] Show Name (2009-2010) [BD 1080p]')).toBeNull();
  expect(parseSeason('[HatSubs] One Series (1017-1088) (WEB 1080p)')?.episodeNumbers).toHaveLength(
    72,
  );
});

it('does not read air dates as season and episode ranges', () => {
  expect(parseSeason('A Late Talk Show - 2011-04-12 - Gov. Deval Patrick')).toMatchObject({
    seriesTitle: 'A Late Talk Show',
    seasons: [],
    episodeNumbers: [],
    airDate: new Date(2011, 3, 12),
  });
  expect(parseSeason('Series Title (1955) - 1954-01-23 05 00 00 - Cottage for Sale.ts')).toBeNull();
});

it('trims separators around series titles', () => {
  expect(parseSeason('[MGS] - Kuragehime - Episode 02v2 - [D8B6C90D]')?.seriesTitle).toBe(
    'Kuragehime',
  );
  expect(parseSeason('Mad Series - Season 1 [Bluray720p]')?.seriesTitle).toBe('Mad Series');
});

const range = (first: number, last: number) =>
  Array.from({ length: last - first + 1 }, (_, index) => first + index);

const sonarrPatternCases: Array<[string, Partial<Season>]> = [
  // Anime season packs
  ['[Group] Title S01 12 13 [1080p]', { seriesTitle: 'Title', seasons: [1], fullSeason: true }],
  [
    '[Vivid] Some Anime Show S01 [Web][MKV][h264 10-bit][1080p][AAC 2.0]',
    { seriesTitle: 'Some Anime Show', seasons: [1], fullSeason: true },
  ],
  [
    '[Group] Series Title S01-04 (BD 1080p) [Dual Audio]',
    { seriesTitle: 'Series Title', seasons: [1, 2, 3, 4], isMultiSeason: true },
  ],
  [
    '[Group] Series Title S03 Vol.02 [BD 1080p FLAC]',
    { seriesTitle: 'Series Title', seasons: [3], isPartialSeason: true, seasonPart: 2 },
  ],
  ['[Group] Title S01 - 01-12 [1080p]', { seriesTitle: 'Title S01', episodeNumbers: range(1, 12) }],
  [
    '[Erai-raws] Series Title! - 01~10 [1080p][Multiple Subtitle]',
    { seriesTitle: 'Series Title!', episodeNumbers: range(1, 10) },
  ],
  // Air dates win over a later "Part N"
  [
    'Series Title - 2026-07-03 - Recap 2025 Part 2 [WEBDL-1080p]-RlsGrp',
    { seriesTitle: 'Series Title', episodeNumbers: [], airDate: new Date(2026, 6, 3) },
  ],
  [
    'Series.Title.2015.09.07.Part.1.720p.HULU.WEBRip.AAC2.0.H.264-Sonarr',
    { seriesTitle: 'Series Title', episodeNumbers: [], airDate: new Date(2015, 8, 7) },
  ],
  [
    'Series On TitleClub E76 2024 08 08 1080p WEB H264-RnB96 [TJET]',
    { seriesTitle: 'Series On TitleClub', episodeNumbers: [], airDate: new Date(2024, 7, 8) },
  ],
  // Korean releases with an episode and air date
  [
    "It's a Series Title.E56.190121.720p-NEXT.mp4",
    { seriesTitle: "It's a Series Title", seasons: [1], episodeNumbers: [56] },
  ],
  // Spanish tracker releases
  [
    'Series Title - Temporada 2 [HDTV 720p][Cap.201][AC3 5.1 Castellano][www.pctnew.com]',
    { seriesTitle: 'Series Title', seasons: [2], episodeNumbers: [1] },
  ],
  [
    'Series falls - Temporada 1 [HDTV][Cap.111_120]',
    { seriesTitle: 'Series falls', seasons: [1], episodeNumbers: range(11, 20) },
  ],
  [
    'Series Title [HDTV][Cap.104](website.com).avi',
    { seriesTitle: 'Series Title', seasons: [1], episodeNumbers: [4] },
  ],
  [
    'Series (1994) - Temporada 10',
    { seriesTitle: 'Series (1994)', seasons: [10], fullSeason: true },
  ],
  // 3 digit seasons
  [
    'Series.S006E18.Some.Title.Name-Part.1.1080p.WEB-DL.AAC2.0.H.264-Release',
    { seriesTitle: 'Series', seasons: [6], episodeNumbers: [18] },
  ],
  [
    'Series S093E081 1080p ALL4 WEB-DL AAC2 0 H 264-JJUNAHJAMESON',
    { seriesTitle: 'Series', seasons: [93], episodeNumbers: [81] },
  ],
  [
    'Series.S101E01-E02.Some.Title.Name.1080p.WEB-DL.AAC2.0.H.264-Release',
    { seriesTitle: 'Series', seasons: [101], episodeNumbers: [1, 2] },
  ],
  // Dutch/Flemish releases
  [
    '13 Series Se.1 afl.2-3-4 [VTM]',
    { seriesTitle: '13 Series', seasons: [1], episodeNumbers: [2, 3, 4] },
  ],
  ['Series T Se.3 afl.3 en 4', { seriesTitle: 'Series T', seasons: [3], episodeNumbers: [3, 4] }],
  // Season packs
  [
    'Series.Saison3.VOSTFR.HDTV.XviD-NOTAG',
    { seriesTitle: 'Series', seasons: [3], fullSeason: true },
  ],
  ['Series.Stagione.3.HDTV.XviD-NOTAG', { seriesTitle: 'Series', seasons: [3], fullSeason: true }],
  [
    '1234 [Sezon 3] [1080p] [NF] [WEB-DL] [H264] [DDP5.1.Atmos-K83] [Serial Polski]',
    { seriesTitle: '1234', seasons: [3], fullSeason: true },
  ],
  [
    '[Judas] Series E (Series J) (Season 04) [1080p][HEVC x265 10bit][Dual-Audio][Multi-Subs] (Batch)',
    { seriesTitle: 'Series E (Series J)', seasons: [4], fullSeason: true },
  ],
  [
    'The.Series.S07.Vol.1.1080p.NF.WEBRip.DD5.1.x264-NTb',
    { seriesTitle: 'The Series', seasons: [7], isPartialSeason: true, seasonPart: 1 },
  ],
  [
    'Series Title Season 01 - Season 07 BluRay 1080p x264 REPACK -SacReD',
    { seriesTitle: 'Series Title', seasons: range(1, 7), isMultiSeason: true },
  ],
  [
    'Series Title Complete Series S01 S04 (1080p BluRay x265 HEVC 10bit AAC 5.1 Vyndros)',
    { seriesTitle: 'Series Title', seasons: range(1, 4), isMultiSeason: true },
  ],
  // Audio channels left next to the season after stripping aren't more seasons
  [
    'Show.Name.S01.720p.HDTV.2.0.x264-GRP',
    { seriesTitle: 'Show Name', seasons: [1], isMultiSeason: false, fullSeason: true },
  ],
  [
    'Show.Name.S01.1080p.BluRay.5.1.x265-GRP',
    { seriesTitle: 'Show Name', seasons: [1], isMultiSeason: false, fullSeason: true },
  ],
  // Resolutions like 4K, 1440p and 540p are not season or episode numbers
  [
    'Show.S01.10bit.1080p',
    { seriesTitle: 'Show', seasons: [1], isMultiSeason: false, fullSeason: true },
  ],
  ['Series Title S01 4K 2160p WEB-DL x265-GRP', { seriesTitle: 'Series Title', seasons: [1] }],
  ['Series S01 1440p HMAX WEB-DL DD+ 5.1 H.265', { seriesTitle: 'Series', seasons: [1] }],
  [
    'Titles.s06.01.1999.BDRip.1080p.Ukr.Eng.AC3',
    { seriesTitle: 'Titles', seasons: [6], episodeNumbers: [1] },
  ],
  // Anime absolute numbers
  [
    '[HatSubs] One Series 1017-1088 (WEB 1080p)',
    { seriesTitle: 'One Series', episodeNumbers: range(1017, 1088) },
  ],
  [
    '[HatSubs] Anime Title 1004 [E63F2984].mkv',
    { seriesTitle: 'Anime Title', episodeNumbers: [1004] },
  ],
  [
    '[Erai-raws] Series - 0955 ~ 1005 [1080p]',
    { seriesTitle: 'Series', episodeNumbers: range(955, 1005) },
  ],
  [
    'SeriesTitle.E1206.In.seinen.Augen.2022.GERMAN.1080p.WEB.h264-Group',
    { seriesTitle: 'SeriesTitle', episodeNumbers: [1206] },
  ],
  // #65: 4 digit absolute episodes without a subgroup
  ['One Piece - 1001 [1080p]', { seriesTitle: 'One Piece', seasons: [], episodeNumbers: [1001] }],
  ['One Piece - 1001 (1080p)', { seriesTitle: 'One Piece', seasons: [], episodeNumbers: [1001] }],
  ['One Piece - 1001v2 [1080p]', { seriesTitle: 'One Piece', episodeNumbers: [1001] }],
  ['Detective Conan - 1000 [1080p]', { seriesTitle: 'Detective Conan', episodeNumbers: [1000] }],
  [
    'A Random Series Name - 1000 [1080p WEB-DL]',
    { seriesTitle: 'A Random Series Name', seasons: [], episodeNumbers: [1000] },
  ],
  ['One Piece - 1000-1001 [1080p]', { seriesTitle: 'One Piece', episodeNumbers: [1000, 1001] }],
  ['One Piece - 1000 ~ 1001 [1080p]', { seriesTitle: 'One Piece', episodeNumbers: [1000, 1001] }],
  // Scene numbering and episode titles after the number stay season and episode
  [
    'Series.and.a.Title.1013.720p.HDTV.X264-DIMENSION',
    { seriesTitle: 'Series and a Title', seasons: [10], episodeNumbers: [13] },
  ],
  [
    'Series Title - 1012 - Episode Title',
    { seriesTitle: 'Series Title', seasons: [10], episodeNumbers: [12] },
  ],
  [
    'Series Title - 0102 [720p]',
    { seriesTitle: 'Series Title', seasons: [1], episodeNumbers: [2] },
  ],
  [
    'Different show 1. Bölüm (23.10.2023) 720p WebDL AAC H.264 - TURG',
    { seriesTitle: 'Different show', episodeNumbers: [1] },
  ],
  [
    'Series_Title_2_[01]_[AniLibria_TV]_[WEBRip_1080p]',
    { seriesTitle: 'Series Title 2', episodeNumbers: [1] },
  ],
  [
    'Series Title - [02x01] - Episode 1',
    { seriesTitle: 'Series Title', seasons: [2], episodeNumbers: [1] },
  ],
  ['1x1', { seasons: [1], episodeNumbers: [1] }],
];

// File extensions, CRC hashes and empty brackets are not episode titles
const junkRemainderCases = [
  '[HorribleSubs] Shirobako - 20 [720p].mkv',
  '[Hatsuyuki] Series Title - 363 [848x480][ADE35E38].mkv',
  'Tokyo Ghoul: RE S2 - Episode 4 VOSTFR (1080p)',
  '[Group] Series Title - 05 (8246e542).mkv',
];
for (const postTitle of junkRemainderCases) {
  it(`does not keep junk in the remainder for "${postTitle}"`, () => {
    const remainder = parseSeason(postTitle)?.remainder;
    expect(remainder ?? '').not.toMatch(/mkv|\[\s*\]|\(\s*\)|ADE35E38|8246e542/i);
  });
}
for (const [postTitle, expected] of sonarrPatternCases) {
  it(`parse "${postTitle}"`, () => {
    expect(parseSeason(postTitle)).toMatchObject(expected);
  });
}

const remainderCases: Array<[string, string, number[], number[], string]> = [
  ['The Expanse - S01E02 - The Big Empty', 'The Expanse', [1], [2], 'The Big Empty'],
  [
    'The.Expanse.S01E02.The.Big.Empty.1080p.WEB.H264-GROUP',
    'The Expanse',
    [1],
    [2],
    'The Big Empty',
  ],
  ['Show.S02E02.Episode.Title.1080p.WEB.H264-GROUP', 'Show', [2], [2], 'Episode Title'],
  ['Show.S01E05.Keeping.It.Real.720p.HDTV.x264-GRP', 'Show', [1], [5], 'Keeping It Real'],
  ['Show.S01E05.Body.Cam.1080p.WEB.H264-GRP', 'Show', [1], [5], 'Body Cam'],
  ['Show.S01E05.Episode.Title.CAM.XviD-GRP.mkv', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Episode.Title.SCREENER.XviD-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Episode.Title.Screener.XviD-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Episode.Title.DVD.SCREENER.XviD-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Episode.Title.CAM.AAC.2.0-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.PAL.Joey.mkv', 'Show', [1], [5], 'PAL Joey'],
  ['Show.S01E05.PAL.mkv', 'Show', [1], [5], 'PAL'],
  ['Show.S01E05.Episode.Title.PAL.DVDRip.XviD-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.My.PAL.Joey.mkv', 'Show', [1], [5], 'My PAL Joey'],
  ['Show.S01E05.My.PAL.Joey.1080p.WEB.H264-GRP', 'Show', [1], [5], 'My PAL Joey'],
  ['Show.S01E05.My.PAL.mkv', 'Show', [1], [5], 'My PAL'],
  ['Show.S01E05.Episode.Title.REAL.PROPER.720p.HDTV.x264-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Episode.Title.REPACK.1080p.WEB.H264-GRP', 'Show', [1], [5], 'Episode Title'],
  ['show.s01e05.episode.title.repack.1080p.web.h264-grp', 'show', [1], [5], 'episode title'],
  // Language tags right before the release tags aren't part of the episode title, in any case
  ['Show.S01E05.Episode.Title.German.DL.1080p.WEB.H264-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Episode.Title.iTALiAN.720p.HDTV.x264-GRP', 'Show', [1], [5], 'Episode Title'],
  ['show.s01e05.episode.title.german.1080p.web.h264-grp', 'show', [1], [5], 'episode title'],
  ['Show.S01E05.The.Russian.1080p.WEB.H264-GRP', 'Show', [1], [5], 'The Russian'],
  ['Show.S01E05.The.Russian.German.DL.1080p.WEB.H264-GRP', 'Show', [1], [5], 'The Russian'],
  // Without release tags a language word is the title
  ['Show.S01E05.Speaking.French.mkv', 'Show', [1], [5], 'Speaking French'],
  ['Show - S01E05 - Speaking French', 'Show', [1], [5], 'Speaking French'],
  ['Show.S01E05.Speaking.French.[Group].mkv', 'Show', [1], [5], 'Speaking French'],
  ['Show.S01E05.Speaking.French[rartv]', 'Show', [1], [5], 'Speaking French'],
  ['Show.S01E05.Speaking.French?.mkv', 'Show', [1], [5], 'Speaking French'],
  // Only one language comes off, the word in front of it is the title
  ['Show.S01E05.Speaking.French.German.DL.1080p.WEB.H264-GRP', 'Show', [1], [5], 'Speaking French'],
  ['show.s01e05.episode.title.multi.french.1080p.web.h264-grp', 'show', [1], [5], 'episode title'],
  ['Show.S01E05.Episode.Title.German.x264-GRP', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Episode.Title.German.x264-GRP.mkv', 'Show', [1], [5], 'Episode Title'],
  // Doubled separators in the name itself aren't a removed tag
  ['Show.S01E05..The.Pilot.mkv', 'Show', [1], [5], 'The Pilot'],
  ['Show.S01E05.:.The.Pilot.mkv', 'Show', [1], [5], 'The Pilot'],
  ['Show.S01E05..Speaking.French.mkv', 'Show', [1], [5], 'Speaking French'],
  ['Show.S01E05.Speaking.French..Part.2.mkv', 'Show', [1], [5], 'Speaking French'],
  ['Show.S01E05.Episode.Title.German.1080p.mkv', 'Show', [1], [5], 'Episode Title'],
  ['Show S01E05  Episode Title.mkv', 'Show', [1], [5], 'Episode Title'],
  ['Show.S01E05.Black.Ice.1080p.WEB.H264-GRP', 'Show', [1], [5], 'Black Ice'],
  // WEB right before the codec is the source
  ['Show.S01E05.The.Dark.Web.WEB.H264-GRP', 'Show', [1], [5], 'The Dark Web'],
  ['Show.S01E05.The.Dark.Web.H264-GRP', 'Show', [1], [5], 'The Dark Web'],
  ['Show.S01E05.Episode.Title.WEBRip.x264-GRP', 'Show', [1], [5], 'Episode Title'],
  [
    'Klassen.S07E370.Et.Vildt.Venskab.DANISH.720p.WEB.h264-LSDK',
    'Klassen',
    [7],
    [370],
    'Et Vildt Venskab',
  ],
  ['Series Title [S01E05] Episode Title', 'Series Title', [1], [5], 'Episode Title'],
  ['Series Title - [02x01-02] - Episode 1', 'Series Title', [2], [1, 2], 'Episode 1'],
];
for (const [postTitle, title, seasons, episodes, remainder] of remainderCases) {
  it(`parses remainder after episode tokens for "${postTitle}"`, () => {
    expect(parseSeason(postTitle)).toMatchObject({
      seriesTitle: title,
      seasons,
      episodeNumbers: episodes,
      remainder,
    });
  });
}

const noRemainderCases: Array<[string]> = [
  ['Great British Railway Journeys S11E03 480p x264-mSD [eztv]'],
  ['The Morning Show S01E01-E03 2019 1080p WEBRip X264 AC3-EVO'],
  // The episode token ends the title, so there is nothing after it
  ['The.Series.S02E15'],
  ['The Series Title! - S01E01-02-03'],
  ['[Judas] Series Title (2024) - S01E14'],
  // Scene flags right after the episode aren't an episode title
  ['Covert.Affairs.S05E09.REAL.PROPER.HDTV.x264-KILLERS'],
  ['Show.S01E05.REPACK.1080p.WEB.H264-GRP'],
  ['Show.S01E05.SCREENER.XviD-GRP.mkv'],
  // Nor are language tags
  ['Babylon.Berlin.S01E05.GERMAN.1080p.WEB.H264-GRP'],
  ['Show.S01E05.German.DL.1080p.WEB.H264-GRP'],
  ['Show.S01E05.German.DL.1080p.mkv'],
  ['Show.S01E05.PAL.DVDRip.XviD-GRP'],
  // Release tags right after the episode leave no episode title
  ['Show.S01E05.1080p.AMZN.WEB-DL.DDP5.1.H.264-GRP'],
  ['Show.S01E05.2160p.ATVP.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX'],
  ['Show.S01E05.1080p.WEB.x264-GRP-postbot'],
  ['Some  Show.S01E05.1080p.WEB.x264-GRP-postbot'],
  ['[REQ]Some..Show.S01E05.1080p.CR.WEB-DL.mkv'],
  ['Orphan Black S05E09 WEBRip 1080p10bit DD5 1 x265 HEVC D0ct0rLew'],
  ['show.s01e05.proper.1080p.web.h264-grp'],
];
for (const [postTitle] of noRemainderCases) {
  it(`does not expose junk remainder for "${postTitle}"`, () => {
    expect(parseSeason(postTitle)).not.toHaveProperty('remainder');
  });
}

const partialSeasonPackCases: Array<[string, string, number, number]> = [
  ['The.Ranch.2016.S02.Part.1.1080p.NF.WEBRip.DD5.1.x264-NTb', 'The Ranch 2016', 2, 1],
  ['Monk.S03D04.DUAL.COMPLETE.BLURAY-iFPD', 'Monk', 3, 4],
  ['Dragon.Ball.Daima.S01D01.COMPLETE.BLURAY-ANiMANiAKS', 'Dragon Ball Daima', 1, 1],
  [
    'The.Walking.Dead.Dead.City.S03D02.COMPLETE.BLURAY-BROADCAST',
    'The Walking Dead Dead City',
    3,
    2,
  ],
];
for (const [postTitle, title, season, seasonPart] of partialSeasonPackCases) {
  it(`parse partial season release "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seasons[0]).toEqual(season);
    expect(result.seasonPart).toBe(seasonPart);
    expect(result.seriesTitle).toBe(title);
    expect(result.isPartialSeason).toBe(true);
  });
}

it('keeps representative season parser shapes working', () => {
  expect(
    parseSeason('Jimmy Fallon 2019 10 23 Michael Douglas 1080p HEVC x265-MeGusta'),
  ).toMatchObject({
    seriesTitle: 'Jimmy Fallon',
    airDate: new Date(2019, 9, 23),
  });
  expect(parseSeason('The Simpsons S01 - S10 FIXED MegaPack x264 AC3-DTS -jlw')).toMatchObject({
    seriesTitle: 'The Simpsons',
    seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isMultiSeason: true,
  });
  expect(parseSeason('The.Ranch.2016.S02.Part.1.1080p.NF.WEBRip.DD5.1.x264-NTb')).toMatchObject({
    seriesTitle: 'The Ranch 2016',
    seasons: [2],
    isPartialSeason: true,
    seasonPart: 1,
  });
  expect(parseSeason('Lie.to.Me.S03.SUBPACK.DVDRip.XviD-REWARD')).toMatchObject({
    seriesTitle: 'Lie to Me',
    seasons: [3],
    fullSeason: true,
    isSeasonExtra: true,
  });
  expect(parseSeason('Great British Railway Journeys S11E03 480p x264-mSD [eztv]')).toMatchObject({
    seriesTitle: 'Great British Railway Journeys',
    seasons: [11],
    episodeNumbers: [3],
  });
  expect(parseSeason('[HorribleSubs] Shirobako - 20 [720p].mkv')).toMatchObject({
    seriesTitle: 'Shirobako',
    episodeNumbers: [20],
  });
});

const miniseriesPartWordCases: Array<[string, string, number]> = [
  ['Mini.Series.Part.One.720p.HDTV.x264-GRP', 'Mini Series', 1],
  ['Band.of.Brothers.Part.Three.720p.BluRay.x264-GRP', 'Band of Brothers', 3],
];
for (const [postTitle, title, episode] of miniseriesPartWordCases) {
  it(`parse miniseries part word "${postTitle}"`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seriesTitle).toBe(title);
    expect(result.episodeNumbers).toEqual([episode]);
  });
}

const crapCases: Array<[string]> = [
  ['76El6LcgLzqb426WoVFg1vVVVGx4uCYopQkfjmLe'],
  ['Vrq6e1Aba3U amCjuEgV5R2QvdsLEGYF3YQAQkw8'],
  ['TDAsqTea7k4o6iofVx3MQGuDK116FSjPobMuh8oB'],
  ['yp4nFodAAzoeoRc467HRh1mzuT17qeekmuJ3zFnL'],
  ['oxXo8S2272KE1 lfppvxo3iwEJBrBmhlQVK1gqGc'],
  ['dPBAtu681Ycy3A4NpJDH6kNVQooLxqtnsW1Umfiv'],
  // searching for password seems weird to block
  // ['password - "bdc435cb-93c4-4902-97ea-ca00568c3887.337" yEnc'],
  ['185d86a343e39f3341e35c4dad3f9959'],
  ['ba27283b17c00d01193eacc02a8ba98eeb523a76'],
  ['45a55debe3856da318cc35882ad07e43cd32fd15'],
  ['86420f8ee425340d8894bf3bc636b66404b95f18'],
  ['ce39afb7da6cf7c04eba3090f0a309f609883862'],
  ['THIS SHOULD NEVER PARSE'],
  ['Vh1FvU3bJXw6zs8EEUX4bMo5vbbMdHghxHirc.mkv'],
  ['0e895c37245186812cb08aab1529cf8ee389dd05.mkv'],
  ['08bbc153931ce3ca5fcafe1b92d3297285feb061.mkv'],
  ['185d86a343e39f3341e35c4dad3ff159'],
  ['ah63jka93jf0jh26ahjas961.mkv'],
  ['qrdSD3rYzWb7cPdVIGSn4E7'],
  ['QZC4HDl7ncmzyUj9amucWe1ddKU1oFMZDd8r0dEDUsTd'],
  ['abc.xyz.S01E01.720p.HDTV.x264-GRP'],
  ['ABCDEFGHIJK123'],
];
for (const [title] of crapCases) {
  it(`should not parse ${title}`, () => {
    expect(parseSeason(title)).toBeNull();
  });
}

const oddCases: Array<[string, string, number, number]> = [
  ['Curb Your Enthusiasm - 2x09 - The Baptism.mkv', 'Curb Your Enthusiasm', 2, 9],
];
for (const [postTitle, title, season, episodeNumber] of oddCases) {
  it(`should not parse ${postTitle}`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seriesTitle).toBe(title);
    expect(result.seasons.length).toBe(1);
    expect(result.seasons[0]).toBe(season);
    expect(result.episodeNumbers.length).toBe(1);
    expect(result.episodeNumbers[0]).toBe(episodeNumber);
  });
}

const animeSpecialCases: Array<[string, string, number]> = [
  ['[DeadFish] Kenzen Robo Daimidaler - 01 - Special [BD][720p][AAC]', 'Kenzen Robo Daimidaler', 1],
  ['[DeadFish] Kenzen Robo Daimidaler - 01 - OVA [BD][720p][AAC]', 'Kenzen Robo Daimidaler', 1],
  ['[DeadFish] Kenzen Robo Daimidaler - 01 - OVD [BD][720p][AAC]', 'Kenzen Robo Daimidaler', 1],
];
for (const [postTitle, title, episodeNumber] of animeSpecialCases) {
  it(`parse anime title ${postTitle}`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seriesTitle).toBe(title);
    expect(result.episodeNumbers.length).toBe(1);
    expect(result.episodeNumbers[0]).toBe(episodeNumber);
    expect(result.isSpecial).toBe(true);
  });
}

const animeRecapCases: Array<[string, string, number]> = [
  ['[HorribleSubs] Goblin Slayer - 10.5 [1080p].mkv', 'Goblin Slayer', 10.5],
];
for (const [postTitle, title, specialEpisodeNumber] of animeRecapCases) {
  it(`handle anime recap episodes ${postTitle}`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seriesTitle).toBe(title);
    expect(result.episodeNumbers.length).toBe(1);
    expect(result.episodeNumbers[0]).toBe(specialEpisodeNumber);
    expect(result.isSpecial).toBe(true);
    expect(result.fullSeason).toBe(false);
  });
}

const seasonSubpackCases: Array<[string, string, number]> = [
  ['Lie.to.Me.S03.SUBPACK.DVDRip.XviD-REWARD', 'Lie to Me', 3],
  ['The.Middle.S02.SUBPACK.DVDRip.XviD-REWARD', 'The Middle', 2],
  ['CSI.S11.SUBPACK.DVDRip.XviD-REWARD', 'CSI', 11],
];
for (const [postTitle, title, season] of seasonSubpackCases) {
  it(`parse season subpack ${postTitle}`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seasons[0]).toBe(season);
    expect(result.seriesTitle).toBe(title);
    expect(result.isSeasonExtra).toBe(true);
    expect(result.fullSeason).toBe(true);
  });
}

const seasonExtraCases: Array<[string, string, number]> = [
  ['Acropolis Now S05 EXTRAS DVDRip XviD RUNNER', 'Acropolis Now', 5],
  ['Punky Brewster S01 EXTRAS DVDRip XviD RUNNER', 'Punky Brewster', 1],
  ['Instant Star S03 EXTRAS DVDRip XviD OSiTV', 'Instant Star', 3],
  ['The.Flash.S03.Extras.01.Deleted.Scenes.720p', 'The Flash', 3],
  ['The.Flash.S03.Extras.02.720p', 'The Flash', 3],
];
for (const [postTitle, title, season] of seasonExtraCases) {
  it(`parse season extras ${postTitle}`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seasons[0]).toBe(season);
    expect(result.seriesTitle).toBe(title);
    expect(result.isSeasonExtra).toBe(true);
    expect(result.fullSeason).toBe(true);
  });
}

// const animePackCases: Array<[string, string, number]> = [
//   ['[Vivid] Living Sky Saga S01 [Web][MKV][h264 10-bit][1080p][AAC 2.0]', 'Living Sky Saga', 1],
// ];
// for (const [postTitle, title, seasonNumber] of animePackCases) {
//   it(`parse anime season packs ${postTitle}`, () =>  {
//     const result = parseSeason(postTitle)!;
//     t.is(result.seriesTitle, title);
//     t.is(result.fullSeason, true);
//     t.is(result.seasons.length, 1);
//     t.is(result.seasons[0], seasonNumber);
//   });
// }

const absoluteEpisodeRangeCases: Array<[string, string, number[]]> = [
  ['Anime Range ep01-12 [ABCDEF12]', 'Anime Range', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
  ['Anime Range 1-10 [ABCDEF12]', 'Anime Range', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
];
for (const [postTitle, title, episodeNumbers] of absoluteEpisodeRangeCases) {
  it(`expands absolute episode ranges ${postTitle}`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seriesTitle).toBe(title);
    expect(result.episodeNumbers).toEqual(episodeNumbers);
  });
}

it('maps absolute-only range captures using the absolute range end', () => {
  const title = 'Anime Range ep01-12';
  const match = /^(?<title>.+?)\s+ep(?<absoluteepisode>\d{2})-(?<absoluteepisode1>\d{2})/i.exec(
    title,
  )!;

  expect(parseMatchCollection(match, title)?.episodeNumbers).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
});

it('ignores incomplete air date capture bags in the generic parser', () => {
  const title = 'Show 2020';
  const match = /^(?<title>.+?)\s+(?<airyear>\d{4})/i.exec(title)!;

  expect(parseMatchCollection(match, title)).toBeNull();
});

it('rejects impossible air dates instead of rolling them into another month', () => {
  const title = 'Show 2020 02 31 720p';
  const match = /^(?<title>.+?)\s+(?<airyear>\d{4})\s+(?<airmonth>\d{2})\s+(?<airday>\d{2})/i.exec(
    title,
  )!;

  expect(parseMatchCollection(match, title)).toBeNull();
  expect(parseSeason(title)).toBeNull();
});

it('rejects future air dates without throwing', () => {
  expect(() => parseSeason('Show 2999 01 01 720p')).not.toThrow();
  expect(parseSeason('Show 2999 01 01 720p')).toBeNull();
});

it('does not expand descending absolute episode ranges', () => {
  const result = parseSeason('Anime Range ep12-01 [ABCDEF12]');
  expect(result?.episodeNumbers).not.toEqual([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
});

const absoluteEpisodeCases: Array<[string, string, number, number]> = [
  ['[SubDESU]_High_School_DxD_07_(1280x720_x264-AAC)_[6B7FD717]', 'High School DxD', 7, 0],
  ['[Chihiro]_Working!!_-_06_[848x480_H.264_AAC][859EEAFA]', 'Working!!', 6, 0],
  ['[Commie]_Senki_Zesshou_Symphogear_-_11_[65F220B4]', 'Senki Zesshou Symphogear', 11, 0],
  ['[Underwater]_Rinne_no_Lagrange_-_12_(720p)_[5C7BC4F9]', 'Rinne no Lagrange', 12, 0],
  ['[Commie]_Rinne_no_Lagrange_-_15_[E76552EA]', 'Rinne no Lagrange', 15, 0],
  ['[HorribleSubs]_Hunter_X_Hunter_-_33_[720p]', 'Hunter X Hunter', 33, 0],
  ['[HorribleSubs]_Fairy_Tail_-_145_[720p]', 'Fairy Tail', 145, 0],
  ['[HorribleSubs] Tonari no Kaibutsu-kun - 13 [1080p].mkv', 'Tonari no Kaibutsu-kun', 13, 0],
  [
    '[Doremi].Yes.Pretty.Cure.5.Go.Go!.31.[1280x720].[C65D4B1F].mkv',
    'Yes Pretty Cure 5 Go Go!',
    31,
    0,
  ],
  ['[K-F] One Piece 214', 'One Piece', 214, 0],
  ['[K-F] One Piece S10E14 214', 'One Piece', 214, 10],
  ['[K-F] One Piece 10x14 214', 'One Piece', 214, 10],
  ['[K-F] One Piece 214 10x14', 'One Piece', 214, 10],
  ['Bleach - 031 - The Resolution to Kill [Lunar].avi', 'Bleach', 31, 0],
  ['Bleach - 031 - The Resolution to Kill [Lunar]', 'Bleach', 31, 0],
  ['[ACX]Hack Sign 01 Role Play [Kosaka] [9C57891E].mkv', 'Hack Sign', 1, 0],
  ['[SFW-sage] Bakuman S3 - 12 [720p][D07C91FC]', 'Bakuman S3', 12, 0],
  ['ducktales_e66_time_is_money_part_one_marking_time', 'ducktales', 66, 0],
  ['[Underwater-FFF] No Game No Life - 01 (720p) [27AAA0A0].mkv', 'No Game No Life', 1, 0],
  ['[FroZen] Miyuki - 23 [DVD][7F6170E6]', 'Miyuki', 23, 0],
  ['[Commie] Yowamushi Pedal - 32 [0BA19D5B]', 'Yowamushi Pedal', 32, 0],
  [
    '[Doki] Mahouka Koukou no Rettousei - 07 (1280x720 Hi10P AAC) [80AF7DDE]',
    'Mahouka Koukou no Rettousei',
    7,
    0,
  ],
  ['[HorribleSubs] Yowamushi Pedal - 32 [480p]', 'Yowamushi Pedal', 32, 0],
  ['[CR] Sailor Moon - 004 [480p][48CE2D0F]', 'Sailor Moon', 4, 0],
  ['[Chibiki] Puchimas!! - 42 [360p][7A4FC77B]', 'Puchimas!!', 42, 0],
  ['[HorribleSubs] Yowamushi Pedal - 32 [1080p]', 'Yowamushi Pedal', 32, 0],
  ['[HorribleSubs] Love Live! S2 - 07 [720p]', 'Love Live! S2', 7, 0],
  ['[DeadFish] Onee-chan ga Kita - 09v2 [720p][AAC]', 'Onee-chan ga Kita', 9, 0],
  ['[Underwater-FFF] No Game No Life - 01 (720p) [27AAA0A0]', 'No Game No Life', 1, 0],
  ['[S-T-D] Soul Eater Not! - 06 (1280x720 10bit AAC) [59B3F2EA].mkv', 'Soul Eater Not!', 6, 0],
  ['No Game No Life - 010 (720p) [27AAA0A0].mkv', 'No Game No Life', 10, 0],
  ['Initial D Fifth Stage - 01 DVD - Central Anime', 'Initial D Fifth Stage', 1, 0],
  [
    'Initial_D_Fifth_Stage_-_01(DVD)_-_(Central_Anime)[5AF6F1E4].mkv',
    'Initial D Fifth Stage',
    1,
    0,
  ],
  [
    'Initial_D_Fifth_Stage_-_02(DVD)_-_(Central_Anime)[0CA65F00].mkv',
    'Initial D Fifth Stage',
    2,
    0,
  ],
  ['Initial D Fifth Stage - 03 DVD - Central Anime', 'Initial D Fifth Stage', 3, 0],
  [
    'Initial_D_Fifth_Stage_-_03(DVD)_-_(Central_Anime)[629BD592].mkv',
    'Initial D Fifth Stage',
    3,
    0,
  ],
  ['Initial D Fifth Stage - 14 DVD - Central Anime', 'Initial D Fifth Stage', 14, 0],
  [
    'Initial_D_Fifth_Stage_-_14(DVD)_-_(Central_Anime)[0183D922].mkv',
    'Initial D Fifth Stage',
    14,
    0,
  ],
  ['[ChihiroDesuYo].No.Game.No.Life.-.09.1280x720.10bit.AAC.[24CCE81D]', 'No Game No Life', 9, 0],
  ['Fairy Tail - 001 - Fairy Tail', 'Fairy Tail', 1, 0],
  ['Fairy Tail - 049 - The Day of Fated Meeting', 'Fairy Tail', 49, 0],
  ['Fairy Tail - 050 - Special Request Watch Out for the Guy You Like!', 'Fairy Tail', 50, 0],
  ['Fairy Tail - 099 - Natsu vs. Gildarts', 'Fairy Tail', 99, 0],
  ['Fairy Tail - 100 - Mest', 'Fairy Tail', 100, 0],
  ['[Exiled-Destiny] Angel Beats Ep01 (D2201EC5).mkv', 'Angel Beats', 1, 0],
  ['[Commie] Nobunaga the Fool - 23 [5396CA24].mkv', 'Nobunaga the Fool', 23, 0],
  ['[FFF] Seikoku no Dragonar - 01 [1FB538B5].mkv', 'Seikoku no Dragonar', 1, 0],
  ['[Hatsuyuki]Fate_Zero-01[1280x720][122E6EF8]', 'Fate Zero', 1, 0],
  ['[CBM]_Monster_-_11_-_511_Kinderheim_[6C70C4E4].mkv', 'Monster', 11, 0],
  ['[HorribleSubs] Log Horizon 2 - 05 [720p].mkv', 'Log Horizon 2', 5, 0],
  ['[Commie] Log Horizon 2 - 05 [FCE4D070].mkv', 'Log Horizon 2', 5, 0],
  ['[DRONE]Series.Title.100', 'Series Title', 100, 0],
  ['[RlsGrp]Series.Title.2010.S01E01.001.HDTV-720p.x264-DTS', 'Series Title 2010', 1, 1],
  [
    'Dragon Ball Kai - 130 - Found You, Gohan! Harsh Training in the Kaioshin Realm! [Baaro][720p][5A1AD35B].mkv',
    'Dragon Ball Kai',
    130,
    0,
  ],
  [
    'Dragon Ball Kai - 131 - A Merged Super-Warrior Is Born, His Name Is Gotenks!! [Baaro][720p][32E03F96].mkv',
    'Dragon Ball Kai',
    131,
    0,
  ],
  ['[HorribleSubs] Magic Kaito 1412 - 01 [1080p]', 'Magic Kaito 1412', 1, 0],
  [
    '[Jumonji-Giri]_[F-B]_Kagihime_Monogatari_Eikyuu_Alice_Rondo_Ep04_(0b0e2c10).mkv',
    'Kagihime Monogatari Eikyuu Alice Rondo',
    4,
    0,
  ],
  [
    '[Jumonji-Giri]_[F-B]_Kagihime_Monogatari_Eikyuu_Alice_Rondo_Ep08_(8246e542).mkv',
    'Kagihime Monogatari Eikyuu Alice Rondo',
    8,
    0,
  ],
  ['Knights of Sidonia - 01 [1080p 10b DTSHD-MA eng sub].mkv', 'Knights of Sidonia', 1, 0],
  ['Series Title (2010) {01} Episode Title (1).hdtv-720p', 'Series Title (2010)', 1, 0],
  ['[HorribleSubs] Shirobako - 20 [720p].mkv', 'Shirobako', 20, 0],
  [
    '[Hatsuyuki] Dragon Ball Kai (2014) - 017 (115) [1280x720][B2CFBC0F]',
    'Dragon Ball Kai (2014)',
    17,
    0,
  ],
  [
    '[Hatsuyuki] Dragon Ball Kai (2014) - 018 (116) [1280x720][C4A3B16E]',
    'Dragon Ball Kai (2014)',
    18,
    0,
  ],
  [
    'Dragon Ball Kai (2014) - 39 (137) [v2][720p.HDTV][Unison Fansub]',
    'Dragon Ball Kai (2014)',
    39,
    0,
  ],
  ['[HorribleSubs] Eyeshield 21 - 101 [480p].mkv', 'Eyeshield 21', 101, 0],
  [
    '[Cthuyuu].Taimadou.Gakuen.35.Shiken.Shoutai.-.03.[720p.H264.AAC][8AD82C3A]',
    'Taimadou Gakuen 35 Shiken Shoutai',
    3,
    0,
  ],
  [
    '[Cthuyuu] Taimadou Gakuen 35 Shiken Shoutai - 03 [720p H264 AAC][8AD82C3A]',
    'Taimadou Gakuen 35 Shiken Shoutai',
    3,
    0,
  ],
  ['Dragon Ball Super Episode 56 [VOSTFR V2][720p][AAC]-Mystic Z-Team', 'Dragon Ball Super', 56, 0],
  [
    '[Mystic Z-Team] Dragon Ball Super Episode 69 [VOSTFR_Finale][1080p][AAC].mp4',
    'Dragon Ball Super',
    69,
    0,
  ],
  ['[Shark-Raws] Crayon Shin-chan #957 (NBN 1280x720 x264 AAC).mp4', 'Crayon Shin-chan', 957, 0],
  ['Love Rerun EP06 720p x265 AOZ.mp4', 'Love Rerun', 6, 0],
  ['Love Rerun 2018 EP06 720p x265 AOZ.mp4', 'Love Rerun 2018', 6, 0],
  ['Love Rerun 2018 06 720p x265 AOZ.mp4', 'Love Rerun 2018', 6, 0],
  [
    "Boku No Hero Academia S03 - EP14 VOSTFR [1080p] [HardSub] Yass'Kun",
    'Boku No Hero Academia S03',
    14,
    0,
  ],
  ['Boku No Hero Academia S3 -  15 VOSTFR [720p]', 'Boku No Hero Academia S3', 15, 0],
  ['Tokyo Ghoul: RE S2 - Episode 4 VOSTFR (1080p)', 'Tokyo Ghoul RE S2', 4, 0],
  ['To Aru Majutsu no Index III - Episode 5 VOSTFR (1080p)', 'To Aru Majutsu no Index III', 5, 0],
  ['[Prout] Steins;Gate 0 - Episode 5 VOSTFR (BDRip 1920x1080 x264 FLAC)', 'Steins;Gate 0', 5, 0],
  [
    '[BakedFish] Nakanohito Genome [Jikkyouchuu] - 01 [720p][AAC].mp4',
    'Nakanohito Genome [Jikkyouchuu]',
    1,
    0,
  ],
  ['Abc x Abc (2011) - 141 - Magician [KaiDubs] [1080p]', 'Abc x Abc (2011)', 141, 0],
  ['Abc Abc 484 VOSTFR par Abc-Abc (1280*720) - version MQ', 'Abc Abc', 484, 0],
  [
    'Abc - Abc Abc Abc - 107 VOSTFR par Fansub-Miracle Sharingan (1920x1080) - HQ_Draft',
    'Abc - Abc Abc Abc',
    107,
    0,
  ],
  [
    'Abc Abc Abc Abc Episode 10 VOSTFR (1920x1080) Miracle Sharingan Fansub.MKV - Team - (� suivre)',
    'Abc Abc Abc Abc',
    10,
    0,
  ],
  [
    'Great British Railway Journeys S11E03 480p x264-mSD [eztv]',
    'Great British Railway Journeys',
    3,
    11,
  ],
  ['Radiant S02E14 480p x264-mSD [eztv]', 'Radiant', 14, 2],
  ['This Hour Has 22 Minutes S27E11 480p x264-mSD [eztv]', 'This Hour Has 22 Minutes', 11, 27],
  ['Tatort.E1003.Dunkelfeld.GERMAN.1080p.WEBRip.x264-TMSF', 'Tatort', 1003, 0],
];
for (const [postTitle, title, absoluteEpisodeNumber, seasonNumber] of absoluteEpisodeCases) {
  it(`parse absolute episode numbers ${postTitle}`, () => {
    const result = parseSeason(postTitle)!;
    expect(result.seriesTitle).toBe(title);
    expect(result.episodeNumbers.length).toBe(1);
    expect(result.episodeNumbers[0]).toBe(absoluteEpisodeNumber);
    expect(result.seasons[0] ?? 0).toBe(seasonNumber);
    expect(result.isSpecial).toBe(false);
    expect(result.fullSeason).toBe(false);
  });
}
