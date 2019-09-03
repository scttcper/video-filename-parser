import { parseQualityModifyers, parseQuality, Source, Resolution } from '../src';

describe('parseQualityModifier', () => {
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
  ];
  test.each(versionCases)('should parse version of "%s"', (title, version) => {
    expect(parseQualityModifyers(title).version).toBe(version);
  });

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
  test.each(realCases)('should parse real of "%s"', (title, reality) => {
    expect(parseQualityModifyers(title).real).toBe(reality);
  });
});

describe('parseQuality', () => {
  const webdlCases: Array<[string, boolean]> = [
    ['Elementary.S01E10.The.Leviathan.480p.WEB-DL.x264-mSD', false],
    ['Glee.S04E10.Glee.Actually.480p.WEB-DL.x264-mSD', false],
    ['The.Big.Bang.Theory.S06E11.The.Santa.Simulation.480p.WEB-DL.x264-mSD', false],
    ['Da.Vincis.Demons.S02E04.480p.WEB.DL.nSD.x264-NhaNc3', false],
  ];
  test.each(webdlCases)('should parse webdl 480p quality "%s"', (title, proper) => {
    const quality = parseQuality(title);
    expect(quality.source).toBe(Source.WEBDL);
    expect(quality.resolution).toBe(Resolution.R480P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });

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
    ['Opeth.Garden.Of.The.Titans.Live.At.Red.Rocks.Amphitheatre.2017.1080p.MBluRay.x264-TREBLE.mkv', false],
  ];
  test.each(bluray1080Cases)('should parse bluray 1080p "%s"', (title, proper) => {
    const quality = parseQuality(title);
    expect(quality.source).toBe(Source.BLURAY);
    expect(quality.resolution).toBe(Resolution.R1080P);
    expect(quality.modifier).toBe(null);
    expect(quality.revision.version).toBe(proper ? 2 : 1);
  });
});
