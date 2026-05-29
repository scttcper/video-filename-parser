const requestInfoExp = /^(?:\[.+?\])+/;
const sixDigitAirDateMatchExp =
  /"(?<=[_.-])(?<airdate>(?<!\d)(?<airyear>[1-9]\d{1})(?<airmonth>[0-1][0-9])(?<airday>[0-3][0-9]))(?=[_.-])/i;

export interface ParsedMatchCollection {
  seriesName: string;
  seriesTitle?: string;
  seasonNumbers?: number[];
  isMultiSeason?: boolean;
  episodeNumbers?: number[];
  isSpecial?: boolean;
  isSeasonExtra?: boolean;
  seasonPart?: number;
  isPartialSeason?: boolean;
  fullSeason?: boolean;
  airDate?: Date;
  releaseTokens?: string;
}

type MatchGroups = NonNullable<RegExpExecArray['groups']>;

export function completeRange(arr: number[]): number[] {
  const uniqArr = [...new Set(arr)];

  const first = Number(uniqArr[0]);
  const last = Number(uniqArr[uniqArr.length - 1]);

  if (first > last) {
    return arr;
  }

  const count = last - first + 1;
  return [...Array.from({ length: count }).keys()].map(k => k + first);
}

export function normalizeSixDigitAirDate(title: string, simpleTitle: string): string {
  const sixDigitAirDateMatch = sixDigitAirDateMatchExp.exec(title);
  if (!sixDigitAirDateMatch?.groups) {
    return simpleTitle;
  }

  const airYear = sixDigitAirDateMatch.groups.airyear ?? '';
  const airMonth = sixDigitAirDateMatch.groups.airmonth ?? '';
  const airDay = sixDigitAirDateMatch.groups.airday ?? '';
  if (airMonth === '00' && airDay === '00') {
    return simpleTitle;
  }

  const fixedDate = `20${airYear}.${airMonth}.${airDay}`;
  return simpleTitle.replace(sixDigitAirDateMatch.groups.airdate ?? '', fixedDate);
}

export function parseGenericMatchCollection(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { groups } = match;
  if (groups === undefined) {
    throw new Error('No match');
  }

  if (hasAirDate(groups)) {
    return parseAirDateGroups(groups, simpleTitle);
  }

  const hasAbsoluteEpisode = Boolean(groups.absoluteepisode || groups.absoluteepisode1);
  const hasSeasonPart = Boolean(groups.seasonpart);
  const hasEpisode = Boolean(groups.episode || groups.episode1);

  if (hasAbsoluteEpisode) {
    return parseAbsoluteEpisodeGroups(groups, simpleTitle);
  }

  if (hasSeasonPart) {
    return parsePartialSeasonGroups(groups, simpleTitle);
  }

  if (hasEpisode) {
    return parseSeasonEpisodeGroups(groups, simpleTitle);
  }

  return parseSeasonPackGroups(groups, simpleTitle);
}

export function parseAirDateMatch(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  return parseAirDateGroups(requireGroups(match), simpleTitle);
}

export function parseSeasonEpisodeMatch(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  return parseSeasonEpisodeGroups(requireGroups(match), simpleTitle);
}

export function parseSeasonPackMatch(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  return parseSeasonPackGroups(requireGroups(match), simpleTitle);
}

export function parsePartialSeasonMatch(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  return parsePartialSeasonGroups(requireGroups(match), simpleTitle);
}

export function parseAbsoluteEpisodeMatch(
  match: RegExpExecArray,
  simpleTitle: string,
): ParsedMatchCollection | null {
  return parseAbsoluteEpisodeGroups(requireGroups(match), simpleTitle);
}

function requireGroups(match: RegExpExecArray): MatchGroups {
  const { groups } = match;
  if (groups === undefined) {
    throw new Error('No match');
  }

  return groups;
}

function hasAirDate(groups: MatchGroups): boolean {
  const airYear = Number.parseInt(groups.airyear ?? '', 10);
  return airYear >= 1900;
}

function parseAirDateGroups(
  groups: MatchGroups,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { result } = createBaseResult(groups, simpleTitle);
  let lastTokenIndex = indexOfEnd(simpleTitle, groups.title ?? '');
  const airYear = Number.parseInt(groups.airyear ?? '', 10);
  let airMonth = Number.parseInt(groups.airmonth ?? '', 10);
  let airDay = Number.parseInt(groups.airday ?? '', 10);

  if (airMonth > 12) {
    const tempDay = airDay;
    airDay = airMonth;
    airMonth = tempDay;
  }

  const airDate = new Date(airYear, airMonth - 1, airDay);
  if (airDate.getTime() > Date.now()) {
    throw new Error('Parsed date is in the future');
  }

  if (airDate.getTime() < new Date(1970, 1, 1).getTime()) {
    throw new Error('Parsed date error');
  }

  lastTokenIndex = Math.max(indexOfEnd(simpleTitle, groups.airyear ?? ''), lastTokenIndex);
  lastTokenIndex = Math.max(indexOfEnd(simpleTitle, groups.airmonth ?? ''), lastTokenIndex);
  lastTokenIndex = Math.max(indexOfEnd(simpleTitle, groups.airday ?? ''), lastTokenIndex);
  result.airDate = airDate;

  return finishResult(result, simpleTitle, lastTokenIndex);
}

