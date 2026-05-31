import { bench, describe } from 'vitest';

import { filenameParse, parseQuality, parseSeason, removeFileExtension } from '../src/index.js';

const priorityMovieTitles = [
  'Project.Hail.Mary.2026.DV.2160p.WEB.h265-GRACE',
  'Project.Hail.Mary.2026.PROPER.HDR.2160p.WEB.h265-GRACE',
  'Project.Hail.Mary.2026.HDR.2160P.WEB.H265-POKE',
  'Project.Hail.Mary.2026.2160P.WEB.H265-POKE',
  'Speed.Racer.2008.2160p.UHD.BluRay.x265-B0MBARDiERS',
  'Speed.Racer.2008.2160p.UHD.BluRay.H265-GAZPROM',
  'Avatar.Fire.and.Ash.2025.2160p.UHD.BluRay.x265-SURCODE',
  'Avatar.Fire.and.Ash.2025.2160p.UHD.BluRay.H265-GAZPROM',
  'Fight.Club.1999.2160p.UHD.BluRay.x265-SURCODE',
  'Fight.Club.1999.2160p.UHD.BluRay.H265-GAZPROM',
];

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

const extensionTitles = [
  'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
  'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS.mkv',
  'Spider-Man Far from Home.2019.1080p.HDRip.X264.AC3-EVO.mp4',
  'movie.release.rmvb',
  'Movie.Title.2026.1080p.WEB-DL-GROUP',
];

describe('removeFileExtension', () => {
  for (const title of extensionTitles) {
    bench(title, () => {
      removeFileExtension(title);
    });
  }
});

describe('filenameParse - priority movies', () => {
  for (const title of priorityMovieTitles) {
    bench(title, () => {
      filenameParse(title);
    });
  }
});

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

describe('parseQuality - priority movies', () => {
  for (const title of priorityMovieTitles) {
    bench(title, () => {
      parseQuality(title);
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
