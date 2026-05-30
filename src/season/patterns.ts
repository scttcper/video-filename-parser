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

export const seasonPatterns: SeasonPattern[] = [
  airDate(
    'daily-airdate-no-title',
    /^(?<airyear>19[6-9]\d|20\d\d)(?<sep>[-_]?)(?<airmonth>0\d|1[0-2])\k<sep>(?<airday>[0-2]\d|3[01])(?!\d)/i,
  ),
  seasonEpisode(
    'multi-part-no-title',
    /^(?:\W*S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[ex]){1,2}(?<episode>\d{1,3}(?!\d+)))+){2,}/i,
  ),
  seasonEpisode(
    'multi-episode-single-episode-numbers',
    /^(?<title>[^\r\n]+?)[-_. ]S(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:[E-_. ]?[ex]?(?<episode>(?<!\d+)\d{1,2}(?!\d+)))+(?:[-_. ]?[ex]?(?<episode1>(?<!\d+)\d{1,2}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'multi-episode-with-title-and-trailing-info',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>\d{2,3}(?!\d+)))+)[^[\]\r\n]*(?:\[[^\]\r\n]+\])(?!\\)/i,
  ),
  seasonEpisode(
    'multi-episode-no-title',
    /(?:S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[-_]|[ex]){1,2}(?<episode>\d{2,3}(?!\d+))){2,})/i,
  ),
  seasonEpisode(
    'single-episode-no-title',
    /^(?:S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[-_ ]?[ex])(?<episode>\d{2,3}(?!\d+))))/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-episode-absolute',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)(?<title>[^\r\n]+?)[-_. ](?:Episode)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-subgroup-absolute-plus-season-episode',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\](?:_|-|\s|\.)?)(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?))+(?:_|-|\s|\.)+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+)[^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-season-episode-plus-absolute',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\](?:_|-|\s|\.)?)(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+)(?:(?:_|-|\s|\.)+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+[^\r\n]*(?:$|\.)/i,
  ),
  seasonEpisode(
    'anime-subgroup-season-episode',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\](?:_|-|\s|\.)?)(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+)(?:\s|\.)[^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-with-trailing-number',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^-\r\n]*?\d+)[-_. ]+(?:[-_. ]?(?<absoluteepisode>\d{3}(\.\d{1,2})?(?!\d+)))+(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-dash-absolute',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)(?:[. ]-[. ](?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+|[-])))+(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-absolute',
    /^\[(?<subgroup>[^\]\r\n]+)\][-_. ]?(?<title>[^\r\n]+?)[-_. ]+\(?(?:[-_. ]?#?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+\)?(?:[-_. ]+(?<special>special|ova|ovd))?[^\r\n]*(?:$|\.mkv)/i,
  ),
  seasonEpisode(
    'multi-episode-repeated',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[ex]|[-_. ]e){1,2}(?<episode>\d{1,3}(?!\d+)))+){2,}/i,
  ),
  seasonEpisode(
    'single-episode-with-title',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>(?!265|264)\d{2,3}(?!\d+|(?:[ex]|\W[ex]|_|-){1,2})))/i,
  ),
  absoluteEpisode(
    'anime-title-season-episode-plus-absolute-subgroup',
    /^(?<title>[^\r\n]+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+))))(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{3}(\.\d{1,2})?(?!\d+)))+[^[\]\r\n]*\[(?<subgroup>[^\]\r\n]+)\](?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-title-episode-absolute-subgroup',
    /^(?<title>[^\r\n]+?)[-_. ]Episode(?:[-_. ]+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+[^[\]\r\n]*\[(?<subgroup>[^\]\r\n]+)\][^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-subgroup-hash',
    /^(?<title>[^\r\n]+?)(?:(?:_|-|\s|\.)+(?<absoluteepisode>\d{3}(\.\d{1,2})(?!\d+)))+[^[\]\r\n]*\[(?<subgroup>[^\]\r\n]+)\][^\r\n]*(?:$|\.)/i,
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
    /^(?<title>[^\r\n]+?)(?:(?:_|-|\s|\.)+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:[-_. ]+(?<special>special|ova|ovd))?[-_. ]+[^[\]\r\n]*(?<hash>\[\w{8}\])(?:$|\.)/i,
  ),
  seasonEpisode(
    'airdate-plus-season-episode',
    /^(?<title>[^\r\n]+?)?\W*(?<airdate>\d{4}\W+[0-1][0-9]\W+[0-3][0-9])(?!\W+[0-3][0-9])[-_. ](?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,
  ),
  airDate(
    'airdate-and-season-episode',
    /^(?<title>[^\r\n]+?)?\W*(?<airyear>\d{4})\W+(?<airmonth>[0-1][0-9])\W+(?<airday>[0-3][0-9])(?!\W+[0-3][0-9])[^\r\n]*?(?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,
  ),
  seasonEpisode(
    'four-digit-season-s-episode',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:e|\We|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|e|\We|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,
  ),
  seasonEpisode(
    'four-digit-season-x-episode',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:x|\Wx){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|x|\Wx|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,
  ),
  seasonPack(
    'multi-season-pack',
    /^(?<title>[^\r\n]+?)[-_. ]+S(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))\W?-\W?S?(?<season1>(?<!\d+)(?:\d{1,2})(?!\d+))/i,
  ),
  partialSeason(
    'partial-season-pack',
    /^(?<title>[^\r\n]+?)(?:\W+S(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))\W+(?:(?:Part\W?|(?<!\d+\W+)e)(?<seasonpart>\d{1,2}(?!\d+)))+)/i,
  ),
  seasonEpisode(
    'miniseries-year-title-part-number',
    /^(?<title>[^\r\n]+?\d{4})(?:\W+(?:(?:Part\W?|e)(?<episode>\d{1,2}(?!\d+)))+)/i,
  ),
  seasonEpisode(
    'miniseries-multi-episode',
    /^(?<title>[^\r\n]+?)(?:[-._ ][e])(?<episode>\d{2,3}(?!\d+))(?:(?:-?[e])(?<episode1>\d{2,3}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'miniseries-part-number',
    /^(?<title>[^\r\n]+?)(?:\W+(?:(?:Part\W?|(?<!\d+\W+)e)(?<episode>\d{1,2}(?!\d+)))+)/i,
  ),
  seasonEpisode(
    'miniseries-part-word',
    /^(?<title>[^\r\n]+?)(?:\W+(?:Part[-._ ](?<episode>One|Two|Three|Four|Five|Six|Seven|Eight|Nine)(>[-._ ])))/i,
  ),
  seasonEpisode(
    'miniseries-x-of-y',
    /^(?<title>[^\r\n]+?)(?:\W+(?:(?<episode>(?<!\d+)\d{1,2}(?!\d+))of\d+)+)/i,
  ),
  seasonEpisode(
    'season-episode-words',
    /^(?<title>[^\r\n]*?)(?:[-_\W](?<![()[]))+(?:\W?Season\W?)(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:\W|_)+(?:Episode\W)(?:[-_. ]?(?<episode>(?<!\d+)\d{1,2}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'multi-episode-square-brackets',
    /^(?<title>[^\r\n]*?)[-._ ]+\[S(?<season>(?<!\d+)\d{2}(?!\d+))(?:[E-]{1,2}(?<episode>(?<!\d+)\d{2}(?!\d+)))+\]/i,
  ),
  seasonEpisode(
    'multi-episode-no-space-before-season',
    /^(?<title>[^\r\n]*?)S(?<season>(?<!\d+)\d{2}(?!\d+))(?:E(?<episode>(?<!\d+)\d{2}(?!\d+)))+/i,
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
    'five-digit-episode-with-title',
    /^(?:(?<title>[^\r\n]+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+)))/i,
  ),
  seasonEpisode(
    'five-digit-multi-episode-with-title',
    /^(?:(?<title>[^\r\n]+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:(?:[-_. ]{1,3}ep){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'separated-season-and-episode',
    /^(?<title>[^\r\n]+?)(?:_|-|\s|\.)+S(?<season>\d{2}(?!\d+))(\W-\W)E(?<episode>(?<!\d+)\d{2}(?!\d+))(?!\\)/i,
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
    'season-only',
    /^(?<title>[^\r\n]+?)\W(?:S|Season)\W?(?<season>\d{1,2}(?!\d+))(\W+|_|$)(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  seasonPack(
    'four-digit-season-only',
    /^(?<title>[^\r\n]+?)\W(?:S|Season)\W?(?<season>\d{4}(?!\d+))(\W+|_|$)(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  seasonEpisode(
    'season-episode-square-brackets',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+\[S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+|i|p)))+\])\W?(?!\\)/i,
  ),
  seasonEpisode(
    'three-digit-episode-numbering',
    /^(?<title>[^\r\n]+?)?(?:(?:[_.](?<![()[!]))+(?<season>(?<!\d+)[1-9])(?<episode>[1-9][0-9]|[0][1-9])(?![a-z]|\d+))+(?:[_.]|$)/i,
  ),
  seasonEpisode(
    'four-digit-episode-number-no-title',
    /^(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p)))+)(\W+|_|$)(?!\\)/i,
  ),
  seasonEpisode(
    'four-digit-episode-number-with-title',
    /^(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p)))+)\W?(?!\\)/i,
  ),
  airDate(
    'ymd-airdate',
    /^(?<title>[^\r\n]+?)?\W*(?<airyear>\d{4})[-_. ]+(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])(?![-_. ]+[0-3][0-9])/i,
  ),
  airDate(
    'mdy-airdate',
    /^(?<title>[^\r\n]+?)?\W*(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])[-_. ]+(?<airyear>\d{4})(?!\d+)/i,
  ),
  seasonEpisode(
    'four-digit-scene-numbering',
    /^(?<title>[^\r\n]+?)?(?:(?:[-_\W](?<![()[!]))*(?<season>(?<!\d+|\(|\[|e|x)\d{2})(?<episode>(?<!e|x)\d{2}(?!p|i|\d+|\)|\]|\W\d+|\W(?:e|ep|x)\d+)))+(\W+|_|$)(?!\\)/i,
  ),
  seasonEpisode(
    'single-digit-episode',
    /^(?<title>[^\r\n]*?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]){1,2}(?<episode>\d{1}))+)+(\W+|_|$)(?!\\)/i,
  ),
  seasonEpisode(
    'itunes-season-folder',
    /^(?:Season(?:_|-|\s|\.)(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:_|-|\s|\.)(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,
  ),
  seasonEpisode(
    'itunes-season-episode',
    /^(?:(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:-(?<episode>\d{2,3}(?!\d+))))/i,
  ),
  absoluteEpisode(
    'anime-absolute-ep-label',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)(?:(?:_|-|\s|\.)+(?:e|ep)(?<absoluteepisode>\d{2,4}(\.\d{1,2})?))+[^\r\n]*(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-title-episode-absolute',
    /^(?<title>[^\r\n]+?)[-_. ](?:Episode)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-number',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-title-braced-absolute-number',
    /^(?:\[(?<subgroup>[^\]\r\n]+)\][-_. ]?)?(?<title>[^\r\n]+?)(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+[-_. ]*(?<hash>\[\w{8}\])?(?:$|\.)?/i,
  ),
  seasonEpisode(
    'extant-multi-episode-numbering',
    /^(?<title>[^\r\n]+?)[-_. ](?<season>[0]?\d?)(?:(?<episode>\d{2}){2}(?!\d+))[-_. ]/i,
  ),
];

export const rejectedPatterns = [
  /^[0-9a-zA-Z]{32}/i,
  /^[a-z0-9]{24}$/i,
  /"^[A-Z]{11}\d{3}$/i,
  /"^[a-z]{12}\d{3}$/i,
  /^Backup_\d{5,}S\d{2}-\d{2}$/i,
  /^123$"/,
  /^abc$"/i,
  /^b00bs$"/i,
  /^\d{6}_\d{2}$"/,
];
