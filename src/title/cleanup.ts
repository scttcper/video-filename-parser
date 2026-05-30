import { Language } from '../language.js';
import { webdlExp } from '../source.js';
import { codecExp } from '../videoCodec.js';

const simpleTitleRegex =
  /\s*(?:480[ip]|576[ip]|720[ip]|1080[ip]|2160[ip]|HVEC|[xh][\W_]?26[45]|DD\W?5\W1|[<>?*:|]|848x480|1280x720|1920x1080)((8|10)b(it))?/i;
const websitePrefixRegex = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanTorrentPrefixRegex = /^\[(?:REQ)\]/i;
const cleanTorrentSuffixRegex = /\[(?:ettv|rartv|rarbg|cttv)\]$/i;
/** Used to help cleanup releases that often emit the year title.SCR-group */
const commonSourcesRegex =
  /\b(Bluray|(dvdr?|BD)rip|HDTV|HDRip|TS|R5|CAM|SCR|(WEB|DVD)?.?SCREENER|DiVX|xvid|web-?dl)\b/i;

// Hoisted global variants (avoid re-creating RegExp on every call)
const commonSourcesGlobalExp = new RegExp(commonSourcesRegex.source, 'ig');
const codecGlobalExp = new RegExp(codecExp.source, 'ig');

type CleanupPass = {
  name: string;
  clean: (title: string) => string;
};

function applyCleanupPasses(title: string, passes: readonly CleanupPass[]): string {
  let cleanedTitle = title;

  for (const pass of passes) {
    cleanedTitle = pass.clean(cleanedTitle);
  }

  return cleanedTitle;
}

const simplifyTitleCleanupPasses: readonly CleanupPass[] = [
  {
    name: 'remove resolution and first codec details',
    clean: title => title.replace(simpleTitleRegex, ''),
  },
  {
    name: 'remove website prefix',
    clean: title => title.replace(websitePrefixRegex, ''),
  },
  {
    name: 'remove torrent request prefix',
    clean: title => title.replace(cleanTorrentPrefixRegex, ''),
  },
  {
    name: 'remove torrent tracker suffix',
    clean: title => title.replace(cleanTorrentSuffixRegex, ''),
  },
  {
    name: 'remove common source markers',
    clean: title => title.replace(commonSourcesGlobalExp, ''),
  },
  {
    name: 'remove web download marker',
    clean: title => title.replace(webdlExp, ''),
  },
  {
    name: 'remove remaining codec markers',
    clean: title => title.replace(codecGlobalExp, ''),
  },
];

export function simplifyTitle(title: string): string {
  return applyCleanupPasses(title, simplifyTitleCleanupPasses).trim();
}

const requestInfoRegex = /\[.+?\]/i;
const editionExp =
  /\b((Extended.|Ultimate.)?(Director.?s|Collector.?s|Theatrical|Anniversary|The.Uncut|DC|Ultimate|Final(?=(.(Cut|Edition|Version)))|Extended|Special|Despecialized|unrated|\d{2,3}(th)?.Anniversary)(.(Cut|Edition|Version))?(.(Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit))?|((Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit|Edition|Restored|((2|3|4)in1)))){1,3}/i;
const languageExp = /\b(TRUE.?FRENCH|videomann|SUBFRENCH|PLDUB|MULTI)/i;
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
    clean: title => title.replace(requestInfoRegex, '').trim(),
  },
  {
    name: 'remove common source markers',
    clean: title => title.replace(commonSourcesGlobalExp, '').trim(),
  },
  {
    name: 'remove web download marker',
    clean: title => title.replace(webdlExp, '').trim(),
  },
  {
    name: 'remove edition marker',
    clean: title => title.replace(editionExp, '').trim(),
  },
  {
    name: 'remove language marker',
    clean: title => title.replace(languageExp, '').trim(),
  },
  {
    name: 'remove scene garbage marker',
    clean: title => title.replace(sceneGarbageGlobalExp, '').trim(),
  },
  {
    name: 'remove language names',
    clean: title => title.replace(allLanguagesGlobalExp, '').trim(),
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

export function releaseTitleCleaner(title: string): string | null {
  if (!title || title.length === 0 || title === '(') {
    return null;
  }

  const trimmedTitle = applyCleanupPasses(title, releaseTitleCleanupPasses);

  const parts = trimmedTitle.split('.');
  let result = '';
  let n = 0;
  let previousAcronym = false;
  let nextPart = '';
  for (const part of parts) {
    if (parts.length >= n + 2) {
      nextPart = parts[n + 1] ?? '';
    }

    if (
      part.length === 1 &&
      part.toLowerCase() !== 'a' &&
      Number.isNaN(Number.parseInt(part, 10))
    ) {
      result += `${part}.`;
      previousAcronym = true;
    } else if (part.toLowerCase() === 'a' && (previousAcronym || nextPart.length === 1)) {
      result += `${part}.`;
      previousAcronym = true;
    } else {
      if (previousAcronym) {
        result += ' ';
        previousAcronym = false;
      }

      result += `${part} `;
    }

    n++;
  }

  return result.trim();
}
