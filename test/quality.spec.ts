import { expect, it } from 'vitest';

import {
  parseQuality,
  parseQualityModifyers,
  QualityModifier,
  Resolution,
  Source,
} from '../src/index.js';

const versionCases: [string, number][] = [
  ['Chuck.S04E05.HDTV.XviD-LOL', 1],
  ['Gold.Rush.S04E05.Garnets.or.Gold.REAL.REAL.PROPER.HDTV.x264-W4F', 2],
  ['Chuck.S03E17.REAL.PROPER.720p.HDTV.x264-ORENJI-RP', 2],
  ['Covert.Affairs.S05E09.REAL.PROPER.HDTV.x264-KILLERS', 2],
  ['Mythbusters.S14E01.REAL.PROPER.720p.HDTV.x264-KILLERS', 2],
  ['Orange.Is.the.New.Black.s02e06.real.proper.720p.webrip.x264-2hd', 2],
  ['Top.Gear.S21E07.Super.Duper.Real.Proper.HDTV.x264-FTP', 2],
  ['Top.Gear.S21E07.PROPER.HDTV.x264-RiVER-RP', 2],
  ['House.S07E11.PROPER.REAL.RERIP.1080p.BluRay.x264-TENEIGHTY', 2],
  ['[MGS] - Kuragehime - Episode 02v2 - [D8B6C90D]', 2],
  ['[Hatsuyuki] Tokyo Ghoul - 07 [v2][848x480][23D8F455].avi', 2],
  ['[DeadFish] Barakamon - 01v3 [720p][AAC]', 3],
  ['[DeadFish] Momo Kyun Sword - 01v4 [720p][AAC]', 4],
  ['[Vivid-Asenshi] Akame ga Kill - 04v2 [266EE983]', 2],
  ['[Vivid-Asenshi] Akame ga Kill - 03v2 [66A05817]', 2],
  ['[Vivid-Asenshi] Akame ga Kill - 02v2 [1F67AB55]', 2],
];

for (const [title, result] of versionCases) {
  it(`parse version "${title}"`, () => {
    expect(parseQualityModifyers(title).version).toBe(result);
  });
}

const realCases: [string, number][] = [
  ['Chuck.S04E05.HDTV.XviD-LOL', 0],
  ['Gold.Rush.S04E05.Garnets.or.Gold.REAL.REAL.PROPER.HDTV.x264-W4F', 2],
  ['Chuck.S03E17.REAL.PROPER.720p.HDTV.x264-ORENJI-RP', 1],
  ['Covert.Affairs.S05E09.REAL.PROPER.HDTV.x264-KILLERS', 1],
  ['Mythbusters.S14E01.REAL.PROPER.720p.HDTV.x264-KILLERS', 1],
  ['Orange.Is.the.New.Black.s02e06.real.proper.720p.webrip.x264-2hd', 0],
  ['Top.Gear.S21E07.Super.Duper.Real.Proper.HDTV.x264-FTP', 0],
  ['Top.Gear.S21E07.PROPER.HDTV.x264-RiVER-RP', 0],
  ['House.S07E11.PROPER.REAL.RERIP.1080p.BluRay.x264-TENEIGHTY', 1],
  ['[MGS] - Kuragehime - Episode 02v2 - [D8B6C90D]', 0],
  ['[Hatsuyuki] Tokyo Ghoul - 07 [v2][848x480][23D8F455].avi', 0],
  ['[DeadFish] Barakamon - 01v3 [720p][AAC]', 0],
  ['[DeadFish] Momo Kyun Sword - 01v4 [720p][AAC]', 0],
  ['The Real Housewives of Some Place - S01E01 - Why are we doing this?', 0],
];

for (const [title, result] of realCases) {
  it(`parse real version "${title}"`, () => {
    expect(parseQualityModifyers(title).real).toBe(result);
  });
}

