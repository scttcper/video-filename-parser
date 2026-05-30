import { expect, it } from 'vitest';

import { fileExtensions, removeFileExtension } from '../src/index.js';

const cases: Array<[string, string]> = [
  [
    'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS.mkv',
    'Whats.Eating.Gilbert.Grape.1993.720p.BluRay.x264-SiNNERS',
  ],
  ['melite-spr-720p-rpk.mkv', 'melite-spr-720p-rpk'],
  ['movie.release.MP4', 'movie.release'],
  ['movie.release.webm', 'movie.release'],
  ['movie.release.rmvb', 'movie.release'],
  ['movie.release.dvr-ms', 'movie.release'],
  ['movie.release.notvideo', 'movie.release.notvideo'],
  ['Movie.Title.2026.1080p.WEB-DL-GROUP', 'Movie.Title.2026.1080p.WEB-DL-GROUP'],
];

for (const [title, result] of cases) {
  it(`remove extension of "${title}"`, () => {
    expect(removeFileExtension(title)).toBe(result);
  });
}

it('honors extensions added to the exported list', () => {
  fileExtensions.push('.custom');

  try {
    expect(removeFileExtension('movie.release.custom')).toBe('movie.release');
  } finally {
    fileExtensions.pop();
  }
});
