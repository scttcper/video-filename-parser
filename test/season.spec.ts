import { parseSeason } from '../src';

describe('season', () => {
  const fullSeasonRelease: Array<[string, string, number]> = [
    // ['30.Rock.Season.04.HDTV.XviD-DIMENSION', '30 Rock', 4],
    // ['Parks.and.Recreation.S02.720p.x264-DIMENSION', 'Parks and Recreation', 2],
    // ['The.Office.US.S03.720p.x264-DIMENSION', 'The Office US', 3],
    // ['Sons.of.Anarchy.S03.720p.BluRay-CLUEREWARD', 'Sons of Anarchy', 3],
    // ['Adventure Time S02 720p HDTV x264 CRON', 'Adventure Time', 2],
    // ['Sealab.2021.S04.iNTERNAL.DVDRip.XviD-VCDVaULT', 'Sealab 2021', 4],
    // ['Hawaii Five 0 S01 720p WEB DL DD5 1 H 264 NT', 'Hawaii Five 0', 1],
    // ['30 Rock S03 WS PDTV XviD FUtV', '30 Rock', 3],
    // ['The Office Season 4 WS PDTV XviD FUtV', 'The Office', 4],
    // ['Eureka Season 1 720p WEB DL DD 5 1 h264 TjHD', 'Eureka', 1],
    // ['The Office Season4 WS PDTV XviD FUtV', 'The Office', 4],
    // ['Eureka S 01 720p WEB DL DD 5 1 h264 TjHD', 'Eureka', 1],
    // ['Doctor Who Confidential   Season 3', 'Doctor Who Confidential', 3],
    // ['Fleming.S01.720p.WEBDL.DD5.1.H.264-NTb', 'Fleming', 1],
    ['Holmes.Makes.It.Right.S02.720p.HDTV.AAC5.1.x265-NOGRP', 'Holmes Makes It Right', 2],
    // ['My.Series.S2014.720p.HDTV.x264-ME', 'My Series', 2014],
  ];
  it.each(fullSeasonRelease)('should parse full season release "%s"', (postTitle, title, season) => {
    const result = parseSeason(postTitle);
    expect(result.seasonNumber).toBe(season);
  });
});
