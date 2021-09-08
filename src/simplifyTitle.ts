import { webdlExp } from './source.js';
import { parseVideoCodec } from './videoCodec.js';

const simpleTitleRegex =
  /\s*(?:480[ip]|576[ip]|720[ip]|1080[ip]|2160[ip]|HVEC|[xh][\W_]?26[45]|DD\W?5\W1|[<>?*:|]|848x480|1280x720|1920x1080)((8|10)b(it))?/i;
const websitePrefixRegex = /^\[\s*[a-z]+(\.[a-z]+)+\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;
const cleanTorrentPrefixRegex = /^\[(?:REQ)\]/i;
const cleanTorrentSuffixRegex = /\[(?:ettv|rartv|rarbg|cttv)\]$/i;
/** Used to help cleanup releases that often emit the year title.SCR-group */
const commonSourcesRegex = /\b(Bluray|dvd(r|rip)?|HDTV|HDRip|CAM|SCR|xvid|web-?dl)\b/gi;

export function simplifyTitle(title: string): string {
  let simpleTitle = title.replace(simpleTitleRegex, '');
  simpleTitle = simpleTitle.replace(websitePrefixRegex, '');
  simpleTitle = simpleTitle.replace(cleanTorrentPrefixRegex, '');
  simpleTitle = simpleTitle.replace(cleanTorrentSuffixRegex, '');
  simpleTitle = simpleTitle.replaceAll(commonSourcesRegex, '');
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

export function releaseTitleCleaner(title: string): string | null {
  if (!title || title.length === 0 || title === '(') {
    return null;
  }

  let trimmedTitle = title.replace('_', ' ');
  trimmedTitle = trimmedTitle.replace(requestInfoRegex, '').trim();
  trimmedTitle = trimmedTitle.replaceAll(commonSourcesRegex, '').trim();
  trimmedTitle = trimmedTitle.replace(webdlExp, '').trim();

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
