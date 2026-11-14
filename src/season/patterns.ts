import {
  parseAbsoluteEpisodeMatch,
  parseAirDateMatch,
  parsePartialSeasonMatch,
  parseSeasonEpisodeMatch,
  parseSeasonPackMatch,
  type ParsedMatchCollection,
} from './common.js';

export interface SeasonPattern {
  name: string;
  regex: RegExp;
  stopOnNull?: boolean;
  parse: (match: RegExpExecArray, simpleTitle: string) => ParsedMatchCollection | null;
}

const airDate = (name: string, regex: RegExp): SeasonPattern => ({
  name,
  regex,
  stopOnNull: true,
  parse: parseAirDateMatch,
});

const seasonEpisode = (name: string, regex: RegExp): SeasonPattern => ({
  name,
  regex,
  parse: parseSeasonEpisodeMatch,
});

const seasonPack = (name: string, regex: RegExp): SeasonPattern => ({
  name,
  regex,
  parse: parseSeasonPackMatch,
});

const partialSeason = (name: string, regex: RegExp): SeasonPattern => ({
  name,
  regex,
  parse: parsePartialSeasonMatch,
});

const absoluteEpisode = (name: string, regex: RegExp): SeasonPattern => ({
  name,
  regex,
  parse: parseAbsoluteEpisodeMatch,
});

