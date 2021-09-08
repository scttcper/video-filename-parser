import test from 'ava';

import { parseSeason } from '../src/index.js';

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
  test(`parse full season release "${postTitle}"`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seasons[0], season);
    t.is(result.seriesTitle, title);
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
];
for (const [postTitle, title, airDate] of dayEpisodeCases) {
  test(`parse day season release "${postTitle}"`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seriesTitle, title);
    t.deepEqual(result.airDate, airDate);
    t.is(result.seasons.length, 0);
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
  test(`parse multi season release "${postTitle}"`, t => {
    const result = parseSeason(postTitle)!;
    t.deepEqual(result.seasons, seasons);
    t.is(result.seriesTitle, title);
    t.is(result.isMultiSeason, true);
  });
}

const multiEpisodeCases: Array<[string, string, number[]]> = [
  ['The Morning Show S01E01-E03 2019 1080p WEBRip X264 AC3-EVO', 'The Morning Show', [1, 2, 3]],
];
for (const [postTitle, title, episodes] of multiEpisodeCases) {
  test(`parse multi season release "${postTitle}"`, t => {
    const result = parseSeason(postTitle)!;
    t.deepEqual(result.episodeNumbers, episodes);
    t.is(result.seriesTitle, title);
    t.is(result.isMultiSeason, false);
  });
}

const partialSeasonPackCases: Array<[string, string, number, number]> = [
  ['The.Ranch.2016.S02.Part.1.1080p.NF.WEBRip.DD5.1.x264-NTb', 'The Ranch 2016', 2, 1],
];
for (const [postTitle, title, season, seasonPart] of partialSeasonPackCases) {
  test(`parse partial season release "${postTitle}"`, t => {
    const result = parseSeason(postTitle)!;
    t.deepEqual(result.seasons[0], season);
    t.is(result.seasonPart, seasonPart);
    t.is(result.seriesTitle, title);
    t.is(result.isPartialSeason, true);
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
];
for (const [title] of crapCases) {
  test(`should not parse ${title}`, t => {
    t.is(parseSeason(title), null);
  });
}

const oddCases: Array<[string, string, number, number]> = [
  ['Curb Your Enthusiasm - 2x09 - The Baptism.mkv', 'Curb Your Enthusiasm', 2, 9],
];
for (const [postTitle, title, season, episodeNumber] of oddCases) {
  test(`should not parse ${postTitle}`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seriesTitle, title);
    t.is(result.seasons.length, 1);
    t.is(result.seasons[0], season);
    t.is(result.episodeNumbers.length, 1);
    t.is(result.episodeNumbers[0], episodeNumber);
  });
}

const animeSpecialCases: Array<[string, string, number]> = [
  ['[DeadFish] Kenzen Robo Daimidaler - 01 - Special [BD][720p][AAC]', 'Kenzen Robo Daimidaler', 1],
  ['[DeadFish] Kenzen Robo Daimidaler - 01 - OVA [BD][720p][AAC]', 'Kenzen Robo Daimidaler', 1],
  ['[DeadFish] Kenzen Robo Daimidaler - 01 - OVD [BD][720p][AAC]', 'Kenzen Robo Daimidaler', 1],
];
for (const [postTitle, title, episodeNumber] of animeSpecialCases) {
  test(`parse anime title ${postTitle}`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seriesTitle, title);
    t.is(result.episodeNumbers.length, 1);
    t.is(result.episodeNumbers[0], episodeNumber);
    t.is(result.isSpecial, true);
  });
}

const animeRecapCases: Array<[string, string, number]> = [
  ['[HorribleSubs] Goblin Slayer - 10.5 [1080p].mkv', 'Goblin Slayer', 10.5],
];
for (const [postTitle, title, specialEpisodeNumber] of animeRecapCases) {
  test(`handle anime recap episodes ${postTitle}`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seriesTitle, title);
    t.is(result.episodeNumbers.length, 1);
    t.is(result.episodeNumbers[0], specialEpisodeNumber);
    t.is(result.fullSeason, false);
  });
}

const seasonSubpackCases: Array<[string, string, number]> = [
  ['Lie.to.Me.S03.SUBPACK.DVDRip.XviD-REWARD', 'Lie to Me', 3],
  ['The.Middle.S02.SUBPACK.DVDRip.XviD-REWARD', 'The Middle', 2],
  ['CSI.S11.SUBPACK.DVDRip.XviD-REWARD', 'CSI', 11],
];
for (const [postTitle, title, season] of seasonSubpackCases) {
  test(`parse season subpack ${postTitle}`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seasons[0], season);
    t.is(result.seriesTitle, title);
    t.is(result.isSeasonExtra, true);
    t.is(result.fullSeason, true);
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
  test(`parse season extras ${postTitle}`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seasons[0], season);
    t.is(result.seriesTitle, title);
    t.is(result.isSeasonExtra, true);
    t.is(result.fullSeason, true);
  });
}

// const animePackCases: Array<[string, string, number]> = [
//   ['[Vivid] Living Sky Saga S01 [Web][MKV][h264 10-bit][1080p][AAC 2.0]', 'Living Sky Saga', 1],
// ];
// for (const [postTitle, title, seasonNumber] of animePackCases) {
//   test(`parse anime season packs ${postTitle}`, t => {
//     const result = parseSeason(postTitle)!;
//     t.is(result.seriesTitle, title);
//     t.is(result.fullSeason, true);
//     t.is(result.seasons.length, 1);
//     t.is(result.seasons[0], seasonNumber);
//   });
// }

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
];
for (const [postTitle, title, absoluteEpisodeNumber, seasonNumber] of absoluteEpisodeCases) {
  test(`parse absolute episode numbers ${postTitle}`, t => {
    const result = parseSeason(postTitle)!;
    t.is(result.seriesTitle, title);
    t.is(result.episodeNumbers.length, 1);
    t.is(result.episodeNumbers[0], absoluteEpisodeNumber);
    t.is(result.seasons[0] ?? 0, seasonNumber);
    t.is(result.fullSeason, false);
  });
}
