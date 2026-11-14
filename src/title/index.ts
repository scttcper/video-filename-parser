import { removeFileExtension } from '../extensions.js';
import { hasWebsitePrefix } from '../website.js';

import { getFirstTitleBoundaryPosition } from './boundaries.js';
import { releaseTitleCleaner, simplifyTitle } from './cleanup.js';
import { movieTitleYearPatterns, releaseGroupSuffixExp } from './patterns.js';
import type { TitleAndYear, TitleYearPattern } from './types.js';

const commonReleaseTitleYearExp =
  /^(?<title>(?![([])[^\r\n]+?)[-_. ](?<year>(?:1[89]|20)\d{2})(?=[-_. ](?:2160p|1080p|720p|576p|540p|480p|UHD|Blu-?Ray|Bluray|WEB[-_. ]?DL|WEBRip|HDRip|HDTV|DVDRip|BDRip|BRRip)\b)/i;

// Leading [REQ], [Group] or tracker tags, from Radarr's RequestInfoRegex
const requestInfoPrefixExp = /^(?:\[[^\]\r\n]+\])+/;
const akaExp = / +A\.K\.A\. +/gi;
// Folder names with the year first: (1995) Movie Name
const yearFirstFolderExp = /^[([](?<year>(?:19|20)\d{2})[)\]][-_. ]+(?<title>[^\r\n]+)$/;
const yearExp = /^\d{4}$/;
// A bracket left open when a title is cut at its first quality token: Movie Name [1080p
const unclosedBracketExp = /[-_. ]*[[(][^\])]*$/;
// Where a title without a year runs into its first [tag]
const firstTagExp = /(?<=[^\s[\]])[-_. ]*\[/;

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

  const folder = yearFirstFolderExp.exec(grouplessTitle);
  if (folder?.groups) {
    const folderTitle = cleanMovieTitle(folder.groups.title ?? '');
    if (folderTitle) {
      return { title: folderTitle, year: folder.groups.year ?? null };
    }
  }

  const firstPosition = getFirstTitleBoundaryPosition(title);
  if (firstPosition !== null) {
    return {
      title: cleanMovieTitle(title.slice(0, firstPosition).replace(unclosedBracketExp, '')) ?? '',
      year: null,
    };
  }

  const bareTitle = removeFileExtension(title.trim()).trim();
  const tagIndex = bareTitle.search(firstTagExp);
  const untaggedTitle = tagIndex > 0 ? bareTitle.slice(0, tagIndex) : bareTitle;
  return { title: cleanMovieTitle(untaggedTitle) || bareTitle, year: null };
}

function cleanMovieTitle(title: string): string | null {
  return releaseTitleCleaner(
    title.replace(requestInfoPrefixExp, '').trim().replaceAll(akaExp, ' AKA '),
  );
}

function parseCommonReleaseTitleYear(title: string): TitleAndYear | null {
  if (hasWebsitePrefix(title)) {
    return null;
  }

  const match = commonReleaseTitleYearExp.exec(title);
  if (!match?.groups) {
    return null;
  }

  const cleanTitle = cleanMovieTitle(match.groups.title ?? '');
  if (cleanTitle === null) {
    return null;
  }

  return {
    title: cleanTitle,
    year: match.groups.year ?? null,
  };
}

function parseTitleYearPattern(pattern: TitleYearPattern, title: string): TitleAndYear | null {
  if (pattern.guard && !pattern.guard.test(title)) {
    return null;
  }

  const match = pattern.regex.exec(title);
  if (!match?.groups) {
    return null;
  }

  const cleanTitle = cleanMovieTitle(match.groups.title ?? '');
  if (cleanTitle === null) {
    return null;
  }

  const year = match.groups.year ?? '';
  return {
    title: cleanTitle,
    year: yearExp.test(year) ? year : null,
  };
}
