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
  if (uniqArr.length === 0) {
    return [];
  }

  const first = Number(uniqArr[0]);
  const last = Number(uniqArr[uniqArr.length - 1]);

  const range = expandIntegerRange(first, last);
  if (range === null) {
    return arr;
  }

  return range;
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

  const hasAbsoluteEpisode = hasAnyGroup(groups, 'absoluteepisode', 'absoluteepisode1');
  const hasSeasonPart = hasAnyGroup(groups, 'seasonpart');
  const hasEpisode = hasAnyGroup(groups, 'episode', 'episode1');

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
  const airYear = Number.parseInt(groupValue(groups, 'airyear') ?? '', 10);
  return airYear >= 1900;
}

function parseAirDateGroups(
  groups: MatchGroups,
  simpleTitle: string,
): ParsedMatchCollection | null {
  const { result } = createBaseResult(groups, simpleTitle);
  let lastTokenIndex = indexOfEnd(simpleTitle, groupValue(groups, 'title') ?? '');
  const airYearText = groupValue(groups, 'airyear');
  const airMonthText = groupValue(groups, 'airmonth');
  const airDayText = groupValue(groups, 'airday');

  if (!airYearText || !airMonthText || !airDayText) {
    return null;
  }

  const airYear = Number.parseInt(airYearText, 10);
  let airMonth = Number.parseInt(airMonthText, 10);
  let airDay = Number.parseInt(airDayText, 10);

  if (airMonth > 12) {
    const tempDay = airDay;
    airDay = airMonth;
    airMonth = tempDay;
  }

  const airDate = new Date(airYear, airMonth - 1, airDay);
  if (!isValidAirDate(airDate, airYear, airMonth, airDay)) {
    return null;
  }

  lastTokenIndex = Math.max(indexOfEnd(simpleTitle, airYearText), lastTokenIndex);
  lastTokenIndex = Math.max(indexOfEnd(simpleTitle, airMonthText), lastTokenIndex);
  lastTokenIndex = Math.max(indexOfEnd(simpleTitle, airDayText), lastTokenIndex);
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

  if (groupValue(groups, 'extras')) {
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
  const seasonPart = groupValue(groups, 'seasonpart');

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
  const title = groupValue(groups, 'title') ?? '';
  const seriesName = title
    .replaceAll('.', ' ')
    .replaceAll('_', ' ')
    .replace(requestInfoExp, '')
    .trim();

  return {
    result: {
      seriesName,
    },
    lastTokenIndex: indexOfEnd(simpleTitle, title),
  };
}

function applySeasonNumbers(
  result: ParsedMatchCollection,
  groups: MatchGroups,
  simpleTitle: string,
  lastTokenIndex: number,
): number {
  let nextIndex = lastTokenIndex;
  let seasons = [groupValue(groups, 'season'), groupValue(groups, 'season1')]
    .filter(isPresent)
    .map(x => {
      nextIndex = Math.max(indexOfEnd(simpleTitle, x), nextIndex);
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
  const episodeCaptures = [groupValue(groups, 'episode'), groupValue(groups, 'episode1')].filter(
    isPresent,
  );
  if (episodeCaptures.length === 0) {
    return undefined;
  }

  const first = Number(episodeCaptures[0]);
  const last = Number(episodeCaptures[episodeCaptures.length - 1]);
  const range = expandIntegerRange(first, last);
  if (range === null) {
    return null;
  }

  result.episodeNumbers = range;
  return undefined;
}

function applyAbsoluteEpisodeNumbers(
  result: ParsedMatchCollection,
  groups: MatchGroups,
): { lastCapture?: string } | null {
  const absoluteEpisodeCaptures = [
    groupValue(groups, 'absoluteepisode'),
    groupValue(groups, 'absoluteepisode1'),
  ].filter(isPresent);
  if (absoluteEpisodeCaptures.length === 0) {
    return {};
  }

  const first = Number(absoluteEpisodeCaptures[0]);
  const lastCapture = absoluteEpisodeCaptures[absoluteEpisodeCaptures.length - 1] ?? '';
  const last = Number(lastCapture);

  if (!Number.isFinite(first) || !Number.isFinite(last) || first > last) {
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

  const range = expandIntegerRange(first, last);
  if (range === null) {
    return null;
  }

  result.episodeNumbers = range;

  if (groupValue(groups, 'special')) {
    result.isSpecial = true;
  }

  return { lastCapture };
}

function finishResult(
  result: ParsedMatchCollection,
  simpleTitle: string,
  lastTokenIndex: number,
): ParsedMatchCollection {
  const releaseTokens =
    lastTokenIndex === simpleTitle.length || lastTokenIndex === -1
      ? simpleTitle
      : simpleTitle.slice(lastTokenIndex);

  return {
    ...result,
    releaseTokens,
    seriesTitle: result.seriesName,
  };
}

function groupValue(groups: MatchGroups, name: string): string | undefined {
  const value = groups[name];
  return value === undefined || value.length === 0 ? undefined : value;
}

function hasAnyGroup(groups: MatchGroups, ...names: string[]): boolean {
  return names.some(name => groupValue(groups, name) !== undefined);
}

function isPresent(value: string | undefined): value is string {
  return value !== undefined;
}

function expandIntegerRange(first: number, last: number): number[] | null {
  if (!Number.isInteger(first) || !Number.isInteger(last) || first > last) {
    return null;
  }

  return Array.from({ length: last - first + 1 }, (_, index) => index + first);
}

function isValidAirDate(airDate: Date, airYear: number, airMonth: number, airDay: number): boolean {
  if (Number.isNaN(airDate.getTime())) {
    return false;
  }

  if (
    airDate.getFullYear() !== airYear ||
    airDate.getMonth() !== airMonth - 1 ||
    airDate.getDate() !== airDay
  ) {
    return false;
  }

  if (airDate.getTime() > Date.now()) {
    return false;
  }

  return airDate.getTime() >= new Date(1970, 1, 1).getTime();
}

function indexOfEnd(str1: string, str2: string): number {
  if (str2.length === 0) {
    return -1;
  }

  const io = str1.indexOf(str2);
  return io === -1 ? -1 : io + str2.length;
}
