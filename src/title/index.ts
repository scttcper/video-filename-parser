import { releaseTitleCleaner, simplifyTitle } from '../simplifyTitle.js';

import { getFirstTitleBoundaryPosition } from './boundaries.js';
import { movieTitleYearPatterns, releaseGroupSuffixExp } from './patterns.js';
import type { TitleAndYear, TitleYearPattern } from './types.js';

export function parseTitleAndYear(title: string): TitleAndYear {
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
