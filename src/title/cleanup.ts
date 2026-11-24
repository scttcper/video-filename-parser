import { Language } from '../language.js';
import { webdlExp } from '../source.js';
import { codecExp } from '../videoCodec.js';
import { cleanTorrentSuffixExp, websitePostfixExp, websitePrefixExp } from '../website.js';

import { sceneReleaseTagExp, upperCaseSourceTagExp } from './boundaries.js';

const resolutionOrCodecDetailsExp =
  /\s*(?:480[ip]|576[ip]|720[ip]|1080[ip]|2160[ip]|HVEC|[xh][\W_]?26[45]|DD\W?5\W1|[<>?*:|]|848x480|1280x720|1920x1080)((8|10)b(it))?/i;
const cleanTorrentPrefixRegex = /^\[(?:REQ)\]/i;
/**
 * Used to help cleanup releases that often emit the year title.SCR-group. No Cam or Screener, they
 * are title words (Court Cam, The Screener) and the source tag comes after the year or episode.
 */
const commonSourceMarkerExp =
  /\b(Bluray|(dvdr?|BD)rip|HDTV|HDRip|TS|R5|SCR|(WEB|DVD).?SCREENER|DiVX|xvid|web-?dl)\b/i;

// Hoisted global variants (avoid re-creating RegExp on every call)
const commonSourceMarkersGlobalExp = new RegExp(commonSourceMarkerExp.source, 'ig');
const codecGlobalExp = new RegExp(codecExp.source, 'ig');

type RegexCleanupPass = {
  readonly name: string;
  readonly pattern: RegExp;
  readonly replacement?: string;
  readonly trimAfter?: boolean;
};

type FunctionCleanupPass = {
  readonly name: string;
  readonly clean: (title: string) => string;
  readonly trimAfter?: boolean;
};

type CleanupPass = RegexCleanupPass | FunctionCleanupPass;

function applyCleanupPass(title: string, pass: CleanupPass): string {
  const cleanedTitle =
    'pattern' in pass ? title.replace(pass.pattern, pass.replacement ?? '') : pass.clean(title);

  return pass.trimAfter === true ? cleanedTitle.trim() : cleanedTitle;
}

function applyCleanupPasses(title: string, passes: readonly CleanupPass[]): string {
  let cleanedTitle = title;

  for (const pass of passes) {
    cleanedTitle = applyCleanupPass(cleanedTitle, pass);
  }

  return cleanedTitle;
}

const simplifyTitleCleanupPasses: readonly CleanupPass[] = [
  {
    name: 'remove resolution and first codec details',
    pattern: resolutionOrCodecDetailsExp,
  },
  {
    name: 'remove website prefix',
    pattern: websitePrefixExp,
  },
  {
    name: 'remove website postfix',
    pattern: websitePostfixExp,
  },
  {
    name: 'remove torrent request prefix',
    pattern: cleanTorrentPrefixRegex,
  },
  {
    name: 'remove torrent tracker suffix',
    pattern: cleanTorrentSuffixExp,
  },
  {
    name: 'remove common source markers',
    pattern: commonSourceMarkersGlobalExp,
  },
  {
    name: 'remove web download marker',
    pattern: webdlExp,
  },
  {
    name: 'remove remaining codec markers',
    pattern: codecGlobalExp,
  },
];

export function simplifyTitle(title: string): string {
  return applyCleanupPasses(title, simplifyTitleCleanupPasses).trim();
}

