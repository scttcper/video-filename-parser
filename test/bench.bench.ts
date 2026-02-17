import { bench, describe } from 'vitest';

import {
  filenameParse,
  parseQuality,
  parseSeason,
} from '../src/index.js';

const movieTitles = [
  'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
  'Spider-Man Far from Home.2019.1080p.HDRip.X264.AC3-EVO',
  'Togo 2019 2160p HDR DSNP WEBRip DDPAtmos 5 1 X265-TrollUHD',
  'This.is.40.2012.PROPER.UNRATED.720p.BluRay.MULti.x264-Felony',
  'Ex Machina 2015 UHD BluRay 2160p DTS-X 7 1 HDR x265 10bit-CHD',
  'Timecop.1994.PROPER.1080p.BluRay.x264-Japhson',
  'Indiana.Jones.and.the.Temple.of.Doom.1984.Complete.UHD.Bluray-JONES',
  'Apprentice.2016.COMPLETE.BLURAY-UNRELiABLE',
];

const tvTitles = [
  'Its Always Sunny in Philadelphia S14E04 720p WEB H264-METCON',
  'NFL 2019 10 06 Chicago Bears vs Oakland Raiders Highlights 720p HEVC x265-MeGusta',
  'Parks.and.Recreation.S02.720p.x264-DIMENSION',
  'Chuck.S04E05.HDTV.XviD-LOL',
  'Gold.Rush.S04E05.Garnets.or.Gold.REAL.REAL.PROPER.HDTV.x264-W4F',
  'Fleming.S01.720p.WEBDL.DD5.1.H.264-NTb',
  'Holmes.Makes.It.Right.S02.720p.HDTV.AAC5.1.x265-NOGRP',
  'House.S07E11.PROPER.REAL.RERIP.1080p.BluRay.x264-TENEIGHTY',
];

describe('filenameParse - movies', () => {
  for (const title of movieTitles) {
    bench(title, () => {
      filenameParse(title);
    });
  }
});

describe('filenameParse - tv shows', () => {
  for (const title of tvTitles) {
    bench(title, () => {
      filenameParse(title, true);
    });
  }
});

describe('parseQuality', () => {
  const titles = [...movieTitles, ...tvTitles];
  for (const title of titles) {
    bench(title, () => {
      parseQuality(title);
    });
  }
});

describe('parseSeason', () => {
  for (const title of tvTitles) {
    bench(title, () => {
      parseSeason(title);
    });
  }
});
