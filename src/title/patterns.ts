import type { TitleYearPattern } from './types.js';

export const releaseGroupSuffixExp = /-([a-z0-9]+)$/i;

// Cheap checks for what these anime patterns require, so names without it skip the scan
const animeYearExp = /(?:1[89]|20)\d{2}/;
const animeParenthesizedYearExp = /\((?:1[89]|20)\d{2}\)/;
// The CRC hash these anime patterns end with, checked first so names without one skip them
const animeHashExp = /\[\w{8}\](?:$|\.)/;

// Release info that can sit between German/TrueFrench and the year
const releaseInfoExp =
  /\b(?:[DM]L|LD|MD|AC3|DTS|DD\+?|AAC|Dubbed|Synced|Subbed|DVD\w*|PAL|NTSC|Blu-?Ray|BDRip|BRRip|WEB\w*|HDTV|HDRip|UHD|\d{3,4}[pi]|[xh]\.?26[45]|AVC|HEVC|XviD|REMUX|UNCUT|EXTENDED|THEATRICAL|iNTERNAL|REPACK|PROPER|COMPLETE)\b/i;
const languageMarkerExp = /German|TrueFrench/i;
const yearAfterLanguageExp = /(?:19|20)\d{2}/;
const titleLetterExp = /\p{L}/u;

/**
 * Words between German and the year must be release info, otherwise German is part of the title:
 * A.German.Life.2016 is "A German Life", Der.Film.German.DL.2011 is "Der Film"
 */
function hasReleaseInfoAfterLanguage(match: RegExpExecArray, title: string): boolean {
  if (!titleLetterExp.test(match.groups?.afterLanguage ?? '')) {
    return true;
  }

  const afterLanguage = title.slice(title.search(languageMarkerExp));
  const yearIndex = afterLanguage.search(yearAfterLanguageExp);
  return releaseInfoExp.test(yearIndex === -1 ? afterLanguage : afterLanguage.slice(0, yearIndex));
}

export const movieTitleYearPatterns: TitleYearPattern[] = [
  // Anime: [SubGroup] Title (Year) ... [ABCD1234], from Radarr's ReportMovieTitleRegex
  {
    name: 'anime-subgroup-title-parenthesized-year',
    guard: animeParenthesizedYearExp,
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![([]).+?)\s*\((?<year>(1(8|9)|20)\d{2})\).*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-year',
    guard: animeYearExp,
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![([]).+?)?(?:(?:[-_\W](?<![)[!]))*(?<year>(1(8|9)|20)\d{2}(?!p|i|x|\d+|\]|\W\d+)))+.*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-version-hash',
    guard: animeHashExp,
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![([]).+?)((v)(?:\d{1,2})(?:([-_. ])))(\[.*)?(?:[[(][^\])])?.*?(?<hash>\[\w{8}\])(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-bracket-hash',
    guard: animeHashExp,
    regex:
      /^(?:\[(?<subgroup>[^\]\r\n]+?)\][-_. ]?)(?<title>(?![([])[^[\r\n]+?)\[[^\r\n]*?(?<hash>\[\w{8}\])(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-hash',
    guard: animeHashExp,
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![([]).+)(?:[[(][^\])]).*?(?<hash>\[\w{8}\])(?:$|\.)/i,
  },
  // German/TrueFrench tracker names put the language before the year: Title.German.DL.2011
  {
    name: 'german-truefrench',
    guard: /german|truefrench/i,
    regex:
      /^(?<title>(?![([]).+?)((\W|_))(\(?\b(?<edition>(((Recut.|Extended.|Ultimate.)?(Director.?s|Collector.?s|Theatrical|Ultimate|Extended|Despecialized|(Special|Rouge|Final|Assembly|Imperial|Diamond|Signature|Hunter|Rekall)(?=(.(Cut|Edition|Version)))|\d{2,3}(th)?.Anniversary)(?:.(Cut|Edition|Version))?(.(Extended|Uncensored|Remastered|Unrated|Uncut|Open.?Matte|IMAX|Fan.?Edit))?|((Uncensored|Remastered|Unrated|Uncut|Open?.Matte|IMAX|Fan.?Edit|Restored|((2|3|4)in1))))))\b\)?.{1,3})?(?:(?<!(19|20)\d{2}.*?)(?<!(?:Good|The)[_ .-])(German|TrueFrench)\b)(?<afterLanguage>.+?)(?=((19|20)\d{2}|$))(?<year>(19|20)\d{2}(?!p|i|\d+|\]|\W\d+))?(\W+|_|$)(?!\\)/i,
    accept: hasReleaseInfoAfterLanguage,
  },
  {
    name: 'edition-before-year',
    regex:
      /^(?<title>(?![([])[^\r\n]+?)?(?:(?:[-_\W](?<![)[!]))*\(?\b(?<edition>(((?:Recut[-_. ']|Extended[-_. ']|Ultimate[-_. '])?(?:Director[-_. ']?s|Collector[-_. ']?s|Theatrical|Anniversary|The[-_. ']Uncut|Ultimate|(?:Final|Rouge|Assembly|Imperial|Diamond|Signature|Hunter|Rekall)(?=(?:[-_. '](?:Cut|Edition|Version)))|Extended|Rogue|Special|Despecialized|\d{2,3}(?:th)?[-_. ']Anniversary)(?:[-_. '](?:Cut|Edition|Version))?(?:[-_. '](?:Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan[-_. ']?Edit))?|(?:Uncensored|Remastered|Unrated|Uncut|IMAX|Fan[-_. ']?Edit|Edition|Restored|[234]in1))))\b\)?[-_. ]{1,3}(?<year>(?:1[89]|20)\d{2}(?!p|i|\d+|\]|\W\d+)))+(\W+|_|$)(?!\\)/i,
  },
  {
    name: 'parenthesized-year',
    regex:
      /^(?<title>(?![([])[^\r\n]+?)?(?:(?:[-_\W](?<![)[!]))*\((?<year>(?:1[89]|20)\d{2}(?!p|i|(?:1[89]|20)\d{2}|\]|\W(?:1[89]|20)\d{2})))+/i,
  },
  {
    name: 'normal-year',
    regex:
      /^(?<title>(?![([])[^\r\n]+?)?(?:(?:[-_\W](?<![)[!]))*(?<year>(?:1[89]|20)\d{2}(?!p|i|(?:1[89]|20)\d{2}|\]|\W(?:1[89]|20)\d{2})))+(\W+|_|$)(?!\\)/i,
  },
  {
    name: 'pass-the-popcorn-tag',
    regex: /^(?<title>[^\r\n]+?)?(?:(?:[-_\W](?<![()[!]))*(?<year>\[\w *\]))+(\W+|_|$)(?!\\)/i,
  },
  {
    name: 'loose-year',
    regex:
      /^(?<title>(?![([])[^\r\n]+?)?(?:(?:[-_\W](?<![)!]))*(?<year>(?:1[89]|20)\d{2}(?!p|i|\d+|\W\d+)))+(\W+|_|$)(?!\\)/i,
  },
  {
    name: 'bracketed-title-loose-year',
    regex:
      /^(?<title>[^\r\n]+?)?(?:(?:[-_\W](?<![)[!]))*(?<year>(?:1[89]|20)\d{2}(?!p|i|\d+|\]|\W\d+)))+(\W+|_|$)(?!\\)/i,
  },
];
