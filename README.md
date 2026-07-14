# video-filename-parser [![npm](https://img.shields.io/npm/v/@ctrl/video-filename-parser.svg?maxAge=3600)](https://www.npmjs.com/package/@ctrl/video-filename-parser)

Parse movie and TV release names into normalized metadata. The parser is heavily inspired by
Radarr's movie parsing.

[Try the demo](https://video-filename-parser.ep.workers.dev)

## Installation

```console
npm install @ctrl/video-filename-parser
```

The package is ESM-only and requires Node.js 20 or newer.

## Usage

### Movies

```ts
import { filenameParse } from '@ctrl/video-filename-parser';

const movie = filenameParse('This.is.40.2012.PROPER.UNRATED.720p.BluRay.x264-Felony');
```

```json
{
  "title": "This is 40",
  "year": "2012",
  "resolution": "720P",
  "sources": ["BLURAY"],
  "videoCodec": "x264",
  "revision": {
    "version": 2,
    "real": 0
  },
  "group": "Felony",
  "edition": {
    "unrated": true
  },
  "languages": ["English"]
}
```

### TV shows

Pass `true` as the second argument to parse seasons, episodes, air dates, and other TV-specific
metadata.

```ts
const show = filenameParse('The Office US S09E06 HDTV XviD-AFG', true);

show.title;
// "The Office US"

show.seasons;
// [9]

show.episodeNumbers;
// [6]
```

Text after the season and episode can be returned as `remainder`:

```ts
const episode = filenameParse('The Expanse - S01E02 - The Big Empty', true);

episode.remainder;
// "The Big Empty"
```

### Parameters

| Parameter | Type      | Default | Description                                      |
| --------- | --------- | ------- | ------------------------------------------------ |
| `name`    | `string`  | —       | Release name or filename to parse.               |
| `isTv`    | `boolean` | `false` | Enables season, episode, and air-date detection. |

`filenameParse` returns `ParsedMovie` by default and `ParsedShow` when TV metadata is found in TV
mode. Common metadata includes:

- title and year
- resolution and source type
- video codec, audio codec, and audio channels
- release group and languages
- edition flags such as HDR, Dolby Vision, IMAX, remastered, and unrated
- quality modifiers such as remux, BR-DISK, and Raw-HD
- revision details for proper, repack, rerip, and versioned releases
- season, episode, air-date, and season-pack details in TV mode

Metadata that is not present or cannot be inferred is generally omitted. `sources`, `languages`, and
`edition` are always returned, while `year` and `group` may be `null`.

## Metadata conventions

- `sources` describes the media or delivery type, such as `WEBDL`, `WEBRIP`, `BLURAY`, or `TV`.
  Service markers such as `AMZN`, `NF`, and `iTunesHD` can help identify a WEB-DL, but the service
  itself is not returned.
- Releases without a recognized language marker default to English.
- `multi` indicates a multi-language marker; it does not enumerate languages that are not named in
  the release.
- A `Dolby Atmos` marker can identify Dolby Digital Plus, but standalone `Atmos` is not retained and
  there is no separate Atmos flag in the result.
- Parsing is heuristic. Ambiguous names may need the focused parsing helpers or application-specific
  handling.

## Focused parsers

The package also exports focused helpers for consumers that do not need the full result, including
`parseTitleAndYear`, `parseSeason`, `parseQuality`, `parseResolution`, `parseSource`,
`parseVideoCodec`, `parseAudioCodec`, `parseAudioChannels`, `parseEdition`, `parseGroup`,
`parseLanguage`, and `removeFileExtension`.

```ts
import { parseAudioCodec, parseResolution } from '@ctrl/video-filename-parser';

parseResolution('Movie.2026.2160p.WEB-DL').resolution;
// "2160P"

parseAudioCodec('Movie.2026.WEB-DL.DDP5.1').codec;
// "Dolby Digital Plus"
```

## Revision upgrades

`isRevisionUpgrade({ current, candidate, isTv })` returns `true` when the candidate is a newer
revision of the same parsed release type.

Release identity includes title, year, resolution, sources, quality modifier, video codec,
languages, multi-language status, edition flags, and TV episode or season details. Release group and
audio details are ignored. HDR and Dolby Vision releases are therefore kept separate.

```ts
import { isRevisionUpgrade } from '@ctrl/video-filename-parser';

isRevisionUpgrade({
  current: 'Movie.Title.2026.HDR.2160P.WEB.H265-GROUP',
  candidate: 'Movie.Title.2026.PROPER.HDR.2160p.WEB.h265-OTHER',
});
// true
```

## See also

- [Radarr movie parser](https://github.com/Radarr/Radarr/blob/01ad015b1433ce792c24f019f701f3a8a59c4b2c/src/NzbDrone.Core/Parser/Parser.cs)
- [Sonarr TV parser](https://github.com/Sonarr/Sonarr/blob/phantom-develop/src/NzbDrone.Core/Parser/Parser.cs)
- [GuessIt](https://github.com/guessit-io/guessit)
