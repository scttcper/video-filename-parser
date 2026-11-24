import { removeFileExtension } from '../extensions.js';
import { removeTrackerTags, simplifyTitle } from '../title/cleanup.js';

import {
  normalizeSixDigitAirDate,
  parseGenericMatchCollection,
  type ParsedMatchCollection,
  parseRemainder,
} from './common.js';
import {
  preSubstitutions,
  rejectedPatterns,
  seasonPatterns,
  seasonSimpleTitleExp,
} from './patterns.js';

export interface Season {
  releaseTitle: string;
  seriesTitle: string;
  seasons: number[];
  episodeNumbers: number[];
  remainder?: string;
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

  let substituted = title;
  for (const [exp, replacement] of preSubstitutions) {
    substituted = substituted.replace(exp, replacement);
  }

  const simpleTitle = normalizeSixDigitAirDate(
    substituted,
    simplifyTitle(substituted).replaceAll(seasonSimpleTitleExp, ''),
  );

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

    return toSeason(title, getRemainder(substituted, simpleTitle, result), result);
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

const gapExp = /\.{2}| {2}/;
const leadingGapExp = /^(?:\.{2}| {2})/;

// The episode title, checked against the name the release tags were stripped from
function getRemainder(
  name: string,
  simpleTitle: string,
  result: ParsedMatchCollection,
): string | undefined {
  const tokens = result.releaseTokens;
  if (result.remainder === undefined || tokens === undefined) {
    return undefined;
  }

  // A gap right after the episode is where a resolution or source was removed, so what follows is
  // release info and not an episode title: S01E05.1080p.AMZN.WEB-DL.DDP5.1.H.264. Not when the
  // gap was in the name to begin with, Show.S01E05..The.Pilot
  if (leadingGapExp.test(tokens)) {
    // Nothing was removed in front of the gap, so the name has it at the same place if it is its own
    const gapIndex = simpleTitle.length - tokens.length;
    const isOwnGap = name.startsWith(simpleTitle.slice(0, gapIndex))
      ? leadingGapExp.test(name.slice(gapIndex))
      : gapExp.test(removeFileExtension(name));
    if (!isOwnGap) {
      return undefined;
    }
  }

  // The name no longer ends the same way, so release tags were stripped after the episode title.
  // A tracker tag like [rartv] isn't one.
  return removeTrackerTags(name).endsWith(tokens) ? result.remainder : parseRemainder(tokens, true);
}

function toSeason(
  title: string,
  remainder: string | undefined,
  result: ParsedMatchCollection,
): Season {
  const isSpecialFullSeason =
    result.fullSeason === true &&
    result.releaseTokens !== undefined &&
    /Special/i.test(result.releaseTokens);

  return {
    releaseTitle: title,
    seriesTitle: result.seriesName,
    seasons: result.seasonNumbers ?? [],
    episodeNumbers: result.episodeNumbers ?? [],
    ...(remainder ? { remainder } : {}),
    airDate: result.airDate ?? null,
    fullSeason: isSpecialFullSeason ? false : (result.fullSeason ?? false),
    isPartialSeason: result.isPartialSeason ?? false,
    isMultiSeason: result.isMultiSeason ?? false,
    isSeasonExtra: result.isSeasonExtra ?? false,
    isSpecial: isSpecialFullSeason || (result.isSpecial ?? false),
    seasonPart: result.seasonPart ?? 0,
  };
}
