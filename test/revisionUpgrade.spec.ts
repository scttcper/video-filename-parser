import { expect, it } from 'vitest';

import { isRevisionUpgrade } from '../src/index.js';

const hdrRelease = 'Project.Hail.Mary.2026.HDR.2160P.WEB.H265-POKE';
const properHdrRelease = 'Project.Hail.Mary.2026.PROPER.HDR.2160p.WEB.h265-GRACE';
const dolbyVisionRelease = 'Project.Hail.Mary.2026.DV.2160p.WEB.h265-GRACE';
const standardRelease = 'Project.Hail.Mary.2026.2160P.WEB.H265-POKE';

it('treats a proper of the same HDR release as a revision upgrade', () => {
  expect(isRevisionUpgrade({ current: hdrRelease, candidate: properHdrRelease })).toBe(true);
});

it('does not treat an older revision as an upgrade', () => {
  expect(isRevisionUpgrade({ current: properHdrRelease, candidate: hdrRelease })).toBe(false);
});

it('does not treat HDR and Dolby Vision releases as the same type', () => {
  expect(isRevisionUpgrade({ current: dolbyVisionRelease, candidate: properHdrRelease })).toBe(
    false,
  );
});

it('does not treat a proper HDR release as an upgrade for a standard release', () => {
  expect(isRevisionUpgrade({ current: standardRelease, candidate: properHdrRelease })).toBe(false);
});

it('ignores group and filename casing when the parsed release type matches', () => {
  expect(
    isRevisionUpgrade({
      current: 'PROJECT.HAIL.MARY.2026.HDR.2160P.WEB.H265-POKE',
      candidate: 'project.hail.mary.2026.proper.hdr.2160p.web.h265-GRACE',
    }),
  ).toBe(true);
});

const differentReleaseTypeCases: Array<[string, string]> = [
  ['different title', 'Other.Movie.2026.PROPER.HDR.2160p.WEB.h265-GRACE'],
  ['different year', 'Project.Hail.Mary.2027.PROPER.HDR.2160p.WEB.h265-GRACE'],
  ['different resolution', 'Project.Hail.Mary.2026.PROPER.HDR.1080p.WEB.h265-GRACE'],
  ['different source', 'Project.Hail.Mary.2026.PROPER.HDR.2160p.BluRay.h265-GRACE'],
  ['different video codec', 'Project.Hail.Mary.2026.PROPER.HDR.2160p.WEB.x264-GRACE'],
  ['different language', 'Project.Hail.Mary.2026.FRENCH.PROPER.HDR.2160p.WEB.h265-GRACE'],
  ['different edition', 'Project.Hail.Mary.2026.PROPER.IMAX.HDR.2160p.WEB.h265-GRACE'],
];

for (const [description, candidate] of differentReleaseTypeCases) {
  it(`does not upgrade when the release has a ${description}`, () => {
    expect(isRevisionUpgrade({ current: hdrRelease, candidate })).toBe(false);
  });
}

const revisionUpgradeCases: Array<[string, string]> = [
  ['Movie.Title.2020.1080p.WEB.h264-GRP', 'Movie.Title.2020.REPACK.1080p.WEB.h264-GRP'],
  ['Movie.Title.2020.1080p.WEB.h264-GRP', 'Movie.Title.2020.RERIP.1080p.WEB.h264-GRP'],
  ['Movie.Title.2020.1080p.WEB.h264-GRP', 'Movie.Title.2020.1080p.WEB.h264.v2-GRP'],
  ['Movie.Title.2020.PROPER.1080p.WEB.h264-GRP', 'Movie.Title.2020.PROPER.REAL.1080p.WEB.h264-GRP'],
  ['Movie.Title.2020.PROPER.REAL.1080p.WEB.h264-GRP', 'Movie.Title.2020.1080p.WEB.h264.v3-GRP'],
];

for (const [current, candidate] of revisionUpgradeCases) {
  it(`treats "${candidate}" as a newer revision than "${current}"`, () => {
    expect(isRevisionUpgrade({ current, candidate })).toBe(true);
  });
}

it('does not upgrade to a lower real revision with the same version', () => {
  expect(
    isRevisionUpgrade({
      current: 'Movie.Title.2020.PROPER.REAL.1080p.WEB.h264-GRP',
      candidate: 'Movie.Title.2020.PROPER.1080p.WEB.h264-GRP',
    }),
  ).toBe(false);
});

it('treats a proper of the same TV episode as a revision upgrade in TV mode', () => {
  expect(
    isRevisionUpgrade({
      current: 'Series.Title.S01E01.1080p.WEB.H264-GRP',
      candidate: 'Series.Title.S01E01.PROPER.1080p.WEB.H264-GRP',
      isTv: true,
    }),
  ).toBe(true);
});

it('does not upgrade a different TV episode', () => {
  expect(
    isRevisionUpgrade({
      current: 'Series.Title.S01E01.1080p.WEB.H264-GRP',
      candidate: 'Series.Title.S01E02.PROPER.1080p.WEB.H264-GRP',
      isTv: true,
    }),
  ).toBe(false);
});
