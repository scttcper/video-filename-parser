# video-filename-parser [![npm](https://img.shields.io/npm/v/@ctrl/video-filename-parser.svg?maxAge=3600)](https://www.npmjs.com/package/@ctrl/video-filename-parser) [![CircleCI](https://circleci.com/gh/TypeCtrl/video-filename-parser.svg?style=svg)](https://circleci.com/gh/TypeCtrl/video-filename-parser) [![coverage status](https://codecov.io/gh/typectrl/video-filename-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/typectrl/video-filename-parser)

> A simple file / release name parser based heavily on radarr's movie parsing

## Install

```console
npm install @ctrl/video-filename-parser
```

## Use

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
```

## See also
[Radarr parser](https://github.com/Radarr/Radarr/blob/01ad015b1433ce792c24f019f701f3a8a59c4b2c/src/NzbDrone.Core/Parser/Parser.cs)  
[guessit](https://github.com/guessit-io/guessit)
