import test from 'ava';

import { isMulti, Language, parseLanguage } from '../src/index.js';

const languageCases: Array<[string, Language[]]> = [
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
  ['The.Polar.Express.2004.MULTI.VF2.1080p.BluRay.x264-PopHD', [Language.French, Language.English]],
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
  ['Revolution S01E03 No Quarter 2012 WEB-DL 720p Nordic-philipo mkv', [Language.Norwegian]],
  ['Constantine.2014.S01E01.WEBRiP.H264.AAC.5.1-NL.SUBS', [Language.Dutch]],
  ['Castle.2009.S01E14.HDTV.XviD.HUNDUB-LOL', [Language.Hungarian]],
  ['Castle.2009.S01E14.HDTV.XviD.ENG.HUN-LOL', [Language.English, Language.Hungarian]],
  ['Castle.2009.S01E14.HDTV.XviD.HUN-LOL', [Language.Hungarian]],
  ['Castle.2009.S01E14.HDTV.XviD.CZ-LOL', [Language.Czech]],
  ['Peter.Rabbit.2.The.Runaway.2021.LATViAN.2160p.UHD.BLURAY.x265-UNDERDOG', [Language.Latvian]],
  [
    'Peter.Rabbit.2.The.Runaway.2021.LiTHUANiAN.2160p.UHD.BLURAY.x265-UNDERDOG',
    [Language.Lithuanian],
  ],
  [
    'Passengers.2016.German.DL.AC3.Dubbed.1080p.WebHD.h264.iNTERNAL-PsO',
    [Language.German, Language.English],
  ],
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
  [
    'Nick.and.Norahs.Infinite.Playlist.2008.CATALAN.MULTi.1080p.BluRay.x264-DESPACiTO',
    [Language.Catalan, Language.English],
  ],
  [
    'Harry.Potter.And.The.Order.Of.The.Phoenix.2007.CHINESE.2160p.UHD.BluRay.X265-HOA',
    [Language.Chinese],
  ],
  [
    'Seven.Years.of.Night.2018.PL.DUAL.1080p.BluRay.x264-FLAME',
    [Language.Polish, Language.English],
  ],
  ['Tenet.2020.THAI.2160p.UHD.BLURAY.x265-HOA', [Language.Thai]],
  [
    'Tenet 2020 1080p Multi Eng Hin Tam iMax BluRay 10Bit DD5 1 H265-IPT',
    [Language.English, Language.Hindi, Language.Tamil],
  ],
  [
    'The Flying Guillotine 1975 CHI ENG DTS-HD DTS 1080p BluRay x264 HQ-TUSAHD',
    [Language.English, Language.Chinese],
  ],
  [
    'The Incredible Story Of The Giant Pear 2017 SWE DAN DTS-HD DTS MULTISUBS 1080p BluRay x264 HQ-TUSAHD',
    [Language.Danish, Language.Swedish],
  ],
  [
    'Wonder.Woman.1984.2020.PLDUB.DUAL.HDR10Plus.2160p.UHD.BluRay.x265.iNTERNAL-PLHD',
    [Language.Polish, Language.English],
  ],
  ['Wadjda.2012.ARABiC.1080p.BluRay.x264-CONSTANT', [Language.Arabic]],
  ['Arabic.12.1982.1080p.BluRay.x264-ROVERS', [Language.English]],
  ['No.Country.for.Old.Men.1080p.BluRay.x264-HiGHTiMES', [Language.English]],
  ['Cars.2.2011.ESTONiAN.DVDRip.x264-EMX', [Language.Estonian]],
  ['Cars.2.2011.EN.SE.FI.PAL.DVDR-AMIRITE', [Language.English, Language.Swedish]],
  [
    'Cars.2.2011.ENG.DK.NO.ICE.READ.NFO.PAL.DVDR-WILDER',
    [Language.English, Language.Danish, Language.Icelandic, Language.Norwegian],
  ],
  ['Scarface.1983.CE.UNCUT.DVDRip.XviD.iNT-TURKiSO', [Language.English]],
  ['Scarface.1983.20th.AE.iNTERNAL.DVDRip.XviD-MHQ', [Language.English]],
  [
    'The.Conjuring.The.Devil.Made.Me.Do.It.2021.SUBFRENCH.2160p.WEB.H265-McNULTY',
    [Language.French],
  ],
  ['Get.Him.To.The.Greek.UNRATED.FRENCH.720p.BluRay.x264-NERDHD', [Language.French]],
  ['Maennertrip.UNRATED.German.AC3.Dubbed.1080p.Bluray.x264-CIS', [Language.German]],
  ['Maennertrip.TS.MD.German.XViD.iNTERNAL-AOE', [Language.German]],
  ['Maennertrip.EXTENDED.German.AC3.BDRip.XviD-RedRay', [Language.German]],
  ['Get.Him.To.The.Greek.TRUEFRENCH.DVDRip.XviD-REVOLTE', [Language.French]],
  ['The.Social.Network.R5.LD.German.XviD-CinePlexx', [Language.German]],
  ['The.Social.Network.R5.LiNE.XviD-TWiZTED', [Language.English]],
  ['Incassable.TRUE.FRENCH.PROPER.READ.NFO.DVDRiP.DiVX.SBC-KFT', [Language.French]],
  ['Space.Jam.A.New.Legacy.2021.ROMANiAN.2160p.UHD.BLURAY.x265-UNDERDOG', [Language.Romanian]],
  ['Space.Jam.A.New.Legacy.2021.RO.2160p.UHD.BLURAY.x265-UNDERDOG', [Language.Romanian]],
  ['Spider-Man.No.Way.Home.2021.SLOVAK.2160p.UHD.BLURAY.x265-UNDERDOG', [Language.Slovak]],
];

for (const [title, result] of languageCases) {
  test(`parse language "${title}"`, t => {
    t.deepEqual(parseLanguage(title), result);
  });
}

const multiCases: Array<[string]> = [
  ['Ouija.Origin.of.Evil.2016.MULTi.TRUEFRENCH.1080p.BluRay.x264-MELBA'],
  ['Showdown.In.Little.Tokyo.1991.MULTI.VFQ.VFF.DTSHD-MASTER.1080p.BluRay.x264-ZombiE'],
  ['The.Polar.Express.2004.MULTI.VF2.1080p.BluRay.x264-PopHD'],
  ['Star.Trek.Der.Film.1979.German.DL.2160p.UHD.BluRay.HEVC-UNTHEVC'],
];

for (const [title] of multiCases) {
  test(`parse multi language "${title}"`, t => {
    t.true(isMulti(title));
  });
}
