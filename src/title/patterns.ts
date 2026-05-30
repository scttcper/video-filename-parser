import type { TitleYearPattern } from './types.js';

export const releaseGroupSuffixExp = /-([a-z0-9]+)$/i;

export const movieTitleYearPatterns: TitleYearPattern[] = [
  {
    name: 'edition-before-year',
    regex:
      /^(?<title>(?![([])[^\r\n]+?)?(?:(?:[-_\W](?<![)[!]))*\(?\b(?<edition>(((?:Extended[-_. ']|Ultimate[-_. '])?(?:Director[-_. ']?s|Collector[-_. ']?s|Theatrical|Anniversary|The[-_. ']Uncut|Ultimate|Final(?=(?:[-_. '](?:Cut|Edition|Version)))|Extended|Rogue|Special|Despecialized|\d{2,3}(?:th)?[-_. ']Anniversary)(?:[-_. '](?:Cut|Edition|Version))?(?:[-_. '](?:Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan[-_. ']?Edit))?|(?:Uncensored|Remastered|Unrated|Uncut|IMAX|Fan[-_. ']?Edit|Edition|Restored|[234]in1))))\b\)?[-_. ]{1,3}(?<year>(?:1[89]|20)\d{2}(?!p|i|\d+|\]|\W\d+)))+(\W+|_|$)(?!\\)/i,
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
    regex:
      /^(?<title>[^\r\n]+?)?(?:(?:[-_\W](?<![()[!]))*(?<year>\[[\w ]{1,64}\]))+(\W+|_|$)(?!\\)/i,
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
