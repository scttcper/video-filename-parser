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
  parse: (match: RegExpExecArray, simpleTitle: string) => ParsedMatchCollection | null;
}

const airDate = (name: string, regex: RegExp): SeasonPattern => ({
  name,
  regex,
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
    /^(?<title>.+?)[-_. ]S(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:[E-_. ]?[ex]?(?<episode>(?<!\d+)\d{1,2}(?!\d+)))+(?:[-_. ]?[ex]?(?<episode1>(?<!\d+)\d{1,2}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'multi-episode-with-title-and-trailing-info',
    /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>\d{2,3}(?!\d+)))+).+?(?:\[.+?\])(?!\\)/i,
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
    /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>.+?)[-_. ](?:Episode)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-subgroup-absolute-plus-season-episode',
    /^(?:\[(?<subgroup>.+?)\](?:_|-|\s|\.)?)(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?))+(?:_|-|\s|\.)+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+).*?(?<hash>[([]\w{8}[)\]])?(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-season-episode-plus-absolute',
    /^(?:\[(?<subgroup>.+?)\](?:_|-|\s|\.)?)(?<title>.+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+)(?:(?:_|-|\s|\.)+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+.*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  ),
  seasonEpisode(
    'anime-subgroup-season-episode',
    /^(?:\[(?<subgroup>.+?)\](?:_|-|\s|\.)?)(?<title>.+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+)(?:\s|\.).*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-with-trailing-number',
    /^\[(?<subgroup>.+?)\][-_. ]?(?<title>[^-]+?\d+?)[-_. ]+(?:[-_. ]?(?<absoluteepisode>\d{3}(\.\d{1,2})?(?!\d+)))+(?:[-_. ]+(?<special>special|ova|ovd))?.*?(?<hash>\[\w{8}\])?(?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-dash-absolute',
    /^\[(?<subgroup>.+?)\][-_. ]?(?<title>.+?)(?:[. ]-[. ](?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+|[-])))+(?:[-_. ]+(?<special>special|ova|ovd))?.*?(?<hash>\[\w{8}\])?(?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-subgroup-title-absolute',
    /^\[(?<subgroup>.+?)\][-_. ]?(?<title>.+?)[-_. ]+\(?(?:[-_. ]?#?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+\)?(?:[-_. ]+(?<special>special|ova|ovd))?.*?(?<hash>\[\w{8}\])?(?:$|\.mkv)/i,
  ),
  seasonEpisode(
    'multi-episode-repeated',
    /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[ex]|[-_. ]e){1,2}(?<episode>\d{1,3}(?!\d+)))+){2,}/i,
  ),
  seasonEpisode(
    'single-episode-with-title',
    /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>(?!265|264)\d{2,3}(?!\d+|(?:[ex]|\W[ex]|_|-){1,2})))/i,
  ),
  absoluteEpisode(
    'anime-title-season-episode-plus-absolute-subgroup',
    /^(?<title>.+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+)))).+?(?:[-_. ]?(?<absoluteepisode>(?<!\d+)\d{3}(\.\d{1,2})?(?!\d+)))+.+?\[(?<subgroup>.+?)\](?:$|\.mkv)/i,
  ),
  absoluteEpisode(
    'anime-title-episode-absolute-subgroup',
    /^(?<title>.+?)[-_. ]Episode(?:[-_. ]+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:.+?)\[(?<subgroup>.+?)\].*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-subgroup-hash',
    /^(?<title>.+?)(?:(?:_|-|\s|\.)+(?<absoluteepisode>\d{3}(\.\d{1,2})(?!\d+)))+(?:.+?)\[(?<subgroup>.+?)\].*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-absolute-ep-range',
    /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:_|\s|\.)+(?:e|ep)(?<absoluteepisode>\d{2,3}(\.\d{1,2})?)-(?<absoluteepisode1>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+|-)).*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-absolute-number-range',
    /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)[_. ]+(?<absoluteepisode>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+))-(?<absoluteepisode1>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+|-))(?:_|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-hash',
    /^(?<title>.+?)(?:(?:_|-|\s|\.)+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:[-_. ]+(?<special>special|ova|ovd))?[-_. ]+.*?(?<hash>\[\w{8}\])(?:$|\.)/i,
  ),
  seasonEpisode(
    'airdate-plus-season-episode',
    /^(?<title>.+?)?\W*(?<airdate>\d{4}\W+[0-1][0-9]\W+[0-3][0-9])(?!\W+[0-3][0-9])[-_. ](?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,
  ),
  airDate(
    'airdate-and-season-episode',
    /^(?<title>.+?)?\W*(?<airyear>\d{4})\W+(?<airmonth>[0-1][0-9])\W+(?<airday>[0-3][0-9])(?!\W+[0-3][0-9]).+?(?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,
  ),
  seasonEpisode(
    'four-digit-season-s-episode',
    /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:e|\We|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|e|\We|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,
  ),
  seasonEpisode(
    'four-digit-season-x-episode',
    /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:x|\Wx){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|x|\Wx|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,
  ),
  seasonPack(
    'multi-season-pack',
    /^(?<title>.+?)[-_. ]+S(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))\W?-\W?S?(?<season1>(?<!\d+)(?:\d{1,2})(?!\d+))/i,
  ),
  partialSeason(
    'partial-season-pack',
    /^(?<title>.+?)(?:\W+S(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))\W+(?:(?:Part\W?|(?<!\d+\W+)e)(?<seasonpart>\d{1,2}(?!\d+)))+)/i,
  ),
  seasonEpisode(
    'miniseries-year-title-part-number',
    /^(?<title>.+?\d{4})(?:\W+(?:(?:Part\W?|e)(?<episode>\d{1,2}(?!\d+)))+)/i,
  ),
  seasonEpisode(
    'miniseries-multi-episode',
    /^(?<title>.+?)(?:[-._ ][e])(?<episode>\d{2,3}(?!\d+))(?:(?:-?[e])(?<episode1>\d{2,3}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'miniseries-part-number',
    /^(?<title>.+?)(?:\W+(?:(?:Part\W?|(?<!\d+\W+)e)(?<episode>\d{1,2}(?!\d+)))+)/i,
  ),
  seasonEpisode(
    'miniseries-part-word',
    /^(?<title>.+?)(?:\W+(?:Part[-._ ](?<episode>One|Two|Three|Four|Five|Six|Seven|Eight|Nine)(>[-._ ])))/i,
  ),
  seasonEpisode(
    'miniseries-x-of-y',
    /^(?<title>.+?)(?:\W+(?:(?<episode>(?<!\d+)\d{1,2}(?!\d+))of\d+)+)/i,
  ),
  seasonEpisode(
    'season-episode-words',
    /(?:.*(?:""|^))(?<title>.*?)(?:[-_\W](?<![()[]))+(?:\W?Season\W?)(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:\W|_)+(?:Episode\W)(?:[-_. ]?(?<episode>(?<!\d+)\d{1,2}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'multi-episode-square-brackets',
    /(?:.*(?:^))(?<title>.*?)[-._ ]+\[S(?<season>(?<!\d+)\d{2}(?!\d+))(?:[E-]{1,2}(?<episode>(?<!\d+)\d{2}(?!\d+)))+\]/i,
  ),
  seasonEpisode(
    'multi-episode-no-space-before-season',
    /(?:.*(?:^))(?<title>.*?)S(?<season>(?<!\d+)\d{2}(?!\d+))(?:E(?<episode>(?<!\d+)\d{2}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'single-episode-ep-label',
    /(?:.*(?:""|^))(?<title>.*?)(?:\W?|_)S(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:\W|_)?Ep?[ ._]?(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,
  ),
  seasonEpisode(
    'three-digit-season',
    /(?:.*(?:""|^))(?<title>.*?)(?:\W?|_)S(?<season>(?<!\d+)\d{3}(?!\d+))(?:\W|_)?E(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,
  ),
  seasonEpisode(
    'five-digit-episode-with-title',
    /^(?:(?<title>.+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+)))/i,
  ),
  seasonEpisode(
    'five-digit-multi-episode-with-title',
    /^(?:(?<title>.+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:(?:[-_. ]{1,3}ep){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+)))+/i,
  ),
  seasonEpisode(
    'separated-season-and-episode',
    /^(?<title>.+?)(?:_|-|\s|\.)+S(?<season>\d{2}(?!\d+))(\W-\W)E(?<episode>(?<!\d+)\d{2}(?!\d+))(?!\\)/i,
  ),
  absoluteEpisode(
    'anime-title-with-season-number-absolute',
    /^(?<title>.+?S\d{1,2})[-_. ]{3,}(?:EP)?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+|[-]))/i,
  ),
  absoluteEpisode(
    'anime-french-title-single-episode',
    /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)[-_. ]+?(?:Episode[-_. ]+?)(?<absoluteepisode>\d{1}(\.\d{1,2})?(?!\d+))/i,
  ),
  seasonPack(
    'season-only',
    /^(?<title>.+?)\W(?:S|Season)\W?(?<season>\d{1,2}(?!\d+))(\W+|_|$)(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  seasonPack(
    'four-digit-season-only',
    /^(?<title>.+?)\W(?:S|Season)\W?(?<season>\d{4}(?!\d+))(\W+|_|$)(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,
  ),
  seasonEpisode(
    'season-episode-square-brackets',
    /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+\[S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+|i|p)))+\])\W?(?!\\)/i,
  ),
  seasonEpisode(
    'three-digit-episode-numbering',
    /^(?<title>.+?)?(?:(?:[_.](?<![()[!]))+(?<season>(?<!\d+)[1-9])(?<episode>[1-9][0-9]|[0][1-9])(?![a-z]|\d+))+(?:[_.]|$)/i,
  ),
  seasonEpisode(
    'four-digit-episode-number-no-title',
    /^(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p)))+)(\W+|_|$)(?!\\)/i,
  ),
  seasonEpisode(
    'four-digit-episode-number-with-title',
    /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p)))+)\W?(?!\\)/i,
  ),
  airDate(
    'ymd-airdate',
    /^(?<title>.+?)?\W*(?<airyear>\d{4})[-_. ]+(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])(?![-_. ]+[0-3][0-9])/i,
  ),
  airDate(
    'mdy-airdate',
    /^(?<title>.+?)?\W*(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])[-_. ]+(?<airyear>\d{4})(?!\d+)/i,
  ),
  seasonEpisode(
    'four-digit-scene-numbering',
    /^(?<title>.+?)?(?:(?:[-_\W](?<![()[!]))*(?<season>(?<!\d+|\(|\[|e|x)\d{2})(?<episode>(?<!e|x)\d{2}(?!p|i|\d+|\)|\]|\W\d+|\W(?:e|ep|x)\d+)))+(\W+|_|$)(?!\\)/i,
  ),
  seasonEpisode(
    'single-digit-episode',
    /^(?<title>.*?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]){1,2}(?<episode>\d{1}))+)+(\W+|_|$)(?!\\)/i,
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
    /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:(?:_|-|\s|\.)+(?:e|ep)(?<absoluteepisode>\d{2,4}(\.\d{1,2})?))+.*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  ),
  absoluteEpisode(
    'anime-title-episode-absolute',
    /^(?<title>.+?)[-_. ](?:Episode)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-title-absolute-number',
    /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,
  ),
  absoluteEpisode(
    'anime-title-braced-absolute-number',
    /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,
  ),
  seasonEpisode(
    'extant-multi-episode-numbering',
    /^(?<title>.+?)[-_. ](?<season>[0]?\d?)(?:(?<episode>\d{2}){2}(?!\d+))[-_. ]/i,
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
