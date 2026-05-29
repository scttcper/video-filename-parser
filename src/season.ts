import {
  completeRange,
  normalizeSixDigitAirDate,
  parseGenericMatchCollection,
  type ParsedMatchCollection,
} from './season/common.js';
import { rejectedPatterns, seasonPatterns } from './season/patterns.js';
import { simplifyTitle } from './simplifyTitle.js';

export { completeRange, type ParsedMatchCollection };

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
  if (result.fullSeason && result.releaseTokens && /Special/i.test(result.releaseTokens)) {
    result.fullSeason = false;
    result.isSpecial = true;
  }

  return {
    releaseTitle: title,
    seriesTitle: result.seriesName,
    seasons: result.seasonNumbers ?? [],
    episodeNumbers: result.episodeNumbers ?? [],
    airDate: result.airDate ?? null,
    fullSeason: result.fullSeason ?? false,
    isPartialSeason: result.isPartialSeason ?? false,
    isMultiSeason: result.isMultiSeason ?? false,
    isSeasonExtra: result.isSeasonExtra ?? false,
    isSpecial: result.isSpecial ?? false,
    seasonPart: result.seasonPart ?? 0,
  };
}
