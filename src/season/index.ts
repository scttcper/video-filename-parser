import { simplifyTitle } from '../title/cleanup.js';

import {
  normalizeSixDigitAirDate,
  parseGenericMatchCollection,
  type ParsedMatchCollection,
} from './common.js';
import { rejectedPatterns, seasonPatterns } from './patterns.js';

export interface Season {
  releaseTitle: string;
  seriesTitle: string;
  seasons: number[];
  episodeNumbers: number[];
  airDate: Date | null;
  // Language: Language;
  fullSeason: boolean;
  isPartialSeason: boolean;
  isMultiSeason: boolean;
  /**
   * Check to see if this is an "Extras" or "SUBPACK" release, if it is, set
   */
  isSeasonExtra: boolean;
  isSpecial: boolean;
  /**
   * Partial season packs will have a seasonpart group so they can be differentiated from a full season/single episode release
   */
  seasonPart: number;
  // ReleaseTokens:
}

export function parseSeason(title: string): Season | null {
  if (!preValidation(title)) {
    return null;
  }

  const simpleTitle = normalizeSixDigitAirDate(title, simplifyTitle(title));

  for (const pattern of seasonPatterns) {
    const match = pattern.regex.exec(simpleTitle);
    if (!match?.groups) {
      continue;
    }

    const result = pattern.parse(match, simpleTitle);
    if (result === null) {
      if (pattern.stopOnNull === true) {
        return null;
      }

      continue;
    }

    return toSeason(title, result);
  }

  return null;
}

export function parseMatchCollection(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  return parseGenericMatchCollection(match, simpleTitle);
}

function preValidation(title: string): boolean {
  for (const exp of rejectedPatterns) {
    const match = exp.exec(title);
    if (match !== null) {
      return false;
    }
  }

  return true;
}

function toSeason(title: string, result: ParsedMatchCollection): Season {
  const isSpecialFullSeason =
    result.fullSeason === true &&
    result.releaseTokens !== undefined &&
    /Special/i.test(result.releaseTokens);

  return {
    releaseTitle: title,
    seriesTitle: result.seriesName,
    seasons: result.seasonNumbers ?? [],
    episodeNumbers: result.episodeNumbers ?? [],
    airDate: result.airDate ?? null,
    fullSeason: isSpecialFullSeason ? false : (result.fullSeason ?? false),
    isPartialSeason: result.isPartialSeason ?? false,
    isMultiSeason: result.isMultiSeason ?? false,
    isSeasonExtra: result.isSeasonExtra ?? false,
    isSpecial: isSpecialFullSeason || (result.isSpecial ?? false),
    seasonPart: result.seasonPart ?? 0,
  };
}