function parseSeasonEpisodeGroups(
  groups: MatchGroups,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { result, lastTokenIndex } = createBaseResult(groups, simpleTitle);
  const nextIndex = applySeasonNumbers(result, groups, simpleTitle, lastTokenIndex);
  const episodeResult = applyEpisodeNumbers(result, groups);
  if (episodeResult === null) {
    return null;
  }

  return finishResult(result, simpleTitle, nextIndex);
}

function parseSeasonPackGroups(
  groups: MatchGroups,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { result, lastTokenIndex } = createBaseResult(groups, simpleTitle);
  const nextIndex = applySeasonNumbers(result, groups, simpleTitle, lastTokenIndex);

  if (groups.extras) {
    result.isSeasonExtra = true;
  }

  result.fullSeason = true;
  return finishResult(result, simpleTitle, nextIndex);
}

function parsePartialSeasonGroups(
  groups: MatchGroups,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { result, lastTokenIndex } = createBaseResult(groups, simpleTitle);
  const nextIndex = applySeasonNumbers(result, groups, simpleTitle, lastTokenIndex);
  const seasonPart = groups.seasonpart;

  if (seasonPart) {
    result.seasonPart = Number.parseInt(seasonPart, 10);
    result.isPartialSeason = true;
  } else {
    result.fullSeason = true;
  }

  return finishResult(result, simpleTitle, nextIndex);
}

function parseAbsoluteEpisodeGroups(
  groups: MatchGroups,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { result, lastTokenIndex } = createBaseResult(groups, simpleTitle);
  let nextIndex = applySeasonNumbers(result, groups, simpleTitle, lastTokenIndex);
  const episodeResult = applyEpisodeNumbers(result, groups);
  if (episodeResult === null) {
    return null;
  }

  const absoluteResult = applyAbsoluteEpisodeNumbers(result, groups);
  if (absoluteResult === null) {
    return null;
  }

  if (absoluteResult.lastCapture) {
    nextIndex = Math.max(indexOfEnd(simpleTitle, absoluteResult.lastCapture), nextIndex);
  }

  return finishResult(result, simpleTitle, nextIndex);
}

function createBaseResult(
  groups: MatchGroups,
  simpleTitle: string,
): {
  result: ParsedMatchCollection;
  lastTokenIndex: number;
} {
  const seriesName = (groups.title ?? '')
    .replaceAll('.', ' ')
    .replaceAll('_', ' ')
    .replace(requestInfoExp, '')
    .trim();

  return {
    result: {
      seriesName,
    },
    lastTokenIndex: indexOfEnd(simpleTitle, groups.title ?? ''),
  };
}

function applySeasonNumbers(
  result: ParsedMatchCollection,
  groups: MatchGroups,
  simpleTitle: string,
  lastTokenIndex: number,
): number {
  let nextIndex = lastTokenIndex;
  let seasons = [groups.season, groups.season1]
    .filter(x => x !== undefined && x.length > 0)
    .map(x => {
      nextIndex = Math.max(indexOfEnd(simpleTitle, x ?? ''), nextIndex);
      return Number(x);
    });

  if (seasons.length > 1) {
    seasons = completeRange(seasons);
  }

  result.seasonNumbers = seasons;
  if (seasons.length > 1) {
    result.isMultiSeason = true;
  }

  return nextIndex;
}

function applyEpisodeNumbers(result: ParsedMatchCollection, groups: MatchGroups): null | undefined {
  const episodeCaptures = [groups.episode, groups.episode1].filter(x => x);
  if (episodeCaptures.length === 0) {
    return undefined;
  }

  const first = Number(episodeCaptures[0]);
  const last = Number(episodeCaptures[episodeCaptures.length - 1]);

  if (first > last) {
    return null;
  }

  const count = last - first + 1;
  result.episodeNumbers = [...Array.from({ length: count }).keys()].map(k => k + first);
  return undefined;
}

function applyAbsoluteEpisodeNumbers(
  result: ParsedMatchCollection,
  groups: MatchGroups,
): { lastCapture?: string } | null {
  const absoluteEpisodeCaptures = [groups.absoluteepisode, groups.absoluteepisode1].filter(x => x);
  if (absoluteEpisodeCaptures.length === 0) {
    return {};
  }

  const first = Number(absoluteEpisodeCaptures[0]);
  const lastCapture = absoluteEpisodeCaptures[absoluteEpisodeCaptures.length - 1] ?? '';
  const last = Number(lastCapture);

  if (first > last) {
    return null;
  }

  if (first % 1 !== 0 || last % 1 !== 0) {
    if (absoluteEpisodeCaptures.length !== 1) {
      return null;
    }

    result.episodeNumbers = [first];
    result.isSpecial = true;
    return { lastCapture };
  }

  const count = last - first + 1;
  result.episodeNumbers = [...Array.from({ length: Math.floor(count) }).keys()].map(
    k => k + Math.floor(first),
  );

  if (groups.special) {
    result.isSpecial = true;
  }

  return { lastCapture };
}

function finishResult(
  result: ParsedMatchCollection,
  simpleTitle: string,
  lastTokenIndex: number,
): ParsedMatchCollection {
  if (lastTokenIndex === simpleTitle.length || lastTokenIndex === -1) {
    result.releaseTokens = simpleTitle;
  } else {
    result.releaseTokens = simpleTitle.slice(lastTokenIndex);
  }

  result.seriesTitle = result.seriesName;
  return result;
}

function indexOfEnd(str1: string, str2: string): number {
  if (str2.length === 0) {
    return -1;
  }

  const io = str1.indexOf(str2);
  return io === -1 ? -1 : io + str2.length;
}
