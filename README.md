# video-filename-parser [![npm](https://img.shields.io/npm/v/@ctrl/video-filename-parser.svg?maxAge=3600)](https://www.npmjs.com/package/@ctrl/video-filename-parser)

> A simple file / release name parser based heavily on radarr's movie parsing

**DEMO**: https://video-filename-parser.ep.workers.dev

## Install

```console
npm install @ctrl/video-filename-parser
```

## Use

##### parameters:

**title** string - The title or filename to be parsed  
**isTv** boolean - parsed as a tv show (default false)

```ts
import { filenameParse } from '@ctrl/video-filename-parser';

const title = 'This.is.40.2012.PROPER.UNRATED.720p.BluRay.x264-Felony';
console.log(filenameParse(title));
// {
//   "title": "This is 40",
//   "year": "2012",
//   "resolution": "720P",
//   "sources": [
//     "BLURAY"
//   ],
//   "videoCodec": "x264",
//   "revision": {
//     "version": 2,
//     "real": 0
//   },
//   "group": "Felony",
//   "edition": {
//     "unrated": true
//   },
//   "languages": [
//     "English"
//   ],
// }

console.log(filenameParse('The Office US S09E06 HDTV XviD-AFG', true));
// {
//   "title": "The Office US",
//   "year": null,
//   "resolution": "480P",
//   "sources": [
//     "TV"
//   ],
//   "videoCodec": "xvid",
//   "revision": {
//     "version": 1,
//     "real": 0
//   },
//   "group": "AFG",
//   "edition": {},
//   "languages": [
//     "English"
//   ],
//   "seasons": [
//     9
//   ],
//   "episodeNumbers": [
//     6
//   ],
//   "airDate": null,
//   "fullSeason": false,
//   "isPartialSeason": false,
//   "isMultiSeason": false,
//   "isSeasonExtra": false,
//   "isSpecial": false,
//   "seasonPart": 0,
//   "isTv": true
// }

console.log(filenameParse('The Expanse - S01E02 - The Big Empty', true).remainder);
// "The Big Empty"
```

Quality modifiers such as `Remux`, `BR-DISK`, and `Raw-HD` are exposed as `modifier`.
Repack/rerip releases set `revision.isRepack` and increment `revision.version`.

## Revision upgrades

`isRevisionUpgrade({ current, candidate, isTv })` checks whether a candidate is a newer revision of
the same parsed release type. It ignores release group and audio details, but keeps edition flags
like HDR and DV separate.

```ts
import { isRevisionUpgrade } from '@ctrl/video-filename-parser';

console.log(
  isRevisionUpgrade({
    current: 'Movie.Title.2026.HDR.2160P.WEB.H265-GROUP',
    candidate: 'Movie.Title.2026.PROPER.HDR.2160p.WEB.h265-OTHER',
  }),
);
// true
```

## See also

[Radarr movie parser](https://github.com/Radarr/Radarr/blob/01ad015b1433ce792c24f019f701f3a8a59c4b2c/src/NzbDrone.Core/Parser/Parser.cs)  
[sonarr tv parser](https://github.com/Sonarr/Sonarr/blob/phantom-develop/src/NzbDrone.Core/Parser/Parser.cs)  
[guessit](https://github.com/guessit-io/guessit)
