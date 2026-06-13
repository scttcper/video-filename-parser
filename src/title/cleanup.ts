import { Language } from '../language.js';
import { webdlExp } from '../source.js';
import { codecExp } from '../videoCodec.js';
import { cleanTorrentSuffixExp, websitePostfixExp, websitePrefixExp } from '../website.js';

const resolutionOrCodecDetailsExp =
  /\s*(?:480[ip]|576[ip]|720[ip]|1080[ip]|2160[ip]|HVEC|[xh][\W_]?26[45]|DD\W?5\W1|[<>?*:|]|848x480|1280x720|1920x1080)((8|10)b(it))?/i;
const cleanTorrentPrefixRegex = /^\[(?:REQ)\]/i;
/** Used to help cleanup releases that often emit the year title.SCR-group */
const commonSourceMarkerExp =
  /\b(Bluray|(dvdr?|BD)rip|HDTV|HDRip|TS|R5|CAM|SCR|(WEB|DVD)?.?SCREENER|DiVX|xvid|web-?dl)\b/i;

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

const requestInfoRegex = /\[[^\]\r\n]+\]/i;
const editionExp =
  /\b(?:(?:(?:Extended|Ultimate)[-_. ']*)?(?:(?:Director|Collector)[-_. ']*s?|Theatrical|Anniversary|The[-_. ']*Uncut|DC|Ultimate|Final(?=[-_. ']*(?:Cut|Edition|Version))|Extended|Special|Despecialized|unrated|\d{2,3}(?:th)?[-_. ']*Anniversary)(?:[-_. ']*(?:Cut|Edition|Version))?(?:[-_. ']*(?:Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan[-_. ']*Edit))?|(?:Uncensored|Remastered|Unrated|Uncut|IMAX|Fan[-_. ']*Edit|Edition|Restored|[234]in1)){1,3}/i;
const languageExp = /\b(TRUE.?FRENCH|videomann|SUBFRENCH|PLDUB|MULTI)\b/i;
const sceneGarbageExp = /\b(PROPER|REAL|READ.NFO)/;

// Hoisted global variants
const sceneGarbageGlobalExp = new RegExp(sceneGarbageExp.source, 'ig');

// Precomputed combined regex for all language names (replaces loop creating ~45 regexes per call)
const allLanguagesGlobalExp = new RegExp(
  `\\b(${Object.values(Language)
    .map(l => l.toUpperCase())
    .join('|')})`,
  'g',
);

const releaseTitleCleanupPasses: readonly CleanupPass[] = [
  {
    name: 'replace first underscore',
    clean: title => title.replace('_', ' '),
  },
  {
    name: 'remove request info',
    pattern: requestInfoRegex,
    trimAfter: true,
  },
  {
    name: 'remove common source markers',
    pattern: commonSourceMarkersGlobalExp,
    trimAfter: true,
  },
  {
    name: 'remove web download marker',
    pattern: webdlExp,
    trimAfter: true,
  },
  {
    name: 'remove edition marker',
    pattern: editionExp,
    trimAfter: true,
  },
  {
    name: 'remove language marker',
    pattern: languageExp,
    trimAfter: true,
  },
  {
    name: 'remove scene garbage marker',
    pattern: sceneGarbageGlobalExp,
    trimAfter: true,
  },
  {
    name: 'remove language names',
    pattern: allLanguagesGlobalExp,
    trimAfter: true,
  },
  {
    name: 'truncate at double space gap',
    clean: title => title.split('  ')[0]!,
  },
  {
    name: 'truncate at double dot gap',
    clean: title => title.split('..')[0]!,
  },
];

function isCleanableReleaseTitle(title: string): boolean {
  return title.length > 0 && title !== '(';
}

function shouldPreservePeriod(
  segment: string,
  previousSegmentWasAcronym: boolean,
  nextSegment: string,
): boolean {
  if (segment.length !== 1) {
    return false;
  }

  if (segment.toLowerCase() !== 'a') {
    return Number.isNaN(Number.parseInt(segment, 10));
  }

  return previousSegmentWasAcronym || nextSegment.length === 1;
}

function formatDottedTitleSegments(title: string): string {
  const segments = title.split('.');
  let formattedTitle = '';
  let previousSegmentWasAcronym = false;
  let nextSegment = '';

  for (const [segmentIndex, segment] of segments.entries()) {
    if (segments.length >= segmentIndex + 2) {
      nextSegment = segments[segmentIndex + 1] ?? '';
    }

    if (shouldPreservePeriod(segment, previousSegmentWasAcronym, nextSegment)) {
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

  return formattedTitle.trim();
}

export function releaseTitleCleaner(title: string): string | null {
  if (!isCleanableReleaseTitle(title)) {
    return null;
  }

  const trimmedTitle = applyCleanupPasses(title, releaseTitleCleanupPasses);

  return formatDottedTitleSegments(trimmedTitle);
}