// Sonarr's .NET patterns repeat named groups like `(?:E(?<episode>\d+))+` and read every capture.
// JavaScript only keeps the last repetition, so repeated tokens are written as the first token
// followed by a repeated tail: `episode`/`season`/`absoluteepisode` hold the first capture and
// `episode1`/`season1`/`absoluteepisode1` hold the last.
export const seasonPatterns: SeasonPattern[] = [
  airDate(
    'daily-airdate-no-title',
    /^(?<airyear>19[6-9]\d|20\d\d)(?<sep>[-_]?)(?<airmonth>0\d|1[0-2])\k<sep>(?<airday>[0-2]\d|3[01])(?!\d)/i,
  ),
  seasonEpisode(
    'multi-part-no-title',
    /^\W*S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))[ex]{1,2}(?<episode>\d{1,3}(?!\d+))(?:[ex]{1,2}\d{1,3}(?!\d+))*(?:\W*S?(?<season1>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:[ex]{1,2}(?<episode1>\d{1,3}(?!\d+)))+)+/i,
  ),
  // S6E1E2, S6.E1-E2, S05E01-02, 2x04x05, 8x01_02. Bare -/_ episodes must end at a separator so
  // episode title numbers like 2-45 or 31st are not read as episodes.
  seasonEpisode(
    'multi-episode-with-title',
    /^(?<title>[^\r\n]+?)[-_. ([]+S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))[-_. ]?[ex](?!26[45])(?<episode>\d{1,3}(?!\d+))(?:(?:[-_. ]?[ex]|[-_](?=\d{1,3}(?![\da-z])))(?!26[45])(?<episode1>\d{1,3}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'multi-episode-with-title-and-trailing-info',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:[-_]?\W?[ex]|[-_]{1,2}(?=\d{2,3}(?![\da-z])))(?<episode1>\d{2,3}(?!\d+)))+)[^[\]\r\n]*(?:\[[^\]\r\n]+\])(?!\\)/i,
  ),
  seasonEpisode(
    'multi-episode-no-title',
    /^S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:[-_]|[ex]){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:[-_]|[ex]){1,2}(?<episode1>\d{2,3}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'single-episode-no-title',
    /^(?:S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[-_ ]?[ex])(?<episode>\d{2,3}(?!\d+))))/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-episode-absolute',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)(?<title>[^\r\n]+?)[-_. ](?:Episode)[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+))(?:[-_. ]+(?<absoluteepisode1>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))*[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-subgroup-absolute-plus-season-episode',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\](?:_|-|\s|\.)?)(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?)(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode1>\d{2,3}(\.\d{1,2})?))*(?:_|-|\s|\.)+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode1>\d{2}(?!\d+)))*)[^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-season-episode-plus-absolute',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\](?:_|-|\s|\.)?)(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode1>\d{2}(?!\d+)))*)(?:_|-|\s|\.)+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+))(?:(?:_|-|\s|\.)+(?<absoluteepisode1>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))*[^\r\n]*(?:$|\.)/i,
  ),
  seasonEpisode(
    'anime-subgroup-season-episode',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\](?:_|-|\s|\.)?)(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode1>\d{2}(?!\d+)))*)(?:\s|\.)[^\r\n]*(?:$|\.)/i,
  ),
  // Anime batches separated with a tilde: [SubGroup] Title - 01~10
  absoluteEpisode(
    'anime-subgroup-title-tilde-batch',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)(?<![-_. ]|\b0\d+) - [-_. ]?(?<absoluteepisode>\d{2,4}(\.\d{1,2})?(?!\d+))\s?~\s?(?<absoluteepisode1>\d{2,4}(\.\d{1,2})?(?!\d+))(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-with-trailing-number',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^-\r\n]*?\d+)[-_. ]+[-_. ]?(?<absoluteepisode>\d{3}(\.\d{1,2})?(?!\d+))(?:[-_. ]?(?<absoluteepisode1>\d{3}(\.\d{1,2})?(?!\d+)))*(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-dash-absolute',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)[. ]-[. ](?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+|[-]))(?:[. ]-[. ](?<absoluteepisode1>\d{2,3}(\.\d{1,2})?(?!\d+|[-])))*(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  seasonPack(
    'anime-subgroup-multi-season-pack',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)[-_. ]+S(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-S?|[-_. ]{1,3}S)(?<season1>(?<!\d+)\d{1,2}(?!\d+)))+/i,
  ),
  partialSeason(
    'anime-subgroup-partial-season-pack',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)\W+S(?<season>(?<!\d+)\d{1,2}(?!\d+))\W+(?:(?:(?:Part|Vol)\W?|(?<!\d+\W+)e|p)(?<seasonpart>\d{1,2}(?!\d+)))+/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-dash-absolute-range',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^-\r\n]+?)(?<![-_. ]|\b0\d+) - [-_. ]?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+))(?:[-_. ]?(?<absoluteepisode1>\d{2,3}(\.\d{1,2})?(?!\d+)))*(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  seasonPack(
    'anime-subgroup-title-season-pack',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)[-_. ]+S(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?![ex]?\d+))[^\r\n]+?(?:$|\.mkv)/i,
  ),
  // Title [Season 3] or [Group] Title (Season 1)
  seasonPack(
    'season-only-bracketed',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ])?(?<title>[^\r\n]+?)[-_. ]+?[[(](?:S|Season|Saison|Series|Stagione|Sezon)[-_. ]?(?<season>\d{1,2}(?![-_. ]?\d+))(?:[-_. )\]]|$)+(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-absolute',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)[-_. ]+\(?[-_. ]?#?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+))(?:[-_. ]?#?(?<absoluteepisode1>\d{2,3}(\.\d{1,2})?(?!\d+)))*\)?(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  seasonEpisode(
    'multi-episode-repeated',
    /^(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:[ex]|[-_. ]e){1,2}(?<episode>\d{1,3}(?!\d+))(?:(?:[ex]|[-_. ]e){1,2}\d{1,3}(?!\d+))*(?:(?:[-_\W](?<![()[!]))+S?(?<season1>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[ex]|[-_. ]e){1,2}(?<episode1>\d{1,3}(?!\d+)))+)+/i,
  ),
  seasonEpisode(
    'single-episode-with-title',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>(?!265|264)\d{2,3}(?!\d+|(?:[ex]|\W[ex]|_|-){1,2})))/i,
  ),
  absoluteEpisode(
    'anime-title-season-episode-plus-absolute-subgroup',
    /^(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+))))[-_. ]+(?<absoluteepisode>(?<!\d+)\d{3}(\.\d{1,2})?(?!\d+))(?:[-_. ]+(?<absoluteepisode1>(?<!\d+)\d{3}(\.\d{1,2})?(?!\d+)))*[^[\]\r\n]*\[(?<subgroup>[^\]\r\n]+)\](?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-title-episode-absolute-subgroup',
    /^(?<title>[^\r\n]+?)[-_. ]Episode[-_. ]+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+))(?:[-_. ]+(?<absoluteepisode1>\d{2,3}(\.\d{1,2})?(?!\d+)))*[^[\]\r\n]*\[(?<subgroup>[^\]\r\n]+)\][^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-subgroup-hash',
    /^(?<title>[^\r\n]+?)(?:_|-|\s|\.)+(?<absoluteepisode>\d{3}(\.\d{1,2})(?!\d+))(?:(?:_|-|\s|\.)+(?<absoluteepisode1>\d{3}(\.\d{1,2})(?!\d+)))*[^[\]\r\n]*\[(?<subgroup>[^\]\r\n]+)\][^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-absolute-ep-range',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)(?:_|\s|\.)+(?:e|ep)(?<absoluteepisode>\d{2,3}(\.\d{1,2})?)-(?<absoluteepisode1>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+|-))[^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-absolute-number-range',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)[_. ]+(?<absoluteepisode>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+))-(?<absoluteepisode1>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+|-))[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-hash',
    /^(?<title>[^\r\n]+?)(?:_|-|\s|\.)+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+))(?:(?:_|-|\s|\.)+(?<absoluteepisode1>\d{2,3}(\.\d{1,2})?(?!\d+)))*(?:[-_. ]+(?<special>special|ova|ovd))?[-_. ]+[^[\]\r\n]*(?<hash>\[\w{8}\])(?:$|\.)/i,
  ),
  seasonEpisode(
    'airdate-plus-season-episode',
    /^(?<title>[^\r\n]+?)?\W*(?<airdate>\d{4}\W+[0-1][0-9]\W+[0-3][0-9])(?!\W+[0-3][0-9])[-_. ](?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,
  ),
  airDate(
    'airdate-and-season-episode',
    /^(?<title>[^\r\n]+?)?\W*(?<airyear>\d{4})\W+(?<airmonth>[0-1][0-9])\W+(?<airday>[0-3][0-9])(?!\W+[0-3][0-9])[^\r\n]*?(?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,
  ),
  // TJET wrestling: Title E76 2024 08 08 ... [TJET], the air date identifies the episode
  airDate(
    'absolute-episode-and-airdate',
    /^(?<title>[^\r\n]+?)?[-_. ]e\d{2,3}(?!\d)[-_. ](?<airyear>\d{4})\W+(?<airmonth>[0-1][0-9])\W+(?<airday>[0-3][0-9])(?!\W+[0-3][0-9])[^\r\n]+?\[[a-z]+\]/i,
  ),
  seasonEpisode(
    'four-digit-season-s-episode',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:e|\We|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|e|\We|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,
  ),
  seasonEpisode(
    'four-digit-season-x-episode',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:x|\Wx){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|x|\Wx|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,
  ),
  // Title.S01.05
  seasonEpisode(
    'season-dot-episode',
    /^(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+S(?<season>(?<!\d+)\d{2}(?!\d+))\.(?<episode>\d{2,3}(?!\d+))(?:[-_. ]|$)/i,
  ),
  seasonPack(
    'multi-season-pack',
    /^(?<title>[^\r\n]+?)(?:Complete Series)?[-_. ]+(?:S|(?:Season|Saison|Series|Stagione)[_. ])(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[-_. ]|[-_. ]{3})(?:S|(?:Season|Saison|Series|Stagione)[_. ])?(?<season1>(?<!\d+)\d{1,2}(?!\d+)))+/i,
  ),
  partialSeason(
    'partial-season-pack',
    /^(?<title>[^\r\n]+?)(?:\W+S(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))\W+(?:(?:(?:Part|Vol)\W?|(?<!\d+\W+)e|p)(?<seasonpart>\d{1,2}(?!\d+)))+)/i,
  ),
  // Anime 4 digit absolute episodes, a 19xx/20xx year is not treated as an episode
  absoluteEpisode(
    'anime-subgroup-four-digit-absolute-range',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)[-_. ]+?\(?(?<absoluteepisode>\d{4}(\.\d{1,2})?(?!\d+))-(?<absoluteepisode1>\d{4}(\.\d{1,2})?(?!\d+))\)?/i,
  ),
  absoluteEpisode(
    'anime-subgroup-four-digit-absolute',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)[-_. ]+?(?!(?:19|20)\d{2}(?!\d))(?<absoluteepisode>\d{4}(\.\d{1,2})?(?!\d+))/i,
  ),
  seasonEpisode(
    'miniseries-multi-episode',
    /^(?<title>[^\r\n]+?)(?:[-._ ][e])(?<episode>\d{2,3}(?!\d+))(?:(?:-?[e])(?<episode1>\d{2,3}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'five-digit-episode-with-title',
    /^(?:(?<title>[^\r\n]+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+)))/i,
  ),
  seasonEpisode(
    'five-digit-multi-episode-with-title',
    /^(?:(?<title>[^\r\n]+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:[-_. ]{1,3}ep){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+))(?:(?:[-_. ]{1,3}ep){1,2}(?<episode1>(?<!\d+)\d{5}(?!\d+)))*/i,
  ),
  airDate(
    'ymd-airdate',
    /^(?<title>[^\r\n]+?)?\W*(?<airyear>\d{4})[-_. ]+(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])(?![-_. ]+[0-3][0-9])/i,
  ),
  absoluteEpisode(
    'anime-title-four-digit-absolute-subgroup',
    /^(?<title>[^\r\n]+?)[-_. ]+(?!(?:19|20)\d{2}(?!\d))(?<absoluteepisode>(?<!\d+)\d{4}(?!\d+))[-_. ]\[(?<subgroup>[^\]\r\n]+)\]/i,
  ),
  seasonEpisode(
    'miniseries-year-title-part-number',
    /^(?<title>[^\r\n]+?\d{4})\W+(?:Part\W?|e)(?<episode>\d{1,2}(?!\d+))(?:(?:Part\W?|e)(?<episode1>\d{1,2}(?!\d+)))*/i,
  ),
  // Title.S001E01 or Title.S001E01-E02
  seasonEpisode(
    'three-digit-season-multi-episode',
    /^(?<title>[^\r\n]+?)[-_. ]+S(?<season>(?<!\d+)\d{3}(?!\d+))E(?<episode>(?<!\d+)\d{2}(?!\d+))(?:-[ex](?<episode1>(?<!\d+)\d{2}(?!\d+)))?(?:[_. ]|$)(?!\\)/i,
  ),
  seasonEpisode(
    'miniseries-x-of-y',
    /^(?<title>[^\r\n]+?)(?:\W+(?:(?<episode>(?<!\d+)\d{1,2}(?!\d+))of\d+)+)/i,
  ),
  seasonEpisode(
    'season-episode-words',
    /^(?<title>[^\r\n]*?)(?:[-_\W](?<![()[]))+(?:\W?Season\W?)(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:\W|_)+(?:Episode\W)[-_. ]?(?<episode>(?<!\d+)\d{1,2}(?!\d+))(?:[-_. ]?(?<episode1>(?<!\d+)\d{1,2}(?!\d+)))*/i,
  ),
  seasonEpisode(
    'multi-episode-square-brackets',
    /^(?<title>[^\r\n]*?)[-._ ]+\[S(?<season>(?<!\d+)\d{2}(?!\d+))[E-]{1,2}(?<episode>(?<!\d+)\d{2}(?!\d+))(?:[E-]{1,2}(?<episode1>(?<!\d+)\d{2}(?!\d+)))*\]/i,
  ),
  seasonEpisode(
    'multi-episode-no-space-before-season',
    /^(?<title>[^\r\n]*?)S(?<season>(?<!\d+)\d{2}(?!\d+))E(?<episode>(?<!\d+)\d{2}(?!\d+))(?:E(?<episode1>(?<!\d+)\d{2}(?!\d+)))*/i,
  ),
  seasonEpisode(
    'single-episode-ep-label',
    /^(?<title>[^\r\n]*?)(?:\W?|_)S(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:\W|_)?Ep?[ ._]?(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,
  ),
  seasonEpisode(
    'three-digit-season',
    /^(?<title>[^\r\n]*?)(?:\W?|_)S(?<season>(?<!\d+)\d{3}(?!\d+))(?:\W|_)?E(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,
  ),
  seasonEpisode(
    'separated-season-and-episode',
    /^(?<title>[^\r\n]+?)(?:_|-|\s|\.)+S(?<season>\d{2}(?!\d+))(\W-\W)E(?<episode>(?<!\d+)\d{2}(?!\d+))(?!\\)/i,
  ),
  seasonEpisode(
    'season-episode-square-brackets',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+\[S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+|i|p))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>(?<!\d+)\d{2}(?!\d+|i|p)))*\])\W?(?!\\)/i,
  ),
  absoluteEpisode(
    'anime-title-with-season-number-absolute',
    /^(?<title>[^\r\n]+?S\d{1,2})[-_. ]{3,}(?:EP)?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+|[-]))/i,
  ),
  absoluteEpisode(
    'anime-french-title-single-episode',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)[-_. ]+(?:Episode[-_. ]+)(?<absoluteepisode>\d{1}(\.\d{1,2})?(?!\d+))/i,
  ),
  seasonPack(
    'season-only-followed-by-year',
    /^(?<title>[^\r\n]+?)[-_. ]+?(?:S|Season|Saison|Series|Stagione)[-_. ]?(?<season>\d{1,2}(?=[-_. ]\d{4}[-_. ]+))(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  seasonPack(
    'season-only',
    /^(?<title>[^\r\n]+?)[-_. /]+?(?:S|Season|Saison|Series|Stagione)[-_. ]?(?<season>\d{1,2}(?![-_. ]?\d+))(?:[-_. /]|$)+(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  seasonPack(
    'four-digit-season-only',
    /^(?<title>[^\r\n]+?)[-_. ]+?(?:S|Season|Saison|Series|Stagione)[-_. ]?(?<season>\d{4}(?![-_. ]?\d+))(\W+|_|$)(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  // Spanish tracker releases: Series - Temporada 1 [HDTV][Cap.101] or Series [HDTV][Cap.111_120]
  seasonEpisode(
    'spanish-temporada-cap',
    /^(?<title>[^\r\n]+?)(?:[-_. ]+?Temporada[^\r\n]+?|\[[^\]\r\n]*\])\[Cap[-_. ]+(?<season>(?<!\d+)\d{1,2})(?<episode>(?<!e|x)(?:[1-9][0-9]|[0][1-9]))(?:[-_. ]+(?<season1>(?<!\d+)\d{1,2})(?<episode1>(?<!e|x)(?:[1-9][0-9]|[0][1-9])))*\]/i,
  ),
  seasonEpisode(
    'three-digit-episode-numbering',
    /^(?<title>[^\r\n]+?)?(?:[_.](?<![()[!]))+(?<season>(?<!\d+)[1-9])(?<episode>[1-9][0-9]|[0][1-9])(?![a-z]|\d+)(?:(?:[_.](?<![()[!]))+(?<season1>(?<!\d+)[1-9])(?<episode1>[1-9][0-9]|[0][1-9])(?![a-z]|\d+))*(?:[_.]|$)/i,
  ),
  seasonEpisode(
    'four-digit-episode-number-no-title',
    /^(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>\d{4}(?!\d+|i|p)))*)(\W+|_|$)(?!\\)/i,
  ),
  seasonEpisode(
    'four-digit-episode-number-with-title',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>\d{4}(?!\d+|i|p)))*)\W?(?!\\)/i,
  ),
  // Turkish tracker releases: 01 BLM, 3. Blm, 04.Bolum
  absoluteEpisode(
    'turkish-bolum',
    /^(?<title>[^\r\n]+?)[_. ](?<absoluteepisode>\d{1,4})[_. ]+(?:BLM|B[oö]l[uü]m)/i,
  ),
  airDate(
    'mdy-airdate',
    /^(?<title>[^\r\n]+?)?\W*(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])[-_. ]+(?<airyear>\d{4})(?!\d+)/i,
  ),
  // Title.E195 or Title E1206
  absoluteEpisode(
    'anime-title-e-absolute',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)(?:_|-|\s|\.)+(?:e|ep)(?<absoluteepisode>(?:\d{3}|\d{4})(\.\d{1,2})?)(?:(?:_|-|\s|\.)+(?:e|ep)(?<absoluteepisode1>(?:\d{3}|\d{4})(\.\d{1,2})?))*[-_. ]/i,
  ),
  seasonEpisode(
    'four-digit-scene-numbering',
    /^(?<title>[^\r\n]+?)?(?:(?:[-_. ](?<![()[!]))*(?<!\d{1,2}-)(?<season>(?<!\d+|\(|\[|e|x)\d{2})(?<episode>(?<!e|x)(?:[1-9][0-9]|[0][1-9])(?!p|i|\d+|\)|\]|\W\d+|\W(?:e|ep|x)\d+)))+([-_. ]+|$)(?!\\)/i,
  ),
  // Dutch/Flemish: Series Se.1 afl.2-3-4, Series Se.3 afl.3 en 4
  seasonEpisode(
    'dutch-season-afl',
    /^(?<title>[^\r\n]+?)[-_. ]Se\.(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))[-_ ]?afl\.(?<episode>\d{1,3}(?!\d+))(?:(?:-|[-_ ]en[-_ ])(?<episode1>\d{1,3}(?!\d+)))*/i,
  ),
  seasonEpisode(
    'single-digit-episode',
    /^(?<title>[^\r\n]*?)(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:-|[ex]){1,2}(?<episode>\d{1})(?:(?:(?:[-_\W](?<![()[!]))+S?(?<season1>(?<!\d+)\d{1,2}(?!\d+)))?(?:-|[ex]){1,2}(?<episode1>\d{1}))*(\W+|_|$)(?!\\)/i,
  ),
  seasonEpisode(
    'itunes-season-folder',
    /^(?:Season(?:_|-|\s|\.)(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:_|-|\s|\.)(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,
  ),
  seasonEpisode(
    'itunes-season-episode',
    /^(?:(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:-(?<episode>\d{2,3}(?!\d+))))/i,
  ),
  seasonEpisode(
    'miniseries-part-number',
    /^(?<title>[^\r\n]+?)\W+(?:Part\W?|(?<!\d+\W+)e)(?<episode>\d{1,2}(?!\d+))(?:(?:Part\W?|(?<!\d+\W+)e)(?<episode1>\d{1,2}(?!\d+)))*/i,
  ),
  seasonEpisode(
    'miniseries-part-word',
    /^(?<title>[^\r\n]+?)(?:\W+(?:Part[-._ ](?<episode>One|Two|Three|Four|Five|Six|Seven|Eight|Nine)(?:[-._ ]|$)))/i,
  ),
  absoluteEpisode(
    'anime-absolute-ep-label',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)(?:_|-|\s|\.)+(?:e|ep)(?<absoluteepisode>\d{2,4}(\.\d{1,2})?)(?:(?:_|-|\s|\.)+(?:e|ep)(?<absoluteepisode1>\d{2,4}(\.\d{1,2})?))*[^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-title-episode-absolute',
    /^(?<title>[^\r\n]+?)[-_. ](?:Episode)[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+))(?:[-_. ]+(?<absoluteepisode1>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))*[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  seasonPack(
    'spanish-temporada-season-only',
    /^(?<title>[^\r\n]+?)[_. ]-[_. ]Temporada[-_. ]?(?<season>\d{1,2}(?![_. ]?\d+))(?:[_. ]|$)+(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-number',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+))(?:[-_. ]+(?<absoluteepisode1>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))*[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-title-braced-absolute-number',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+))(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode1>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))*[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  // AniLibria: Series_Title_2_[01]_[AniLibria_TV]. Later than Sonarr has it so a trailing [449]
  // tag doesn't beat an earlier absolute number.
  absoluteEpisode(
    'anime-title-bracketed-absolute',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)[-_. ]\[-?(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+|[ip]))(?:-?(?<absoluteepisode1>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+|[ip])))*\][-_. ]/i,
  ),
  seasonEpisode(
    'extant-multi-episode-numbering',
    /^(?<title>[^\r\n]+?)[-_. ](?<season>0?\d)(?<episode>\d{2})(?<episode1>\d{2})(?!\d+)[-_. ]/i,
  ),
  // S1E1, 1x1
  seasonEpisode(
    'single-digit-episode-no-title',
    /^S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))[-_ ]?[ex](?<episode>\d(?!\d+))/i,
  ),
  seasonEpisode(
    'three-digit-season-with-title',
    /^(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{3}(?!\d+))(?:[ex]|\W[ex]){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*(?:[-_. ]|$)/i,
  ),
];

