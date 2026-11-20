import { expect, it } from 'vitest';

import {
  parseQuality,
  parseQualityModifyers,
  QualityModifier,
  Resolution,
  Source,
} from '../src/index.js';

const versionCases: Array<[string, number]> = [
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
  ['Movie.Title.2020.1080p.WEB.h264.v2-GRP', 2],
  ['Movie.V2.2021.1080p.WEB-DL.x264-GRP', 1],
  ['Project.V.2019.1080p.WEB-DL.x264-GRP', 1],
];

for (const [title, result] of versionCases) {
  it(`parse version "${title}"`, () => {
    expect(parseQualityModifyers(title).version).toBe(result);
  });
}

const realCases: Array<[string, number]> = [
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

const repackCases: Array<[string, boolean, number]> = [
  ['Movie Title 2018 REPACK 720p HDTV x264 aAF', true, 2],
  ['Movie.Title.2018.REPACK.720p.HDTV.x264-aAF', true, 2],
  ['Movie.Title.2018.REPACK2.720p.HDTV.x264-aAF', true, 3],
  ['Movie.Title.2018.PROPER.720p.HDTV.x264-aAF', false, 2],
  ['Movie.Title.2018.RERIP.720p.BluRay.x264-DEMAND', true, 2],
  ['Movie.Title.2018.RERIP2.720p.BluRay.x264-DEMAND', true, 3],
];

for (const [title, isRepack, version] of repackCases) {
  it(`parse repack revision "${title}"`, () => {
    const revision = parseQualityModifyers(title);
    expect(revision.version).toBe(version);
    expect(Boolean(revision.isRepack)).toBe(isRepack);
  });
}

const webdl480pCases: Array<[string, boolean]> = [
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

const webdl720pCases: Array<[string, boolean]> = [
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

const webdl1080pCases: Array<[string, boolean]> = [
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

const webrip1080pCases: Array<[string, boolean]> = [
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

const webdl2160pCases: Array<[string, boolean]> = [
  ['CASANOVA S01E01.2160P AMZN WEB DD2.0 HI10P X264-TROLLUHD', false],
  ['JUST ADD MAGIC S01E01.2160P AMZN WEB DD2.0 X264-TROLLUHD', false],
  ['The.Man.In.The.High.Castle.S01E01.2160p.AMZN.WEBDL.DD2.0.Hi10p.X264-TrollUHD', false],
  ['The Man In the High Castle S01E01 2160p AMZN WEBDL DD2.0 Hi10P x264-TrollUHD', false],
  ['The.Nightly.Show.2016.03.14.2160p.WEB.x264-spamTV', false],
  ['The.Nightly.Show.2016.03.14.2160p.WEB.h264-spamTV', false],
  ['The.Nightly.Show.2016.03.14.2160p.WEB.PROPER.h264-spamTV', true],
  ['Movie Name 2020 WEB-DL 4K H265 10bit HDR DDP5.1 Atmos-PTerWEB', false],
  ['The.Movie.2022.NORDiC.2160p.DV.HDR.WEB.H.265-NiDHUG', false],
  ['Movie.Name.2024.German.Dubbed.DL.AAC.2160p.DV.HDR.WEB.HEVC-GROUP', false],
  ['Movie.Name.2024.German.AC3D.DL.2160p.Hybrid.WEB.DV.HDR10Plus.HEVC-GROUP', false],
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

const bluray720Cases: Array<[string, boolean]> = [
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

const bluray1080Cases: Array<[string, boolean]> = [
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
  ['Movie.Title.2019.German.DL.1080p.HDR.UHDBDRip.AV1-GROUP', false],
  ['Movie.Title.2014.German.OPUS.DL.1080p.UHDBDRiP.HDR.AV1-GROUP', false],
  ['Movie.Title.1999.German.DL.1080p.HDR.UHDBDRip.AV1-GROUP', false],
  ['Movie.Title.1993.Uncut.German.DL.1080p.HDR.UHDBDRip.h265-GROUP', false],
  ['Movie.Title.2005.1080p.HDDVDRip.x264', false],
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

const bluray576pQuality: Array<[string]> = [
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

const remux1080pQuality: Array<[string]> = [
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

const remux2160pQuality: Array<[string]> = [
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
const bluray2160Cases: Array<[string]> = [
  ['Movie.Title.2014.2160p.UHD.BluRay.X265-IAMABLE.mkv'],
  ['Movie.Title.1956.German.DL.2160p.HDR.UHDBDRip.h266-GROUP'],
  ['Movie.Title.2021.4K.HDR.2160P.UHDBDRip.HEVC-10bit.GROUP'],
  ['Movie.S01E02.Chained.Heat.[Bluray2160p].mkv'],
  ['[FFF] Movie no Movie-san - 10 [BD][2160p-FLAC][0C4091AF]'],
  ['[coldhell] Movie v2 [BD2160p][5A45EABE].mkv'],
  ['[Coalgirls]_Movie!!_01_(3840x2160_Blu-ray_FLAC)_[8370CB8F].mkv'],
];
for (const [title] of bluray2160Cases) {
  it(`parse bluray 2160p quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R2160P);
    expect(quality.modifier).toBe(null);
  });
}

for (const [title] of remux2160pQuality) {
  it(`parse bluray 2160P remux quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R2160P);
    expect(quality.modifier).toBe(QualityModifier.REMUX);
  });
}

const hdtv720pCases: Array<[string, boolean]> = [
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

const brdisk1080pCases: Array<[string]> = [
  ['G.I.Joe.Retaliation.2013.BDISO'],
  ['Star.Wars.Episode.III.Revenge.Of.The.Sith.2005.MULTi.COMPLETE.BLURAY-VLS'],
  ['The Dark Knight Rises (2012) Bluray ISO [USENET-TURK]'],
  ['Jurassic Park.1993..BD25.ISO'],
  ['Bait.2012.Bluray.1080p.3D.AVC.DTS-HD.MA.5.1.iso'],
  ['Daylight.1996.Bluray.ISO'],
  ['Justified.Stagione.2.Parte.2.ITA-ENG.1080p.BDMux.DD5.1.x264-DarkSideMux'],
  ['Random.Title.2010.1080p.HD.DVD.AVC.DDP.5.1-GRouP'],
  ['Movie Title 2005 1080p USA Blu-ray AVC DTS-HD MA 5.1-PTP'],
  ['Movie Title 2014 1080p Blu-ray AVC DTS-HD MA 5.1-PTP'],
  ['Movie Title 1976 2160p UHD Blu-ray DTS-HD MA 5.1 DV HDR HEVC-UNTOUCHED'],
  ['Movie.Title.2008.US.Directors.Cut.UHD.BD66.Blu-ray'],
  ['Movie.2009.Blu.ray.AVC.DTS.HD.MA.5.1'],
];
for (const [title] of brdisk1080pCases) {
  it(`parse brdisk 1080p quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(QualityModifier.BRDISK);
  });
}

const rawHdCases: Array<[string]> = [['Stripes (1981) 1080i HDTV DD5.1 MPEG2-TrollHD']];
for (const [title] of rawHdCases) {
  it(`parse brdisk 1080p RAWHD quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources[0]).toBe(Source.TV);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(QualityModifier.RAWHD);
  });
}

const tsCases: Array<[string, boolean]> = [
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

const bdripCases: Array<[string]> = [
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

const extensionFallbackCases: Array<[string, Source[], Resolution?]> = [
  ['Movie.Title.S01E02.Chained.Heat.mkv', [Source.WEBDL], Resolution.R720P],
  ['Movie Name - S01E01 - Title.avi', [Source.TV], Resolution.R480P],
  ['Movie.Title..9x18.sunshine_days.avi', [Source.TV], Resolution.R480P],
  ['[CR] Movie Title - 004 [48CE2D0F].avi', [Source.TV], Resolution.R480P],
  ['Movie.Name.S03E01.The Electric Can Opener Fluctuation.m2ts', [Source.BLURAY], Resolution.R720P],
];

for (const [title, sources, resolution] of extensionFallbackCases) {
  it(`parse quality from extension "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources).toEqual(sources);
    expect(quality.resolution).toBe(resolution);
  });
}

// From Radarr and Sonarr's QualityParserFixture
const upstreamQualityCases: Array<
  [string, Source[], Resolution | undefined, QualityModifier | null]
> = [
  // HD TV without the HDTV token is 720p
  ['Series - S22E03 - MoneyBART - HD TV.mkv', [Source.TV], Resolution.R720P, null],
  ['Series.Title.S01E01.HD.TV', [Source.TV], Resolution.R720P, null],
  // XviD from a Blu-ray is Blu-ray 480p, not DVD
  ['SERIES.S03E01-06.DUAL.BDRip.XviD.AC3.-HELLYWOOD', [Source.BLURAY], Resolution.R480P, null],
  [
    'X-Men Days of Future Past 2014 THE ROGUE CUT BRRip XviD AC3-EVO',
    [Source.BLURAY],
    Resolution.R480P,
    null,
  ],
  // 1080i HDTV is not RAWHD, Raw-HD without a resolution is 1080p
  [
    'Super.Seires.Go.S01E02.Depths.of.Sonarr.1080i.HDTV.DD5.1.H.264-NOGRP',
    [Source.TV],
    Resolution.R1080P,
    null,
  ],
  [
    'Show - S03E01 - Episode Title Raw-HD.ts',
    [Source.TV],
    Resolution.R1080P,
    QualityModifier.RAWHD,
  ],
  // No remux quality below 1080p
  [
    'Series.Hunter.S02.720p.Blu-ray.Remux.AVC.FLAC.2.0-SiCFoI',
    [Source.BLURAY],
    Resolution.R720P,
    null,
  ],
  // An explicit resolution beats a bare 4k or an FHD group name
  [
    'Series Title S02E03 Title 4k to 1080p DSNP WEBrip x265 DDP 5 1 Releaser[SEV]',
    [Source.WEBRIP],
    Resolution.R1080P,
    null,
  ],
  ['The.Series.S05E06.720p.HDTV.x264-FHD', [Source.TV], Resolution.R720P, null],
  // Anime [Web] tag
  [
    '[HorribleSubs] Series Title! S01 [Web][MKV][h264][AAC 2.0][Softsubs (HorribleSubs)]',
    [Source.WEBDL],
    Resolution.R720P,
    null,
  ],
  // TVRip keeps the parsed resolution
  ['Series S01E07 - Sonarr zmen (CZ)[TvRip][HEVC][1080p]', [Source.TV], Resolution.R1080P, null],
  // German Blu-ray with a disc codec is a remux
  [
    'Star.Trek.Der.Film.1979.German.DL.2160p.UHD.BluRay.HEVC-UNTHEVC',
    [Source.BLURAY],
    Resolution.R2160P,
    QualityModifier.REMUX,
  ],
  // Bare x264 with nothing else is SD TV
  ['The.Series.S01E13.x264-CtrlSD', [Source.TV], Resolution.R480P, null],
  // A parsed resolution wins over the x264 and extension defaults
  ['Series.Title.S01E01.576p.x264-GRP', [Source.TV], Resolution.R576P, null],
  ['Movie.Title.2019.REMUX.AVC-GRP.mkv', [Source.BLURAY], Resolution.R720P, QualityModifier.REMUX],
  // Explicit full disc markers win over the German codec heuristic
  [
    'Movie.2020.German.DL.BD50.BLURAY.AVC-GRP',
    [Source.BLURAY],
    Resolution.R1080P,
    QualityModifier.BRDISK,
  ],
  // Bracketed remux markers
  ['Movie.2020.1080p.(REMUX).mkv', [Source.BLURAY], Resolution.R1080P, QualityModifier.REMUX],
  ['Movie.2020.1080p.[REMUX].mkv', [Source.BLURAY], Resolution.R1080P, QualityModifier.REMUX],
];

for (const [title, sources, resolution, modifier] of upstreamQualityCases) {
  it(`parse upstream quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources).toEqual(sources);
    expect(quality.resolution).toBe(resolution);
    expect(quality.modifier).toBe(modifier);
  });
}

const olderSdCases: Array<[string, Source[], Resolution | undefined]> = [
  // Satellite, DVB, digital TV and SD HDTV rips are SD TV
  ['Nip.Tuck.S04E13.German.SATRip.XviD-ITG', [Source.TV], Resolution.R480P],
  ['ReGenesis.S02E05.WS.DVB.XviD.CZ-dCZ', [Source.TV], Resolution.R480P],
  ['Historia.Tykit.Taudit.Ja.Teras.E2.FiNNiSH.DVBRip.XViD-TVTUPA', [Source.TV], Resolution.R480P],
  ['Rauchende.Colts.S18E20.Das.grosse.Spiel.GERMAN.dTV.XViD-NVA', [Source.TV], Resolution.R480P],
  ['Spoorloos.Verdwenen.S02E05.DUTCH.DTVrip.Xvid-TDF', [Source.TV], Resolution.R480P],
  ['Men.in.Black.The.Series.S01E06.DSRip.XviD-SFM', [Source.TV], Resolution.R480P],
  [
    'Goldtaucher.der.Beringsee.S02E08.GERMAN.DOKU.WS.HDTVRip.XviD-TVP',
    [Source.TV],
    Resolution.R480P,
  ],
  // An explicit resolution still wins
  ['Show.S01E01.German.SATRip.720p.x264-GRP', [Source.TV], Resolution.R720P],
  // Capture tags next to a web or disc source don't make it TV
  [
    'Mr.Mercedes.S01E02.On.Your.Mark.720p.DTV.WEB-DL.DD2.0.x264-NTb',
    [Source.WEBDL],
    Resolution.R720P,
  ],
  ['BattleStar.Galactica.1x09.DVD.DVB.XViD.MP3.2005.ES-EnDoR', [Source.DVD], Resolution.R480P],
  ['4400-die.rueckkehrer.2004.german.dvb.pal.dvdr-mb', [Source.DVD], Resolution.R480P],
  // The Danish group DTV is not a capture tag
  ['Headtrip-Boom_Bass_Acid_EP-VLS-1995-DTV', [], undefined],
  // French DVTV is DVD video with TV audio, VHS rips are SD without a source
  ['The.Unit.S01E03.FRENCH.DVTV.XViD-JMT', [Source.DVD], Resolution.R480P],
  ['Naked.1993.VHSRIP-FLAiR', [], Resolution.R480P],
  // Radarr's DVDSCR is 480p
  ['007.Die.Another.Day.DVDSCR.XViD-DVL', [Source.SCREENER], Resolution.R480P],
  // Video CD formats and bare xvid or divx encodes are SD
  ['Smallville.2x10.Hoehlengeheimnis.German.SVCD-FKKTV', [], Resolution.R480P],
  ['Hope.and.Faith.S01E14.VCD-FFN', [], Resolution.R360P],
  ['Hope.and.Faith.S01E14.VCD-FFN.dat', [Source.TV], Resolution.R360P],
  ['Ben.Stiller.Biography.XviD-ELPH', [], Resolution.R480P],
  ['Some.Movie.2004.DivX-GRP', [], Resolution.R480P],
  // XvidHD is not SD, a group starting with HD is
  ['Some.Show.S01E01.XvidHD-GRP', [], undefined],
  ['Some.Show.S01E01.XviD-HDLiTE', [], Resolution.R480P],
];

for (const [title, sources, resolution] of olderSdCases) {
  it(`parse older SD quality "${title}"`, () => {
    const quality = parseQuality(title);
    expect(quality.sources).toEqual(sources);
    expect(quality.resolution).toBe(resolution);
  });
}

// Release names are untrusted input, a long name must not hang the German heuristics
it('parses long repeated German names quickly', () => {
  const title = `Movie.2020.${'German.'.repeat(1426)}BluRay.`;
  const start = performance.now();
  parseQuality(title);
  expect(performance.now() - start).toBeLessThan(500);
});
