import { Language } from './language.js';
import { webdlExp } from './source.js';
import { parseVideoCodec } from './videoCodec.js';

const simpleTitleRegex =
  /\s*(?:480[ip]|576[ip]|720[ip]|1080[ip]|2160[ip]|HVEC|[xh][\W_]?26[45]|DD\W?5\W1|[<>?*:|]|848x480|1280x720|1920x1080)((8|10)b(it))?/i;
const websitePrefixRegex = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanTorrentPrefixRegex = /^\[(?:REQ)\]/i;
const cleanTorrentSuffixRegex = /\[(?:ettv|rartv|rarbg|cttv)\]$/i;
/** Used to help cleanup releases that often emit the year title.SCR-group */
const commonSourcesRegex =
  /\b(Bluray|(dvdr?|BD)rip|HDTV|HDRip|TS|R5|CAM|SCR|SCREENER|DiVX|xvid|web-?dl)\b/i;

export function simplifyTitle(title: string): string {
  let simpleTitle = title.replace(simpleTitleRegex, '');
  simpleTitle = simpleTitle.replace(websitePrefixRegex, '');
  simpleTitle = simpleTitle.replace(cleanTorrentPrefixRegex, '');
  simpleTitle = simpleTitle.replace(cleanTorrentSuffixRegex, '');
  simpleTitle = simpleTitle.replace(new RegExp(commonSourcesRegex, 'ig'), '');
  simpleTitle = simpleTitle.replace(webdlExp, '');

  // allow filtering of up to two codecs.
  // maybe parseVideoCodec should be an array
  const { source: videoCodec1 } = parseVideoCodec(simpleTitle);

  if (videoCodec1) {
    simpleTitle = simpleTitle.replace(videoCodec1, '');
  }

  const { source: videoCodec2 } = parseVideoCodec(simpleTitle);

  if (videoCodec2) {
    simpleTitle = simpleTitle.replace(videoCodec2, '');
  }

  return simpleTitle.trim();
}

const requestInfoRegex = /\[.+?\]/i;
const editionExp =
  /\b((Extended.|Ultimate.)?(Director.?s|Collector.?s|Theatrical|Anniversary|The.Uncut|Ultimate|Final(?=(.(Cut|Edition|Version)))|Extended|Special|Despecialized|unrated|\d{2,3}(th)?.Anniversary)(.(Cut|Edition|Version))?(.(Extended|Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit))?|((Uncensored|Remastered|Unrated|Uncut|IMAX|Fan.?Edit|Edition|Restored|((2|3|4)in1)))){1,3}/i;
const languageExp = /\b(TRUE.?FRENCH|videomann|SUBFRENCH|PLDUB|MULTI)/i;
const sceneGarbageExp = /\b(PROPER|REAL|READ.NFO)/;

export function releaseTitleCleaner(title: string): string | null {
  if (!title || title.length === 0 || title === '(') {
    return null;
  }

  let trimmedTitle = title.replace('_', ' ');
  trimmedTitle = trimmedTitle.replace(requestInfoRegex, '').trim();
  trimmedTitle = trimmedTitle.replace(new RegExp(commonSourcesRegex, 'ig'), '').trim();
  trimmedTitle = trimmedTitle.replace(webdlExp, '').trim();
  trimmedTitle = trimmedTitle.replace(editionExp, '').trim();
  trimmedTitle = trimmedTitle.replace(languageExp, '').trim();
  trimmedTitle = trimmedTitle.replace(new RegExp(sceneGarbageExp, 'ig'), '').trim();

  for (const lang of Object.values(Language)) {
    trimmedTitle = trimmedTitle.replace(new RegExp(`\\b${lang.toUpperCase()}`), '').trim();
  }

  // Look for gap formed by removing items
  trimmedTitle = trimmedTitle.split('   ')[0]!;
  trimmedTitle = trimmedTitle.split('...')[0]!;

  const parts = trimmedTitle.split('.');
  let result = '';
  let n = 0;
  let previousAcronym = false;
  let nextPart = '';
  for (const part of parts) {
    if (parts.length >= n + 2) {
      nextPart = parts[n + 1] ?? '';
    }

    if (part.length === 1 && part.toLowerCase() !== 'a' && Number.isNaN(parseInt(part, 10))) {
      result += part + '.';
      previousAcronym = true;
    } else if (part.toLowerCase() === 'a' && (previousAcronym || nextPart.length === 1)) {
      result += part + '.';
      previousAcronym = true;
    } else {
      if (previousAcronym) {
        result += ' ';
        previousAcronym = false;
      }

      result += part + ' ';
    }

    n++;
  }

  return result.trim();
}
