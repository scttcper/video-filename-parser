/* eslint-disable complexity */
import { simplifyTitle } from './simplifyTitle';

const reportTitleExp = [
  // Daily episodes without title (2018-10-12, 20181012) (Strict pattern to avoid false matches)
  /^(?<airyear>19[6-9]\d|20\d\d)(?<sep>[-_]?)(?<airmonth>0\d|1[0-2])\k<sep>(?<airday>[0-2]\d|3[01])(?!\d)/i,
  // Multi-Part episodes without a title (S01E05.S01E06)
  /^(?:\W*S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[ex]){1,2}(?<episode>\d{1,3}(?!\d+)))+){2,}/i,

  // Multi-episode with single episode numbers (S6.E1-E2, S6.E1E2, S6E1E2, etc)
  /^(?<title>.+?)[-_. ]S(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:[E-_. ]?[ex]?(?<episode>(?<!\d+)\d{1,2}(?!\d+)))+(?:[-_. ]?[ex]?(?<episode1>(?<!\d+)\d{1,2}(?!\d+)))+/i,

  // Multi-Episode with a title (S01E05E06, S01E05-06, S01E05 E06, etc) and trailing info in slashes
  /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>\d{2,3}(?!\d+)))+).+?(?:\[.+?\])(?!\\)/i,

  // Episodes without a title, Multi (S01E04E05, 1x04x05, etc)
  /(?:S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[-_]|[ex]){1,2}(?<episode>\d{2,3}(?!\d+))){2,})/i,
  // Episodes without a title, Single (S01E05, 1x05)
  /^(?:S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[-_ ]?[ex])(?<episode>\d{2,3}(?!\d+))))/i,
  // Anime - [SubGroup] Title Episode Absolute Episode Number ([SubGroup] Series Title Episode 01)
  /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>.+?)[-_. ](?:Episode)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,
  // Anime - [SubGroup] Title Absolute Episode Number + Season+Episode
  /^(?:\[(?<subgroup>.+?)\](?:_|-|\s|\.)?)(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?))+(?:_|-|\s|\.)+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+).*?(?<hash>[([]\w{8}[)\]])?(?:$|\.)/i,
  // Anime - [SubGroup] Title Season+Episode + Absolute Episode Number
  /^(?:\[(?<subgroup>.+?)\](?:_|-|\s|\.)?)(?<title>.+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+)(?:(?:_|-|\s|\.)+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+.*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  // Anime - [SubGroup] Title Season+Episode
  /^(?:\[(?<subgroup>.+?)\](?:_|-|\s|\.)?)(?<title>.+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode>\d{2}(?!\d+)))+)(?:\s|\.).*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  // Anime - [SubGroup] Title with trailing number Absolute Episode Number
  /^\[(?<subgroup>.+?)\][-_. ]?(?<title>[^-]+?\d+?)[-_. ]+(?:[-_. ]?(?<absoluteepisode>\d{3}(\.\d{1,2})?(?!\d+)))+(?:[-_. ]+(?<special>special|ova|ovd))?.*?(?<hash>\[\w{8}\])?(?:$|\.mkv)/i,
  // Anime - [SubGroup] Title - Absolute Episode Number
  /^\[(?<subgroup>.+?)\][-_. ]?(?<title>.+?)(?:[. ]-[. ](?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+|[-])))+(?:[-_. ]+(?<special>special|ova|ovd))?.*?(?<hash>\[\w{8}\])?(?:$|\.mkv)/i,

  // Anime - [SubGroup] Title Absolute Episode Number
  /^\[(?<subgroup>.+?)\][-_. ]?(?<title>.+?)[-_. ]+\(?(?:[-_. ]?#?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+\)?(?:[-_. ]+(?<special>special|ova|ovd))?.*?(?<hash>\[\w{8}\])?(?:$|\.mkv)/i,
  // Multi-episode Repeated (S01E05 - S01E06, 1x05 - 1x06, etc)
  /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2}|\d{4})(?!\d+))(?:(?:[ex]|[-_. ]e){1,2}(?<episode>\d{1,3}(?!\d+)))+){2,}/i,

  // Single episodes with a title (S01E05, 1x05, etc)
  // modified from sonarr to not match "trailing info in slashes"
  /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]|_){1,2}(?<episode>(?!265|264)\d{2,3}(?!\d+|(?:[ex]|\W[ex]|_|-){1,2})))/i,

  // Anime - Title Season EpisodeNumber + Absolute Episode Number [SubGroup]
  /^(?<title>.+?)(?:[-_\W](?<![()[!]))+(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:[ex]|\W[ex]){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+)))).+?(?:[-_. ]?(?<absoluteepisode>(?<!\d+)\d{3}(\.\d{1,2})?(?!\d+)))+.+?\[(?<subgroup>.+?)\](?:$|\.mkv)/i,

  // Anime - Title Absolute Episode Number [SubGroup] [Hash]? (Series Title Episode 99-100 [RlsGroup] [ABCD1234])
  /^(?<title>.+?)[-_. ]Episode(?:[-_. ]+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:.+?)\[(?<subgroup>.+?)\].*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  // Anime - Title Absolute Episode Number [SubGroup] [Hash]
  /^(?<title>.+?)(?:(?:_|-|\s|\.)+(?<absoluteepisode>\d{3}(\.\d{1,2})(?!\d+)))+(?:.+?)\[(?<subgroup>.+?)\].*?(?<hash>\[\w{8}\])?(?:$|\.)/i,

  // Anime - Title Absolute Episode Number [Hash]
  /^(?<title>.+?)(?:(?:_|-|\s|\.)+(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:[-_. ]+(?<special>special|ova|ovd))?[-_. ]+.*?(?<hash>\[\w{8}\])(?:$|\.)/i,

  // Episodes with airdate AND season/episode number, capture season/epsiode only
  /^(?<title>.+?)?\W*(?<airdate>\d{4}\W+[0-1][0-9]\W+[0-3][0-9])(?!\W+[0-3][0-9])[-_. ](?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,

  // Episodes with airdate AND season/episode number
  /^(?<title>.+?)?\W*(?<airyear>\d{4})\W+(?<airmonth>[0-1][0-9])\W+(?<airday>[0-3][0-9])(?!\W+[0-3][0-9]).+?(?:s?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+)))(?:[ex](?<episode>(?<!\d+)(?:\d{1,3})(?!\d+)))/i,

  // Episodes with a title, Single episodes (S01E05, 1x05, etc) & Multi-episode (S01E05E06, S01E05-06, S01E05 E06, etc)
  // /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:[ex]|\W[ex]){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,

  // Episodes with a title, 4 digit season number, Single episodes (S2016E05, etc) & Multi-episode (S2016E05E06, S2016E05-06, S2016E05 E06, etc)
  /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:e|\We|_){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|e|\We|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,

  // Episodes with a title, 4 digit season number, Single episodes (2016x05, etc) & Multi-episode (2016x05x06, 2016x05-06, 2016x05 x06, etc)
  /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+(?<season>(?<!\d+)(?:\d{4})(?!\d+))(?:x|\Wx){1,2}(?<episode>\d{2,3}(?!\d+))(?:(?:-|x|\Wx|_){1,2}(?<episode1>\d{2,3}(?!\d+)))*)\W?(?!\\)/i,

  // Multi-season pack
  /^(?<title>.+?)[-_. ]+S(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))\W?-\W?S?(?<season1>(?<!\d+)(?:\d{1,2})(?!\d+))/i,

  // Partial season pack
  /^(?<title>.+?)(?:\W+S(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))\W+(?:(?:Part\W?|(?<!\d+\W+)e)(?<seasonpart>\d{1,2}(?!\d+)))+)/i,

  // Mini-Series with year in title, treated as season 1, episodes are labelled as Part01, Part 01, Part.1
  /^(?<title>.+?\d{4})(?:\W+(?:(?:Part\W?|e)(?<episode>\d{1,2}(?!\d+)))+)/i,
  // Mini-Series, treated as season 1, multi episodes are labelled as E1-E2
  /^(?<title>.+?)(?:[-._ ][e])(?<episode>\d{2,3}(?!\d+))(?:(?:-?[e])(?<episode1>\d{2,3}(?!\d+)))+/i,

  // Mini-Series, treated as season 1, episodes are labelled as Part01, Part 01, Part.1
  /^(?<title>.+?)(?:\W+(?:(?:Part\W?|(?<!\d+\W+)e)(?<episode>\d{1,2}(?!\d+)))+)/i,

  // Mini-Series, treated as season 1, episodes are labelled as Part One/Two/Three/...Nine, Part.One, Part_One
  /^(?<title>.+?)(?:\W+(?:Part[-._ ](?<episode>One|Two|Three|Four|Five|Six|Seven|Eight|Nine)(>[-._ ])))/i,

  // Mini-Series, treated as season 1, episodes are labelled as XofY
  /^(?<title>.+?)(?:\W+(?:(?<episode>(?<!\d+)\d{1,2}(?!\d+))of\d+)+)/i,

  // Supports Season 01 Episode 03
  /(?:.*(?:""|^))(?<title>.*?)(?:[-_\W](?<![()[]))+(?:\W?Season\W?)(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:\W|_)+(?:Episode\W)(?:[-_. ]?(?<episode>(?<!\d+)\d{1,2}(?!\d+)))+/i,

  // Multi-episode with episodes in square brackets (Series Title [S01E11E12] or Series Title [S01E11-12])
  /(?:.*(?:^))(?<title>.*?)[-._ ]+\[S(?<season>(?<!\d+)\d{2}(?!\d+))(?:[E-]{1,2}(?<episode>(?<!\d+)\d{2}(?!\d+)))+\]/i,

  // Multi-episode release with no space between series title and season (S01E11E12)
  /(?:.*(?:^))(?<title>.*?)S(?<season>(?<!\d+)\d{2}(?!\d+))(?:E(?<episode>(?<!\d+)\d{2}(?!\d+)))+/i,

  // Single episode season or episode S1E1 or S1-E1 or S1.Ep1 or S01.Ep.01
  /(?:.*(?:""|^))(?<title>.*?)(?:\W?|_)S(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:\W|_)?Ep?[ ._]?(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,

  // 3 digit season S010E05
  /(?:.*(?:""|^))(?<title>.*?)(?:\W?|_)S(?<season>(?<!\d+)\d{3}(?!\d+))(?:\W|_)?E(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,

  // 5 digit episode number with a title
  /^(?:(?<title>.+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+)))/i,

  // 5 digit multi-episode with a title
  /^(?:(?<title>.+?)(?:_|-|\s|\.)+)(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:(?:[-_. ]{1,3}ep){1,2}(?<episode>(?<!\d+)\d{5}(?!\d+)))+/i,

  // Separated season and episode numbers S01 - E01
  /^(?<title>.+?)(?:_|-|\s|\.)+S(?<season>\d{2}(?!\d+))(\W-\W)E(?<episode>(?<!\d+)\d{2}(?!\d+))(?!\\)/i,

  // Anime - Title with season number - Absolute Episode Number (Title S01 - EP14)
  /^(?<title>.+?S\d{1,2})[-_. ]{3,}(?:EP)?(?<absoluteepisode>\d{2,3}(\.\d{1,2})?(?!\d+|[-]))/i,

  // Anime - French titles with single episode numbers, with or without leading sub group ([RlsGroup] Title - Episode 1)
  /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)[-_. ]+?(?:Episode[-_. ]+?)(?<absoluteepisode>\d{1}(\.\d{1,2})?(?!\d+))/i,

  // Season only releases
  /^(?<title>.+?)\W(?:S|Season)\W?(?<season>\d{1,2}(?!\d+))(\W+|_|$)(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,

  // 4 digit season only releases
  /^(?<title>.+?)\W(?:S|Season)\W?(?<season>\d{4}(?!\d+))(\W+|_|$)(?<extras>EXTRAS|SUBPACK)?(?!\\)/i,

  // Episodes with a title and season/episode in square brackets
  /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+\[S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>(?<!\d+)\d{2}(?!\d+|i|p)))+\])\W?(?!\\)/i,

  // Supports 103/113 naming
  /^(?<title>.+?)?(?:(?:[_.](?<![()[!]))+(?<season>(?<!\d+)[1-9])(?<episode>[1-9][0-9]|[0][1-9])(?![a-z]|\d+))+(?:[_.]|$)/i,

  // 4 digit episode number
  // Episodes without a title, Single (S01E05, 1x05) AND Multi (S01E04E05, 1x04x05, etc)
  /^(?:S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p)))+)(\W+|_|$)(?!\\)/i,

  // 4 digit episode number
  // Episodes with a title, Single episodes (S01E05, 1x05, etc) & Multi-episode (S01E05E06, S01E05-06, S01E05 E06, etc)
  /^(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]|\W[ex]|_){1,2}(?<episode>\d{4}(?!\d+|i|p)))+)\W?(?!\\)/i,

  // Episodes with airdate (2018.04.28)
  /^(?<title>.+?)?\W*(?<airyear>\d{4})[-_. ]+(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])(?![-_. ]+[0-3][0-9])/i,

  // Episodes with airdate (04.28.2018)
  /^(?<title>.+?)?\W*(?<airmonth>[0-1][0-9])[-_. ]+(?<airday>[0-3][0-9])[-_. ]+(?<airyear>\d{4})(?!\d+)/i,

  // Supports 1103/1113 naming
  /^(?<title>.+?)?(?:(?:[-_\W](?<![()[!]))*(?<season>(?<!\d+|\(|\[|e|x)\d{2})(?<episode>(?<!e|x)\d{2}(?!p|i|\d+|\)|\]|\W\d+|\W(?:e|ep|x)\d+)))+(\W+|_|$)(?!\\)/i,

  // Episodes with single digit episode number (S01E1, S01E5E6, etc)
  /^(?<title>.*?)(?:(?:[-_\W](?<![()[!]))+S?(?<season>(?<!\d+)\d{1,2}(?!\d+))(?:(?:-|[ex]){1,2}(?<episode>\d{1}))+)+(\W+|_|$)(?!\\)/i,

  // iTunes Season 1\05 Title (Quality).ext
  /^(?:Season(?:_|-|\s|\.)(?<season>(?<!\d+)\d{1,2}(?!\d+)))(?:_|-|\s|\.)(?<episode>(?<!\d+)\d{1,2}(?!\d+))/i,

  // iTunes 1-05 Title (Quality).ext
  /^(?:(?<season>(?<!\d+)(?:\d{1,2})(?!\d+))(?:-(?<episode>\d{2,3}(?!\d+))))/i,

  // Anime Range - Title Absolute Episode Number (ep01-12)
  /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:_|\s|\.)+(?:e|ep)(?<absoluteepisode>\d{2,3}(\.\d{1,2})?)-(?<absoluteepisode1>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+|-)).*?(?<hash>\[\w{8}\])?(?:$|\.)/i,

  // Anime - Title Absolute Episode Number (e66)
  /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:(?:_|-|\s|\.)+(?:e|ep)(?<absoluteepisode>\d{2,3}(\.\d{1,2})?))+.*?(?<hash>\[\w{8}\])?(?:$|\.)/i,

  // Anime - Title Episode Absolute Episode Number (Series Title Episode 01)
  /^(?<title>.+?)[-_. ](?:Episode)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,

  // Anime Range - Title Absolute Episode Number (1 or 2 digit absolute episode numbers in a range, 1-10)
  /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)[_. ]+(?<absoluteepisode>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+))-(?<absoluteepisode1>(?<!\d+)\d{1,2}(\.\d{1,2})?(?!\d+|-))(?:_|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,

  // Anime - Title Absolute Episode Number
  /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:[-_. ]+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,

  // Anime - Title {Absolute Episode Number}
  /^(?:\[(?<subgroup>.+?)\][-_. ]?)?(?<title>.+?)(?:(?:[-_\W](?<![()[!]))+(?<absoluteepisode>(?<!\d+)\d{2,3}(\.\d{1,2})?(?!\d+)))+(?:_|-|\s|\.)*?(?<hash>\[.{8}\])?(?:$|\.)?/i,

  // Extant, terrible multi-episode naming (extant.10708.hdtv-lol.mp4)
  /^(?<title>.+?)[-_. ](?<season>[0]?\d?)(?:(?<episode>\d{2}){2}(?!\d+))[-_. ]/i,
];

const rejectedRegexes = [
  // Generic match for md5 and mixed-case hashes.
  /^[0-9a-zA-Z]{32}/i,

  // Generic match for shorter lower-case hashes.
  /^[a-z0-9]{24}$/i,

  // Format seen on some NZBGeek releases
  // Be very strict with these coz they are very close to the valid 101 ep numbering.
  /"^[A-Z]{11}\d{3}$/i,
  /"^[a-z]{12}\d{3}$/i,

  // Backup filename (Unknown origins)
  /^Backup_\d{5,}S\d{2}-\d{2}$/i,

  // 123 - Started appearing December 2014
  /^123$"/,

  // abc - Started appearing January 2015
  /^abc$"/i,

  // b00bs - Started appearing January 2015
  /^b00bs$"/i,

  // 170424_26 - Started appearing August 2018
  /^\d{6}_\d{2}$"/,
];

const requestInfoExp = /^(?:\[.+?\])+/;
const sixDigitAirDateMatchExp = /"(?<=[_.-])(?<airdate>(?<!\d)(?<airyear>[1-9]\d{1})(?<airmonth>[0-1][0-9])(?<airday>[0-3][0-9]))(?=[_.-])/i;

export interface Season {
  releaseTitle: string;
  seriesTitle: string;
  // seriesTitleInfo: any;
  seasons: number[];
  episodeNumbers: number[];
  airDate: Date | null;
  // Language: Language;
  fullSeason: boolean;
  isPartialSeason: boolean;
  isMultiSeason: boolean;
  /**
   * Check to see if this is an "Extras" or "SUBPACK" release, if it is, set
   */
  isSeasonExtra: boolean;
  isSpecial: boolean;
  /**
   * Partial season packs will have a seasonpart group so they can be differentiated from a full season/single episode release
   */
  seasonPart: number;
  // ReleaseTokens:
}

export function parseSeason(title: string): Season | null {
  if (!preValidation(title)) {
    return null;
  }

  let simpleTitle = simplifyTitle(title);

  // parse daily episodes with mmddyy eg `At.Midnight.140722.720p.HDTV.x264-YesTV`
  const sixDigitAirDateMatch = sixDigitAirDateMatchExp.exec(title);
  if (sixDigitAirDateMatch?.groups) {
    const airYear = sixDigitAirDateMatch.groups.airyear;
    const airMonth = sixDigitAirDateMatch.groups.airmonth;
    const airDay = sixDigitAirDateMatch.groups.airday;
    if (airMonth !== '00' || airDay !== '00') {
      const fixedDate = `20${airYear}.${airMonth}.${airDay}`;

      simpleTitle = simpleTitle.replace(sixDigitAirDateMatch.groups.airdate, fixedDate);
    }
  }

  for (const exp of reportTitleExp) {
    const match = exp.exec(simpleTitle);
    if (match?.groups) {
      const result = parseMatchCollection(match, simpleTitle);

      if (result === null) {
        continue;
      }

      if (result.fullSeason && result.releaseTokens && /Special/i.test(result.releaseTokens)) {
        result.fullSeason = false;
        result.isSpecial = true;
      }

      return {
        releaseTitle: title,
        seriesTitle: result.seriesName,
        // seriesTitleInfo: 0,
        seasons: result.seasonNumbers ?? [],
        episodeNumbers: result.episodeNumbers ?? [],
        airDate: result.airDate ?? null,
        fullSeason: result.fullSeason ?? false,
        isPartialSeason: result.isPartialSeason ?? false,
        isMultiSeason: result.isMultiSeason ?? false,
        isSeasonExtra: result.isSeasonExtra ?? false,
        isSpecial: result.isSpecial ?? false,
        seasonPart: result.seasonPart ?? 0,
      };
    }
  }

  return null;
}

function preValidation(title: string): boolean {
  for (const exp of rejectedRegexes) {
    const match = exp.exec(title);
    if (match !== null) {
      return false;
    }
  }

  return true;
}

export const completeRange = (arr: number[]): number[] => {
  const uniqArr = [...new Set(arr)];

  const first = Number(uniqArr[0]);
  const last = Number(uniqArr[uniqArr.length - 1]);

  if (first > last) {
    return arr;
  }

  const count = last - first + 1;
  return [...Array(count).keys()].map(k => k + first);
};

const indexOfEnd = (str1: string, str2: string): number => {
  const io = str1.indexOf(str2);
  return io === -1 ? -1 : io + str2.length;
};

export interface ParsedMatchCollection {
  seriesName: string;
  seriesTitle?: string;
  seasonNumbers?: number[];
  isMultiSeason?: boolean;
  episodeNumbers?: number[];
  isSpecial?: boolean;
  isSeasonExtra?: boolean;
  seasonPart?: number;
  isPartialSeason?: boolean;
  fullSeason?: boolean;
  airDate?: Date;
  releaseTokens?: string;
}

export function parseMatchCollection(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { groups } = match;
  if (groups === undefined) {
    throw new Error('No match');
  }

  const seriesName = (groups.title || '')
    .replace(/\./g, ' ')
    .replace(/_/g, ' ')
    .replace(requestInfoExp, '')
    .trim();

  const result: ParsedMatchCollection = {
    seriesName,
  };

  let lastSeasonEpisodeStringIndex = indexOfEnd(simpleTitle, groups.title);

  const airYear = parseInt(groups.airyear, 10);
  if (airYear < 1900 || Number.isNaN(airYear)) {
    let seasons = [groups.season, groups.season1]
      .filter(x => x !== undefined && x.length > 0)
      .map(x => {
        lastSeasonEpisodeStringIndex = Math.max(
          indexOfEnd(simpleTitle, x),
          lastSeasonEpisodeStringIndex,
        );
        return Number(x);
      });

    if (seasons.length > 1) {
      seasons = completeRange(seasons);
    }

    result.seasonNumbers = seasons;
    if (seasons.length > 1) {
      result.isMultiSeason = true;
    }

    const episodeCaptures = [groups.episode, groups.episode1].filter(x => x);
    const absoluteEpisodeCaptures = [groups.absoluteepisode, groups.absoluteepisode1].filter(x => x);

    // handle 0 episode possibly indicating a full season release
    if (episodeCaptures.length) {
      const first = Number(episodeCaptures[0]);
      const last = Number(episodeCaptures[episodeCaptures.length - 1]);

      if (first > last) {
        return null;
      }

      const count = last - first + 1;
      result.episodeNumbers = [...Array(count).keys()].map(k => k + first);
    }

    if (absoluteEpisodeCaptures.length > 0) {
      const first = Number(absoluteEpisodeCaptures[0]);
      const last = Number(absoluteEpisodeCaptures[episodeCaptures.length - 1]);

      if ((first % 1) !== 0 || (last % 1) !== 0) {
        if (absoluteEpisodeCaptures.length !== 1) {
          return null;
        }

        // specialAbsoluteEpisodeNumbers in radarr
        result.episodeNumbers = [first];
        result.isSpecial = true;

        lastSeasonEpisodeStringIndex = Math.max(
          indexOfEnd(simpleTitle, absoluteEpisodeCaptures[0]),
          lastSeasonEpisodeStringIndex,
        );
      } else {
        const count = last - first + 1;
        // AbsoluteEpisodeNumbers in radarr
        result.episodeNumbers = [...Array(Math.floor(count)).keys()].map(
          k => k + Math.floor(first),
        );

        if (groups.special) {
          result.isSpecial = true;
        }
      }
    }

    if (episodeCaptures.length === 0 && absoluteEpisodeCaptures.length === 0) {
      // Check to see if this is an "Extras" or "SUBPACK" release, if it is, set
      // IsSeasonExtra so they can be filtered out
      if (groups.extras) {
        result.isSeasonExtra = true;
      }

      // Partial season packs will have a seasonpart group so they can be differentiated
      // from a full season/single episode release
      const seasonPart = groups.seasonpart;
      if (seasonPart) {
        result.seasonPart = parseInt(seasonPart, 10);
        result.isPartialSeason = true;
      } else {
        result.fullSeason = true;
      }
    }

    if (absoluteEpisodeCaptures.length !== 0 && !result.episodeNumbers) {
      result.seasonNumbers = [0];
    }
  } else {
    let airMonth = parseInt(groups.airmonth, 10);
    let airDay = parseInt(groups.airday, 10);

    // Swap day and month if month is bigger than 12 (scene fail)
    if (airMonth > 12) {
      const tempDay = airDay;
      airDay = airMonth;
      airMonth = tempDay;
    }

    const airDate = new Date(airYear, airMonth - 1, airDay);

    // dates in the future is most likely parser error
    if (airDate.getTime() > new Date().getTime()) {
      throw new Error('Parsed date is in the future');
    }

    if (airDate.getTime() < new Date(1970, 1, 1).getTime()) {
      throw new Error('Parsed date error');
    }

    lastSeasonEpisodeStringIndex = Math.max(
      indexOfEnd(simpleTitle, groups.airyear),
      lastSeasonEpisodeStringIndex,
    );
    lastSeasonEpisodeStringIndex = Math.max(
      indexOfEnd(simpleTitle, groups.airmonth),
      lastSeasonEpisodeStringIndex,
    );
    lastSeasonEpisodeStringIndex = Math.max(
      indexOfEnd(simpleTitle, groups.airday),
      lastSeasonEpisodeStringIndex,
    );
    result.airDate = airDate;
  }

  if (lastSeasonEpisodeStringIndex === simpleTitle.length || lastSeasonEpisodeStringIndex === -1) {
    result.releaseTokens = simpleTitle;
  } else {
    result.releaseTokens = simpleTitle.substring(lastSeasonEpisodeStringIndex);
  }

  result.seriesTitle = seriesName;
  // TODO: seriesTitleInfo

  return result;
}

// parseSeason("The.Handmaid's.Tale.S01E01.Offred.1080p.HULU.WEBRip.DDP5.1.H.264-NTb.mkv");
// parseSeason("The.Handmaid's.Tale.S12E12.Offred.1080p.HULU.WEBRip.DDP5.1.H.264-NTb.mkv");
// parseSeason('stephen.colbert.2019.10.07.neil.degrasse.tyson.1080p.hdtv.x264-twerk.mkv');
// parseSeason('Holmes.Makes.It.Right.S02.720p.HDTV.AAC5.1.x265-NOGRP');