// Special and Anniversary are only an edition in front of Cut, Edition or Version, on their own
// they are title words: The.Special, Happy.Anniversary
const editionMarkerPattern = String.raw`(?:(?:(?:Recut|Extended|Ultimate)[-_. ']*)?(?:(?:Director|Collector)[-_. ']*s?[-_. ']*(?:Cut|Edition|Version)|Theatrical|The[-_. ']*Uncut|DC|Ultimate|(?:Final|Rouge|Assembly|Imperial|Diamond|Signature|Hunter|Rekall|Special|Anniversary)(?=[-_. ']*(?:Cut|Edition|Version))|Extended|Despecialized|unrated|\d{2,3}(?:th)?[-_. ']*Anniversary)(?:[-_. ']*(?:Cut|Edition|Version))?(?:[-_. ']*(?:Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan[-_. ']*Edit))?|(?:Uncensored|Remastered|Unrated|Uncut|Open[-_. ']?Matte|IMAX|Fan[-_. ']*Edit|Edition|Restored|[234]in1)){1,3}`;
const trailingLanguageMarkerPattern = String.raw`(?:${Object.values(Language).join('|')}|TRUE.?FRENCH|videomann|SUBFRENCH|PLDUB|MULTI)`;
// Each suffix separator run must start where the run starts (lookbehind), otherwise a long run of
// separators or brackets is retried from every position inside it
const editionSuffixExp = new RegExp(
  String.raw`(?:^|(?<![-_. '([])[-_. '([]+)${editionMarkerPattern}(?:[-_. ']+${trailingLanguageMarkerPattern})*[-_. ')\]]*$`,
  'i',
);
const releaseBoundaryExp = new RegExp(
  String.raw`[-_. ']+(?:${commonSourceMarkerExp.source}|${webdlExp.source}|${codecExp.source})`,
  'i',
);
// No [ inside the brackets, so a run of [ fails at each one instead of scanning to the end
const requestInfoSuffixExp = /(?:^|(?<![-_. '])[-_. ']+)\[[^[\]\r\n]+\][-_. ']*$/i;
const languageMarkerSuffixExp = /\b(TRUE.?FRENCH|videomann|SUBFRENCH|PLDUB|MULTI)\b[-_. ']*$/i;
const languageNameSuffixExp = new RegExp(
  String.raw`(?:^|(?<![-_. '])[-_. ']+)(?:${Object.values(Language)
    .map(l => l.toUpperCase())
    .join('|')})[-_. ']*$`,
);
// Flags that are never the last word of a title, so any case counts: release names often get the
// case wrong. Words that are both (Real, Complete, Dual) stay case-sensitive in sceneReleaseTagExp.
export const sceneFlagSuffixExp: RegExp =
  /(?:^|(?<![-_. '])[-_. ']+)(?:PROPER|REPACK|RERIP|READ.NFO|INTERNAL|DIRFIX|NFOFIX|SUBBED)(?:[-_. ']+(?:PROPER|REPACK|RERIP|READ.NFO|INTERNAL|DIRFIX|NFOFIX|SUBBED))*[-_. ']*$/i;
const titleContentExp = /[a-z0-9]/i;
export const articleOnlyExp: RegExp = /^[-_. ']*(?:the|an?)[-_. ']*$/i;
const lowerCaseLetterExp = /\p{Ll}/u;

const trailingMetadataSuffixExps = [
  requestInfoSuffixExp,
  languageMarkerSuffixExp,
  languageNameSuffixExp,
  sceneFlagSuffixExp,
  editionSuffixExp,
];

function removeTitleSuffix(title: string, suffixExp: RegExp): string {
  suffixExp.lastIndex = 0;
  const cleanedTitle = title.replace(suffixExp, '');
  // Metadata never leaves a title empty or as a lone article: The.Final.Cut is not "The"
  return titleContentExp.test(cleanedTitle) && !articleOnlyExp.test(cleanedTitle)
    ? cleanedTitle
    : title;
}

// Release metadata should only trim the right edge. Title words that look like
// metadata, such as "Collector" or "Real", must survive inside the title.
function trimTrailingReleaseMetadata(title: string): string {
  let trimmedTitle = title.trim();
  let removedSuffix = true;

  while (removedSuffix) {
    removedSuffix = false;

    for (const suffixExp of trailingMetadataSuffixExps) {
      const cleanedTitle = removeTitleSuffix(trimmedTitle, suffixExp).trim();
      if (cleanedTitle !== trimmedTitle) {
        trimmedTitle = cleanedTitle;
        removedSuffix = true;
        break;
      }
    }
  }

  return trimmedTitle;
}

function searchAfterLowerCase(title: string, exp: RegExp): number {
  const index = title.search(exp);
  return lowerCaseLetterExp.test(title.slice(0, Math.max(index, 0))) ? index : -1;
}

// Handles full release strings passed directly into the title cleaner. This is
// intentionally separator-based so bare title substrings do not become cut points.
function truncateAtReleaseMetadataBoundary(title: string): string {
  // Scene flags come after the year or the episode title, never inside a title: Get.Real.1998 is
  // a title, Episode.Title.REAL.PROPER is not. The same goes for the short source tags that are
  // words too, Episode.Title.CAM.XviD and Body.Cam. An upper case name can't tell (GET.REAL).
  const positions = [
    title.search(releaseBoundaryExp),
    searchAfterLowerCase(title, sceneReleaseTagExp),
    searchAfterLowerCase(title, upperCaseSourceTagExp),
  ].filter(position => position > 0);

  return positions.length > 0 ? title.slice(0, Math.min(...positions)) : title;
}

const releaseTitleCleanupPasses: readonly CleanupPass[] = [
  {
    name: 'replace underscores',
    clean: title => title.replaceAll('_', ' '),
  },
  {
    name: 'truncate at release metadata boundary',
    clean: truncateAtReleaseMetadataBoundary,
    trimAfter: true,
  },
  // Gaps are left by a removed resolution or codec, the trailing tags sit in front of them
  {
    name: 'truncate at double space gap',
    clean: title => title.split('  ')[0]!,
  },
  {
    name: 'truncate at double dot gap',
    clean: title => title.split('..')[0]!,
  },
  {
    name: 'trim trailing release metadata',
    clean: trimTrailingReleaseMetadata,
    trimAfter: true,
  },
];

function isCleanableReleaseTitle(title: string): boolean {
  return title.length > 0 && title !== '(';
}

function isDigit(character: string): boolean {
  return character >= '0' && character <= '9';
}

const repeatedSpaceExp = / {2,}/g;

// Radarr's ParseMovieMatchCollection: single letters keep their dot (S.H.I.E.L.D.), except a
// trailing letter after a word (World War Z.), a lone "a" unless part of an acronym, and numbers.
// Unlike Radarr a lone "I" or lower case letter is a word, not an initial: I.Robot, Bob.s.Burgers
function formatDottedTitleSegments(title: string): string {
  const segments = title.split('.');
  let formattedTitle = '';
  let previousSegmentWasAcronym = false;

  for (const [segmentIndex, segment] of segments.entries()) {
    const nextSegment = segments[segmentIndex + 1] ?? '';
    const isLetter = segment.length === 1 && !isDigit(segment);
    const isArticle = segment.toLowerCase() === 'a';
    const isWord = segment === 'I' || segment !== segment.toUpperCase();
    const nextIsLetter = nextSegment.length === 1 && !isDigit(nextSegment);

    if (
      isLetter &&
      !isArticle &&
      (!isWord || previousSegmentWasAcronym || nextIsLetter) &&
      (previousSegmentWasAcronym || segmentIndex < segments.length - 1) &&
      (previousSegmentWasAcronym || nextSegment.length !== 1 || !isDigit(nextSegment))
    ) {
      formattedTitle += `${segment}.`;
      previousSegmentWasAcronym = true;
      continue;
    }

    if (
      (isArticle && (previousSegmentWasAcronym || nextSegment.length === 1)) ||
      segment.toLowerCase() === 'dr'
    ) {
      formattedTitle += `${segment}.`;
      previousSegmentWasAcronym = true;
      continue;
    }

    if (previousSegmentWasAcronym) {
      formattedTitle += ' ';
      previousSegmentWasAcronym = false;
    }

    formattedTitle += `${segment} `;
  }

  return formattedTitle.replaceAll(repeatedSpaceExp, ' ').trim();
}

export function releaseTitleCleaner(title: string): string | null {
  if (!isCleanableReleaseTitle(title)) {
    return null;
  }

  const trimmedTitle = applyCleanupPasses(title, releaseTitleCleanupPasses);

  return formatDottedTitleSegments(trimmedTitle);
}
