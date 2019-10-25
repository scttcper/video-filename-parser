import { parseSeason, Season } from '../src';

describe('season', () => {
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
  it.each(fullSeasonRelease)('should parse full season release "%s"', (postTitle, title, season) => {
    const result = parseSeason(postTitle) as Season;
    expect(result.seasonNumber[0]).toBe(season);
    expect(result.seriesTitle).toBe(title);
  });

  const seasonPackCases: Array<[string, string, number[]]> = [
    ['The Simpsons S01 - S10 FIXED MegaPack x264 AC3-DTS -jlw', 'The Simpsons', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    ['The Wire S01-05 WS BDRip X264-REWARD-No Rars', 'The Wire', [1, 2, 3, 4, 5]],
    ['The Office S01-S09 720p BluRay WEB-DL nHD x264-NhaNc3', 'The Office', [1, 2, 3, 4, 5, 6, 7, 8, 9]],
    ['[REQ] Reno 911! S01 - 06 Complete DVDRip XviD-Mixed', 'Reno 911!', [1, 2, 3, 4, 5, 6]],
  ];
  it.each(seasonPackCases)('should parse multi season release "%s"', (postTitle, title, seasons) => {
    const result = parseSeason(postTitle) as Season;
    expect(result.seasonNumber).toEqual(seasons);
    expect(result.seriesTitle).toBe(title);
    expect(result.isMultiSeason).toBe(true);
  });

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
  it.each(crapCases)('should not parse "%s"', postTitle => {
    expect(parseSeason(postTitle)).toBe(null);
  });
});