// Resolutions that simplifyTitle leaves behind, removed so they are not read as season or episode
// numbers. Matches the resolution part of Sonarr's SimpleTitleRegex.
export const seasonSimpleTitleExp =
  /(?:(?:480|540|576|720|1080|1440|2160)[ip]|(?<![a-z\d])[248]k(?![a-z\d]))\s*?/gi;

// Rewrites applied to the release title before the season patterns run
export const preSubstitutions: Array<[RegExp, string]> = [
  // Korean series without a season number, replace with S01Exxx and remove the air date
  [/\.E(\d{2,4})\.\d{6}\.(.*-(?:F1RST|NEXT)(?:\.[a-z\d]{2,4})?)$/, '.S01E$1.$2'],
];

export const rejectedPatterns = [
  /^[0-9a-zA-Z]{32}/i,
  /^[a-z0-9]{24}$/i,
  // NZBGeek hashes, case sensitive since they are close to 101 style episode numbering
  /^[A-Z]{11}\d{3}$/,
  /^[a-z]{12}\d{3}$/,
  /^Backup_\d{5,}S\d{2}-\d{2}$/i,
  /^123$/,
  /^abc$/i,
  /^abc[-_. ]xyz/i,
  /^b00bs$/i,
  /^\d{6}_\d{2}$/,
];