const webdl480pCases: [string, boolean][] = [
  ['Elementary.S01E10.The.Leviathan.480p.WEB-DL.x264-mSD', false],
  ['Glee.S04E10.Glee.Actually.480p.WEB-DL.x264-mSD', false],
  ['The.Big.Bang.Theory.S06E11.The.Santa.Simulation.480p.WEB-DL.x264-mSD', false],
  ['Da.Vincis.Demons.S02E04.480p.WEB.DL.nSD.x264-NhaNc3', false],
];
for (const [title, proper] of webdl480pCases) {
  it(`parse 480p quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.WEBDL);
    expect(quality.resolution).toBe(Resolution.R480P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const webdl720pCases: [string, boolean][] = [
  ['Arrested.Development.S04E01.720p.WEB.AAC2.0.x264-NFRiP', false],
  ['Vanguard S01E04 Mexicos Death Train 720p WEB DL', false],
  ['Hawaii Five 0 S02E21 720p WEB DL DD5 1 H 264', false],
  ['Castle S04E22 720p WEB DL DD5 1 H 264 NFHD', false],
  ['Chuck - S11E06 - D-Yikes! - 720p WEB-DL.mkv', false],
  ['Sonny.With.a.Chance.S02E15.720p.WEB-DL.DD5.1.H.264-SURFER', false],
  ['S07E23 - [WEBDL].mkv ', false],
  ['Fringe S04E22 720p WEB-DL DD5.1 H264-EbP.mkv', false],
  ['House.S04.720p.Web-Dl.Dd5.1.h264-P2PACK', false],
  ['Da.Vincis.Demons.S02E04.720p.WEB.DL.nSD.x264-NhaNc3', false],
  ['CSI.Miami.S04E25.720p.iTunesHD.AVC-TVS', false],
  ['Castle.S06E23.720p.WebHD.h264-euHD', false],
  ['The.Nightly.Show.2016.03.14.720p.WEB.x264-spamTV', false],
  ['The.Nightly.Show.2016.03.14.720p.WEB.h264-spamTV', false],
  ['Sonny.With.a.Chance.S02E15.720p', false],
  ['[Underwater-FFF] No Game No Life - 01 (720p) [27AAA0A0]', false],
  ['[Doki] Mahouka Koukou no Rettousei - 07 (1280x720 Hi10P AAC) [80AF7DDE]', false],
  ['[Doremi].Yes.Pretty.Cure.5.Go.Go!.31.[1280x720].[C65D4B1F].mkv', false],
  ['[HorribleSubs]_Fairy_Tail_-_145_[720p]', false],
  ['[Eveyuu] No Game No Life - 10 [Hi10P 1280x720 H264][10B23BD8]', false],
  ['Movie.Title.2013.960p.WEB-DL.AAC2.0.H.264-squalor', false],
  ['Movie.Title.2021.DP.WEB.720p.DDP.5.1.H.264.PLEX', false],
];
for (const [title, proper] of webdl720pCases) {
  it(`parse webdl 720 quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.WEBDL);
    expect(quality.resolution).toBe(Resolution.R720P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const webdl1080pCases: [string, boolean][] = [
  ['[HorribleSubs] Yowamushi Pedal - 32 [1080p]', false],
  ['Under the Dome S01E10 Let the Games Begin 1080p', false],
  ['Arrested.Development.S04E01.iNTERNAL.1080p.WEB.x264-QRUS', false],
  ['CSI NY S09E03 1080p WEB DL DD5 1 H264 NFHD', false],
  ['Two and a Half Men S10E03 1080p WEB DL DD5 1 H 264 NFHD', false],
  ['Criminal.Minds.S08E01.1080p.WEB-DL.DD5.1.H264-NFHD', false],
  ['Its.Always.Sunny.in.Philadelphia.S08E01.1080p.WEB-DL.proper.AAC2.0.H.264', true],
  ['Two and a Half Men S10E03 1080p WEB DL DD5 1 H 264 REPACK NFHD', true],
  ['Glee.S04E09.Swan.Song.1080p.WEB-DL.DD5.1.H.264-ECI', false],
  ['The.Big.Bang.Theory.S06E11.The.Santa.Simulation.1080p.WEB-DL.DD5.1.H.264', false],
  ["Rosemary's.Baby.S01E02.Night.2.[WEBDL-1080p].mkv", false],
  ['The.Nightly.Show.2016.03.14.1080p.WEB.x264-spamTV', false],
  ['The.Nightly.Show.2016.03.14.1080p.WEB.h264-spamTV', false],
  ['Psych.S01.1080p.WEB-DL.AAC2.0.AVC-TrollHD', false],
  ['Series Title S06E08 1080p WEB h264-EXCLUSIVE', false],
  ['Series Title S06E08 No One PROPER 1080p WEB DD5 1 H 264-EXCLUSIVE', true],
  ['Series Title S06E08 No One PROPER 1080p WEB H 264-EXCLUSIVE', true],
  ['The.Simpsons.S25E21.Pay.Pal.1080p.WEB-DL.DD5.1.H.264-NTb', false],
  ['The.Simpsons.2017.1080p.WEB-DL.DD5.1.H.264.Remux.-NTb', false],
  ['Movie.Name.2019.1080p.AMZN.WEB-DL.DDP5.1.H.264-NTG', false],
  ['Movie.Name.2020.1080p.AMZN.WEB...', false],
  ['Movie.Name.2020.1080p.AMZN.WEB.', false],
  ['Movie Title - 2020 1080p Viva MKV WEB', false],
  [
    '[HorribleSubs] Movie Title! 2018 [Web][MKV][h264][1080p][AAC 2.0][Softsubs (HorribleSubs)]',
    false,
  ],
  ['Movie.Title.2020.MULTi.1080p.WEB.H264-ALLDAYiN (S:285/L:11)', false],
  ['Movie Title (2020) MULTi WEB 1080p x264-JiHEFF (S:317/L:28)', false],
  ['Movie.Titles.2020.1080p.NF.WEB.DD2.0.x264-SNEAkY', false],
  ['The.Movie.2022.NORDiC.1080p.DV.HDR.WEB.H 265-NiDHUG', false],
  ['Movie Title 2018 [WEB 1080p HEVC Opus] [Netaro]', false],
  ['Movie Title 2018 (WEB 1080p HEVC Opus) [Netaro]', false],
];
for (const [title, proper] of webdl1080pCases) {
  it(`parse webdl 1080 quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.WEBDL);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const webrip1080pCases: [string, boolean][] = [
  ['Movie.Name.S04E01.iNTERNAL.1080p.WEBRip.x264-QRUS', false],
  ['Movie.Name.1x04.ITA.1080p.WEBMux.x264-NovaRip', false],
  [
    'Movie.Name.2019.S02E07.Chapter.15.The.Believer.4Kto1080p.DSNYP.Webrip.x265.10bit.EAC3.5.1.Atmos.GokiTAoE',
    false,
  ],
  ['Movie.Title.2019.1080p.AMZN.WEB-Rip.DDP.5.1.HEVC', false],
];
for (const [title, proper] of webrip1080pCases) {
  it(`parse webrip 1080 quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.WEBRIP);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const webdl2160pCases: [string, boolean][] = [
  ['CASANOVA S01E01.2160P AMZN WEB DD2.0 HI10P X264-TROLLUHD', false],
  ['JUST ADD MAGIC S01E01.2160P AMZN WEB DD2.0 X264-TROLLUHD', false],
  ['The.Man.In.The.High.Castle.S01E01.2160p.AMZN.WEBDL.DD2.0.Hi10p.X264-TrollUHD', false],
  ['The Man In the High Castle S01E01 2160p AMZN WEBDL DD2.0 Hi10P x264-TrollUHD', false],
  ['The.Nightly.Show.2016.03.14.2160p.WEB.x264-spamTV', false],
  ['The.Nightly.Show.2016.03.14.2160p.WEB.h264-spamTV', false],
  ['The.Nightly.Show.2016.03.14.2160p.WEB.PROPER.h264-spamTV', true],
];
for (const [title, proper] of webdl2160pCases) {
  it(`parse webdl 2160 quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.WEBDL);
    expect(quality.resolution).toBe(Resolution.R2160P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const bluray720Cases: [string, boolean][] = [
  ['WEEDS.S03E01-06.DUAL.Bluray.AC3.-HELLYWOOD.avi', false],
  ['Chuck - S01E03 - Come Fly With Me - 720p BluRay.mkv', false],
  ['Revolution.S01E02.Chained.Heat.[Bluray720p].mkv', false],
  ['[FFF] DATE A LIVE - 01 [BD][720p-AAC][0601BED4]', false],
  ['[coldhell] Pupa v2 [BD720p][03192D4C]', true],
  ['[RandomRemux] Nobunagun - 01 [720p BD][043EA407].mkv', false],
  ['[Kaylith] Isshuukan Friends Specials - 01 [BD 720p AAC][B7EEE164].mkv', false],
  ['WEEDS.S03E01-06.DUAL.Blu-ray.AC3.-HELLYWOOD.avi', false],
  ['WEEDS.S03E01-06.DUAL.720p.Blu-ray.AC3.-HELLYWOOD.avi', false],
  ['[Elysium]Lucky.Star.01(BD.720p.AAC.DA)[0BB96AD8].mkv', false],
  ['Battlestar.Galactica.S01E01.33.720p.HDDVD.x264-SiNNERS.mkv', false],
  ['The.Expanse.S01E07.RERIP.720p.BluRay.x264-DEMAND', true],
  ['John.Carpenter.Live.Retrospective.2016.2018.720p.MBluRay.x264-CRUELTY.mkv', false],
  ['Heart.Live.In.Atlantic.City.2019.720p.MBLURAY.x264-MBLURAYFANS.mkv', false],
  [
    'Opeth.Garden.Of.The.Titans.Live.At.Red.Rocks.Amphitheatre.2017.720p.MBluRay.x264-TREBLE.mkv',
    false,
  ],
];
for (const [title, proper] of bluray720Cases) {
  it(`parse bluray 720p quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R720P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const bluray1080Cases: [string, boolean][] = [
  ['Chuck - S01E03 - Come Fly With Me - 1080p BluRay.mkv', false],
  ['Sons.Of.Anarchy.S02E13.1080p.BluRay.x264-AVCDVD', false],
  ['Revolution.S01E02.Chained.Heat.[Bluray1080p].mkv', false],
  ['[FFF] Namiuchigiwa no Muromi-san - 10 [BD][1080p-FLAC][0C4091AF]', false],
  ['[coldhell] Pupa v2 [BD1080p][5A45EABE].mkv', true],
  ['[Kaylith] Isshuukan Friends Specials - 01 [BD 1080p FLAC][429FD8C7].mkv', false],
  ['[Zurako] Log Horizon - 01 - The Apocalypse (BD 1080p AAC) [7AE12174].mkv', false],
  ['WEEDS.S03E01-06.DUAL.1080p.Blu-ray.AC3.-HELLYWOOD.avi', false],
  ['[Coalgirls]_Durarara!!_01_(1920x1080_Blu-ray_FLAC)_[8370CB8F].mkv', false],
  ['John.Carpenter.Live.Retrospective.2016.2018.1080p.MBluRay.x264-CRUELTY.mkv', false],
  ['Heart.Live.In.Atlantic.City.2019.1080p.MBLURAY.x264-MBLURAYFANS.mkv', false],
  [
    'Opeth.Garden.Of.The.Titans.Live.At.Red.Rocks.Amphitheatre.2017.1080p.MBluRay.x264-TREBLE.mkv',
    false,
  ],
];
for (const [title, proper] of bluray1080Cases) {
  it(`parse bluray 1080p quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const bluray576pQuality: [string][] = [
  ['Movie.Name.2004.576p.BDRip.x264-HANDJOB'],
  ['Hannibal.S01E05.576p.BluRay.DD5.1.x264-HiSD'],
];
for (const [title] of bluray576pQuality) {
  it(`parse bluray 576 quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R576P);
    expect(quality.modifier).toBe(null);
  });
}

const remux1080pQuality: [string][] = [
  ['Contract.to.Kill.2016.REMUX.1080p.BluRay.AVC.DTS-HD.MA.5.1-iFT'],
  ['27.Dresses.2008.REMUX.1080p.Bluray.AVC.DTS-HR.MA.5.1-LEGi0N'],
  ['27.Dresses.2008.BDREMUX.1080p.Bluray.AVC.DTS-HR.MA.5.1-LEGi0N'],
  ['The.Stoning.of.Soraya.M.2008.USA.BluRay.Remux.1080p.MPEG-2.DD.5.1-TDD'],
  ['Wildling.2018.1080p.BluRay.REMUX.MPEG-2.DTS-HD.MA.5.1-EPSiLON'],
];
for (const [title] of remux1080pQuality) {
  it(`parse bluray 1080p remux quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(QualityModifier.REMUX);
  });
}

const remux2160pQuality: [string][] = [
  ['Contract.to.Kill.2016.REMUX.2160p.BluRay.AVC.DTS-HD.MA.5.1-iFT'],
  ['27.Dresses.2008.REMUX.2160p.Bluray.AVC.DTS-HR.MA.5.1-LEGi0N'],
  ['Los Vengadores (2012) [UHDRemux HDR HEVC 2160p][Dolby Atmos TrueHD 7 1 Eng DTS 5 1 Esp]'],
  ['Movie.Name.2008.REMUX.2160p.Bluray.AVC.DTS-HR.MA.5.1-LEGi0N'],
  ['Movie.Title.1980.2160p.UHD.BluRay.Remux.HDR.HEVC.DTS-HD.MA.5.1-PmP.mkv'],
  ['Movie.Title.2016.T1.UHDRemux.2160p.HEVC.Dual.AC3.5.1-TrueHD.5.1.Sub'],
  ['[Dolby Vision] Movie.Title.S07.MULTi.UHD.BLURAY.REMUX.DV-NoTag'],
  ['Movie.Name.2020.German.UHDBD.2160p.HDR10.HEVC.EAC3.DL.Remux-pmHD.mkv'],
  ['Movie Name (2021) [Remux-2160p x265 HDR 10-BIT DTS-HD MA 7.1]-FraMeSToR.mkv'],
];
for (const [title] of remux2160pQuality) {
  it(`parse bluray 2160P remux quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R2160P);
    expect(quality.modifier).toBe(QualityModifier.REMUX);
  });
}

const hdtv720pCases: [string, boolean][] = [
  ['Dexter - S01E01 - Title [HDTV]', false],
  ['Dexter - S01E01 - Title [HDTV-720p]', false],
  ['Pawn Stars S04E87 REPACK 720p HDTV x264 aAF', true],
  ['S07E23 - [HDTV-720p].mkv ', false],
  // ['Chuck - S22E03 - MoneyBART - HD TV.mkv', false],
  ['Two.and.a.Half.Men.S08E05.720p.HDTV.X264-DIMENSION', false],
  ['E:\\Downloads\\tv\\The.Big.Bang.Theory.S01E01.720p.HDTV\\ajifajjjeaeaeqwer_eppj.avi', false],
  ['Gem.Hunt.S01E08.Tourmaline.Nepal.720p.HDTV.x264-DHD', false],
  ['Hells.Kitchen.US.S12E17.HR.WS.PDTV.X264-DIMENSION', false],
  ['Survivorman.The.Lost.Pilots.Summer.HR.WS.PDTV.x264-DHD', false],
];
for (const [title, proper] of hdtv720pCases) {
  it(`parse hdtv 720p quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.TV);
    expect(quality.resolution).toBe(Resolution.R720P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const brdisk1080pCases: [string][] = [
  ['G.I.Joe.Retaliation.2013.BDISO'],
  ['Star.Wars.Episode.III.Revenge.Of.The.Sith.2005.MULTi.COMPLETE.BLURAY-VLS'],
  ['The Dark Knight Rises (2012) Bluray ISO [USENET-TURK]'],
  ['Jurassic Park.1993..BD25.ISO'],
  ['Bait.2012.Bluray.1080p.3D.AVC.DTS-HD.MA.5.1.iso'],
  ['Daylight.1996.Bluray.ISO'],
  ['Justified.Stagione.2.Parte.2.ITA-ENG.1080p.BDMux.DD5.1.x264-DarkSideMux'],
];
for (const [title] of brdisk1080pCases) {
  it(`parse brdisk 1080p quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(QualityModifier.BRDISK);
  });
}

const rawHdCases: [string][] = [['Stripes (1981) 1080i HDTV DD5.1 MPEG2-TrollHD']];
for (const [title] of rawHdCases) {
  it(`parse brdisk 1080p RAWHD quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.TV);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(QualityModifier.RAWHD);
  });
}

const tsCases: [string, boolean][] = [
  ['Despicable.Me.3.2017.720p.TSRip.x264.AAC-Ozlem', false],
  ['The Equalizer 2 2018 720p HD-TS x264-24HD', false],
];
for (const [title, proper] of tsCases) {
  it(`parse telesync quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.TELESYNC);
    expect(quality.resolution).toBe(Resolution.R720P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
}

const bdripCases: [string][] = [
  ['Schindlers.List.1993.REMASTERED.iNTERNAL.UHD.BDRip.x264-LiBRARiANS'],
  ['The.Big.Lebowski.1998.REMASTERED.iNTERNAL.UHD.BDRip.x264-LiBRARiANS'],
  ['Black.Hawk.Down.2001.EXTENDED.PL.UHD.BDRip.x264.INTERNAL-FLAME'],
];
for (const [title] of bdripCases) {
  it(`parse bdrip quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R480P);
    expect(quality.modifier).toBe(null);
  });
}
