import { filenameParse, type ParsedFilename, type ParsedShow } from './filenameParse.js';
import { parseQuality, type QualityModel, type Revision } from './quality.js';

export interface RevisionUpgradeInput {
  current: string;
  candidate: string;
  isTv?: boolean;
}

interface ComparableRelease {
  parsed: ParsedFilename;
  qualityModifier: QualityModel['modifier'];
}

export function isRevisionUpgrade(input: RevisionUpgradeInput): boolean {
  const isTv = input.isTv ?? false;
  const current = parseComparableRelease(input.current, isTv);
  const candidate = parseComparableRelease(input.candidate, isTv);

  return (
    isSameReleaseType(current, candidate, isTv) &&
    isNewerRevision(current.parsed.revision, candidate.parsed.revision)
  );
}

function parseComparableRelease(name: string, isTv: boolean): ComparableRelease {
  const parsed = filenameParse(name, isTv);
  const quality = parseQuality(name, parsed.videoCodec);

  return {
    parsed,
    qualityModifier: quality.modifier,
  };
}

function isSameReleaseType(
  current: ComparableRelease,
  candidate: ComparableRelease,
  isTv: boolean,
): boolean {
  const currentIdentity = getReleaseIdentity(current, isTv);
  const candidateIdentity = getReleaseIdentity(candidate, isTv);

  return (
    currentIdentity !== null &&
    candidateIdentity !== null &&
    JSON.stringify(currentIdentity) === JSON.stringify(candidateIdentity)
  );
}

function isNewerRevision(current: Revision, candidate: Revision): boolean {
  if (candidate.version !== current.version) {
    return candidate.version > current.version;
  }

  return candidate.real > current.real;
}

function getReleaseIdentity(release: ComparableRelease, isTv: boolean): object | null {
  const { parsed } = release;

  if (isTv && !isParsedShow(parsed)) {
    return null;
  }

  return {
    title: parsed.title.toLowerCase(),
    year: parsed.year,
    resolution: parsed.resolution,
    sources: normalizeStringSet(parsed.sources),
    qualityModifier: release.qualityModifier,
    videoCodec: parsed.videoCodec,
    languages: normalizeStringSet(parsed.languages),
    multi: parsed.multi ?? false,
    edition: getEnabledFlags(parsed.edition),
    tv: isTv && isParsedShow(parsed) ? getTvIdentity(parsed) : null,
  };
}

function getTvIdentity(parsed: ParsedShow): object {
  return {
    seasons: parsed.seasons,
    episodeNumbers: parsed.episodeNumbers,
    airDate: parsed.airDate?.getTime() ?? null,
    fullSeason: parsed.fullSeason,
    isPartialSeason: parsed.isPartialSeason,
    isMultiSeason: parsed.isMultiSeason,
    isSeasonExtra: parsed.isSeasonExtra,
    isSpecial: parsed.isSpecial,
    seasonPart: parsed.seasonPart,
  };
}

function isParsedShow(parsed: ParsedFilename): parsed is ParsedShow {
  return 'isTv' in parsed && parsed.isTv === true;
}

function normalizeStringSet(values: readonly string[]): string[] {
  return [...new Set(values.map(value => value.toLowerCase()))].sort();
}

function getEnabledFlags(flags: ParsedFilename['edition']): string[] {
  return Object.entries(flags)
    .filter(([, value]) => value === true)
    .map(([key]) => key)
    .sort();
}
