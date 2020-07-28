import { parseSource, Source } from '../src';

describe('source', () => {
  const singleCases: Array<[string, Source[]]> = [
    ['Whats.Eating.Gilbert.Grape.1993.720p.BluRay', [Source.BLURAY]],
    ['Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS', [Source.BLURAY]],
    ['Oceans.Thirteen.2007.iNTERNAL.720p.BluRay.x264-MHQ', [Source.BLURAY]],
    ['Rocketman 2019 2160p UHD BluRay x265-TERMiNAL', [Source.BLURAY]],
    ['Alita Battle Angel 2019 2160p WEB-DL DD+5 1 HEVC-DEFLATE[NO RAR]', [Source.WEBDL]],
    ['Alita: Battle Angel 2019 BRRip AC3 x264-CMRG', [Source.BLURAY]],
    ['The Hateful Eight 2015 DVDScr XVID AC3 HQ Hive-CM8', [Source.SCREENER]],
    ['This Is 40 2012 DVD Screener Xvid UnKnOwN', [Source.SCREENER]],
    ['Brooklyns Finest DVDSCREENER XviD-MENTiON', [Source.SCREENER]],
    ['50 50 2011 SCREENER XviD-REFiLL', [Source.SCREENER]],
    ['True Grit 2010 SCR XViD - IMAGiNE', [Source.SCREENER]],
    ['Tracers 2015 PPV XVID AC3 HQ Hive-CM8', [Source.PPV]],
    ['X-Men Origins Wolverine 2009 WORKPRINT XviD-NoGRP', [Source.WORKPRINT]],
    ['Half Baked 1998 720p HDDVD XVID-AC3-PULSAR', [Source.BLURAY]],
    ['Teenage Mutant Ninja Turtles Turtles Forever 2009 WS PDTV XviD-DVSKY', [Source.TV]],
    ['The Interview 2014 1080p WEB-DL x264 AAC MerryXmas', [Source.WEBDL]],
    ['John Wick Chapter 2 2017 720p WEB-DL X264 AC3-EVO', [Source.WEBDL]],
    ['Into the Storm 720 WEBDL (RUSSiAN & ENGLISH AUDIO)', [Source.WEBDL]],
    ['Michael 1996 1080p AMZN WEBCap DD+5.1 x264-LEGi0N', [Source.WEBRIP]],
    ['Avengers Infinity War 2018 NEW PROPER 720p HD-CAM X264 HQ-LPG', [Source.CAM]],
    ['The Hunger Games Mockingjay - Part 1 (2014) 576p NEW CAM XViD', [Source.CAM]],
    ['Suicide Squad 2016 CAM UnKnOwN', [Source.CAM]],
    ['Star Trek Beyond (2016) ENG Cam V2 XviD UnKnOwN', [Source.CAM]],
    ['Parasite.2019.MULTi.VFI.WEBrip.2160p.HDR.x265.True.HD-Tokuchi', [Source.WEBRIP]],
    ['How You Look At Me 2019 720p AMZN WEBRip AAC2 0 X 264-EVO', [Source.WEBRIP]],
    ['Series Title - S01E11 2020 1080p Viva MKV WEB', [Source.WEBDL]],
  ];
  test.each(singleCases)('should parse source "%s"', (title, expected) => {
    expect(parseSource(title)).toEqual(expected);
  });

  const multipeSourceCases: Array<[string, Source[]]> = [
    ['The Office S01-S09 720p BluRay WEB-DL nHD x264-NhaNc3', [Source.BLURAY, Source.WEBDL]],
  ];
  test.each(multipeSourceCases)('should parse multiple sources "%s"', (title, expected) => {
    expect(parseSource(title)).toEqual(expected);
  });
});
