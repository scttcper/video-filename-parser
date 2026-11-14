import type { TitleYearPattern } from './types.js';

export const releaseGroupSuffixExp = /-([a-z0-9]+)$/i;

export const movieTitleYearPatterns: TitleYearPattern[] = [
  // Anime: [SubGroup] Title (Year) ... [ABCD1234], from Radarr's ReportMovieTitleRegex
  {
    name: 'anime-subgroup-title-parenthesized-year',
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![(\[]).+?)\s*\((?<year>(1(8|9)|20)\d{2})\).*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-year',
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![(\[]).+?)?(?:(?:[-_\W](?<![)\[!]))*(?<year>(1(8|9)|20)\d{2}(?!p|i|x|\d+|\]|\W\d+)))+.*?(?<hash>\[\w{8}\])?(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-version-hash',
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![(\[]).+?)((v)(?:\d{1,2})(?:([-_. ])))(\[.*)?(?:[\[(][^\])])?.*?(?<hash>\[\w{8}\])(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-bracket-hash',
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![(\[]).+?)(\[.*).*?(?<hash>\[\w{8}\])(?:$|\.)/i,
  },
  {
    name: 'anime-subgroup-title-hash',
    regex:
      /^(?:\[(?<subgroup>.+?)\][-_. ]?)(?<title>(?![(\[]).+)(?:[\[(][^\])]).*?(?<hash>\[\w{8}\])(?:$|\.)/i,
  },
  // German/TrueFrench tracker names put the language before the year: Title.German.DL.2011
  {
    name: 'german-truefrench',
    guard: /german|truefrench/i,
    regex:
      /^(?<title>(?![(\[]).+?)((\W|_))(\(?\b(?<edition>(((Recut.|Extended.|Ultimate.)?(Director.?s|Collector.?s|Theatrical|Ultimate|Extended|Despecialized|(Special|Rouge|Final|Assembly|Imperial|Diamond|Signature|Hunter|Rekall)(?=(.(Cut|Edition|Version)))|\d{2,3}(th)?.Anniversary)(?:.(Cut|Edition|Version))?(.(Extended|Uncensored|Remastered|Unrated|Uncut|Open.?Matte|IMAX|Fan.?Edit))?|((Uncensored|Remastered|Unrated|Uncut|Open?.Matte|IMAX|Fan.?Edit|Restored|((2|3|4)in1))))))\b\)?.{1,3})?(?:(?<!(19|20)\d{2}.*?)(?<!(?:Good|The)[_ .-])(German|TrueFrench)\b)(.+?)(?=((19|20)\d{2}|$))(?<year>(19|20)\d{2}(?!p|i|\d+|\]|\W\d+))?(\W+|_|$)(?!\\)/i,
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
