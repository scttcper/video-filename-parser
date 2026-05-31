import { getFirstTitleBoundaryPosition } from './boundaries.js';
import { releaseTitleCleaner, simplifyTitle } from './cleanup.js';
import { movieTitleYearPatterns, releaseGroupSuffixExp } from './patterns.js';
import type { TitleAndYear, TitleYearPattern } from './types.js';

const commonReleaseTitleYearExp =
  /^(?<title>(?![([])[^\r\n]+?)[-_. ](?<year>(?:1[89]|20)\d{2})(?=[-_. ](?:2160p|1080p|720p|576p|540p|480p|UHD|Blu-?Ray|Bluray|WEB[-_. ]?DL|WEBRip|HDRip|HDTV|DVDRip|BDRip|BRRip)\b)/i;
const websitePrefixExp = /^\[\s*[a-z]+(?:\.[a-z]+){1,4}\s*\][- ]*|^www\.[a-z]+\.(?:com|net)[ -]*/i;

export function parseTitleAndYear(title: string): TitleAndYear {
  const commonRelease = parseCommonReleaseTitleYear(title);
  if (commonRelease !== null) {
    return commonRelease;
  }

  const simpleTitle = simplifyTitle(title);

  // Removing the group from the end could be trouble if a title is "title-year"
  const grouplessTitle = simpleTitle.replace(releaseGroupSuffixExp, '');

  for (const pattern of movieTitleYearPatterns) {
    const result = parseTitleYearPattern(pattern, grouplessTitle);
    if (result !== null) {
      return result;
    }
  }

  const firstPosition = getFirstTitleBoundaryPosition(title);
  if (firstPosition !== null) {
    return { title: releaseTitleCleaner(title.slice(0, firstPosition)) ?? '', year: null };
  }

  return { title: title.trim(), year: null };
}

function parseCommonReleaseTitleYear(title: string): TitleAndYear | null {
  if (websitePrefixExp.test(title)) {
    return null;
  }

  const match = commonReleaseTitleYearExp.exec(title);
  if (!match?.groups) {
    return null;
  }

  const cleanTitle = releaseTitleCleaner(match.groups.title ?? '');
  if (cleanTitle === null) {
    return null;
  }

  return {
    title: cleanTitle,
    year: match.groups.year ?? null,
  };
}

function parseTitleYearPattern(pattern: TitleYearPattern, title: string): TitleAndYear | null {
  const match = pattern.regex.exec(title);
  if (!match?.groups) {
    return null;
  }

  const cleanTitle = releaseTitleCleaner(match.groups.title ?? '');
  if (cleanTitle === null) {
    return null;
  }

  return {
    title: cleanTitle,
    year: match.groups.year ?? null,
  };
}
