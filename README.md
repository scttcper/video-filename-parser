# video-filename-parser [![npm](https://img.shields.io/npm/v/@ctrl/video-filename-parser.svg?maxAge=3600)](https://www.npmjs.com/package/@ctrl/video-filename-parser) [![CircleCI](https://badgen.net/circleci/github/scttcper/video-filename-parser)](https://circleci.com/gh/scttcper/video-filename-parser) [![coverage](https://codecov.io/gh/scttcper/video-filename-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/scttcper/video-filename-parser)

> A simple file / release name parser based heavily on radarr's movie parsing

__DEMO__: https://video-filename-parser.vercel.app  

## Install

```console
npm install @ctrl/video-filename-parser
```

## Use

##### parameters:  
**title** string - The title or filename to be parsed  
**isTv** boolean - parsed as a tv show (default false)  

```ts
import { filenameParse } from '@ctrl/video-filename-parse';

const title = 'This.is.40.2012.PROPER.UNRATED.720p.BluRay.x264-Felony';
console.log(filenameParse(title));
// {
//   title: 'This is 40',
//   year: '2012',
//   source: 'BLURAY',
//   resolution: '720P',
//   codec: 'x264',
//   group: 'Felony',
//   edition: {
//     imax: false,
//     remastered: false,
//     extended: false,
//     theatrical: false,
//     directors: false,
//     unrated: true,
//     fanEdit: false,
//     limited: false,
//   },
//   revision: { version: 2, real: 0 },
//   qualitySource: 'NAME',
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
//   "audioCodec": null,
//   "audioChannels": null,
//   "revision": {
//     "version": 1,
//     "real": 0
//   },
//   "group": "AFG",
//   "edition": {
//     "imax": false,
//     "remastered": false,
//     "extended": false,
//     "theatrical": false,
//     "directors": false,
//     "unrated": false,
//     "fanEdit": false,
//     "limited": false,
//     "hdr": false,
//     "internal": false
//   },
//   "languages": [
//     "English"
//   ],
//   "qualitySource": "NAME",
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
```

## See also
[Radarr movie parser](https://github.com/Radarr/Radarr/blob/01ad015b1433ce792c24f019f701f3a8a59c4b2c/src/NzbDrone.Core/Parser/Parser.cs)  
[sonarr tv parser](https://github.com/Sonarr/Sonarr/blob/phantom-develop/src/NzbDrone.Core/Parser/Parser.cs)  
[guessit](https://github.com/guessit-io/guessit)
