import { describe, expect, test } from '@jest/globals';

import { isMulti, Language, parseLanguage } from '../src';

describe('parseLanguage', () => {
  const tests: Array<[string, Language[]]> = [
    ['Castle.2009.S01E14.English.HDTV.XviD-LOL', [Language.English]],
    ['Castle.2009.S01E14.French.HDTV.XviD-LOL', [Language.French]],
    [
      'Ouija.Origin.of.Evil.2016.MULTi.TRUEFRENCH.1080p.BluRay.x264-MELBA',
      [Language.French, Language.English],
    ],
    ['Everest.2015.FRENCH.VFQ.BDRiP.x264-CNF30', [Language.French]],
    [
      'Showdown.In.Little.Tokyo.1991.MULTI.VFQ.VFF.DTSHD-MASTER.1080p.BluRay.x264-ZombiE',
      [Language.French, Language.English],
    ],
    [
      'The.Polar.Express.2004.MULTI.VF2.1080p.BluRay.x264-PopHD',
      [Language.French, Language.English],
    ],
    ['Castle.2009.S01E14.Spanish.HDTV.XviD-LOL', [Language.Spanish]],
    ['Castle.2009.S01E14.German.HDTV.XviD-LOL', [Language.German]],
    ['Castle.2009.S01E14.Italian.HDTV.XviD-LOL', [Language.Italian]],
    ['Castle.2009.S01E14.Danish.HDTV.XviD-LOL', [Language.Danish]],
    ['Castle.2009.S01E14.Dutch.HDTV.XviD-LOL', [Language.Dutch]],
    ['Castle.2009.S01E14.Japanese.HDTV.XviD-LOL', [Language.Japanese]],
    ['Castle.2009.S01E14.Cantonese.HDTV.XviD-LOL', [Language.Cantonese]],
    ['Castle.2009.S01E14.Mandarin.HDTV.XviD-LOL', [Language.Mandarin]],
    ['Castle.2009.S01E14.Korean.HDTV.XviD-LOL', [Language.Korean]],
    ['Castle.2009.S01E14.Russian.HDTV.XviD-LOL', [Language.Russian]],
    ['Castle.2009.S01E14.Ukrainian.HDTV.XviD-LOL', [Language.Ukrainian]],
    ['Castle.2009.S01E14.Ukr.HDTV.XviD-LOL', [Language.Ukrainian]],
    ['Castle.2009.S01E14.Polish.HDTV.XviD-LOL', [Language.Polish]],
    ['Castle.2009.S01E14.Vietnamese.HDTV.XviD-LOL', [Language.Vietnamese]],
    ['Castle.2009.S01E14.Swedish.HDTV.XviD-LOL', [Language.Swedish]],
    ['Castle.2009.S01E14.Norwegian.HDTV.XviD-LOL', [Language.Norwegian]],
    ['Castle.2009.S01E14.Finnish.HDTV.XviD-LOL', [Language.Finnish]],
    ['Castle.2009.S01E14.Turkish.HDTV.XviD-LOL', [Language.Turkish]],
    ['Castle.2009.S01E14.Czech.HDTV.XviD-LOL', [Language.Czech]],
    ['Castle.2009.S01E14.Portuguese.HDTV.XviD-LOL', [Language.Portuguese]],
    [
      'Burn.Notice.S04E15.Brotherly.Love.GERMAN.DUBBED.WS.WEBRiP.XviD.REPACK-TVP',
      [Language.German],
    ],
    ['Revolution S01E03 No Quarter 2012 WEB-DL 720p Nordic-philipo mkv', [Language.Norwegian]],
    ['Constantine.2014.S01E01.WEBRiP.H264.AAC.5.1-NL.SUBS', [Language.Dutch]],
    ['Castle.2009.S01E14.HDTV.XviD.HUNDUB-LOL', [Language.Hungarian]],
    ['Castle.2009.S01E14.HDTV.XviD.ENG.HUN-LOL', [Language.Hungarian]],
    ['Castle.2009.S01E14.HDTV.XviD.HUN-LOL', [Language.Hungarian]],
    ['Castle.2009.S01E14.HDTV.XviD.CZ-LOL', [Language.Czech]],
    ['Passengers.2016.German.DL.AC3.Dubbed.1080p.WebHD.h264.iNTERNAL-PsO', [Language.German]],
    [
      'Der.Soldat.James.German.Bluray.FuckYou.Pso.Why.cant.you.follow.scene.rules.1998',
      [Language.German],
    ],
    ['Passengers.German.DL.AC3.Dubbed..BluRay.x264-PsO', [Language.German]],
    ['Valana la Legende FRENCH BluRay 720p 2016 kjhlj', [Language.French]],
    ['Smurfs.​The.​Lost.​Village.​2017.​1080p.​BluRay.​HebDub.​x264-​iSrael', [Language.Hebrew]],
    ['The Danish Girl 2015', [Language.English]],
    [
      'Nocturnal Animals (2016) MULTi VFQ English [1080p] BluRay x264-PopHD',
      [Language.English, Language.French],
    ],
    ['Wonder.Woman.2017.720p.BluRay.DD5.1.x264-TayTO.CZ-FTU', [Language.Czech]],
    [
      'Fantastic.Beasts.The.Crimes.Of.Grindelwald.2018.2160p.WEBRip.x265.10bit.HDR.DD5.1-GASMASK',
      [Language.English],
    ],
  ];
  test.each(tests)('should get language of "%s"', (title, languages) => {
    expect(parseLanguage(title)).toEqual(languages);
  });
});

describe('multi', () => {
  const tests: Array<[string]> = [
    ['Ouija.Origin.of.Evil.2016.MULTi.TRUEFRENCH.1080p.BluRay.x264-MELBA'],
    ['Showdown.In.Little.Tokyo.1991.MULTI.VFQ.VFF.DTSHD-MASTER.1080p.BluRay.x264-ZombiE'],
    ['The.Polar.Express.2004.MULTI.VF2.1080p.BluRay.x264-PopHD'],
  ];
  test.each(tests)('should be multi', title => {
    expect(isMulti(title)).toBeTruthy();
  });
});
