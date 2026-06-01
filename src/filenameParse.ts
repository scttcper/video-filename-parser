import { type Channels, parseAudioChannels } from './audioChannels.js';
import { type AudioCodec, parseAudioCodec } from './audioCodec.js';
import { isComplete } from './complete.js';
import { type Edition, parseEdition } from './edition.js';
import { parseGroup } from './group.js';
import { type Language, parseLanguageInfo } from './language.js';
import { parseQuality, type QualityModifier, type Revision } from './quality.js';
import type { Resolution } from './resolution.js';
import { parseSeason, type Season } from './season/index.js';
import type { Source } from './source.js';
import { parseTitleAndYear } from './title/index.js';
import { limitParseInput, removeEmpty } from './utils.js';
import { parseVideoCodec, type VideoCodec } from './videoCodec.js';

type ParsedTvInfo = Omit<Season, 'releaseTitle' | 'seriesTitle'>;

interface BaseParsed {
  title: string;
  year: string | null;
  edition: Edition;
  resolution?: Resolution;
  sources: Source[];
  videoCodec?: VideoCodec;
  audioCodec?: AudioCodec;
  audioChannels?: Channels;
  modifier?: QualityModifier;
  group: string | null;
  revision: Revision;
  languages: Language[];
  multi?: boolean;
  complete?: boolean;
}

export type ParsedMovie = BaseParsed;
export type ParsedShow = ParsedTvInfo & BaseParsed & { isTv: true };
export type ParsedFilename = ParsedMovie | ParsedShow;

/**
 * @param name release / file name
 * @param isTV
 */
export function filenameParse(name: string, isTv = false): ParsedFilename {
  const parseName = limitParseInput(name);

  // Compute once and share with sub-parsers to avoid 3 redundant calls
  const titleAndYear = parseTitleAndYear(parseName);
  const parsedTitle = titleAndYear.title;

  let title: ParsedFilename['title'] = '';
  let year: ParsedFilename['year'] = null;

  if (!isTv) {
    title = titleAndYear.title;
    year = titleAndYear.year;
  }

  const edition = parseEdition(parseName, parsedTitle);
  const { codec: videoCodec } = parseVideoCodec(parseName);
  const { codec: audioCodec } = parseAudioCodec(parseName);
  const { channels: audioChannels } = parseAudioChannels(parseName);
  const group = parseGroup(parseName, parsedTitle);
  const { languages, multi } = parseLanguageInfo(parseName, parsedTitle);
  const quality = parseQuality(parseName, videoCodec);
  const complete = isComplete(parseName);

  const result: BaseParsed = {
    title,
    year,
    resolution: quality.resolution,
    sources: quality.sources,
    videoCodec,
    audioCodec,
    audioChannels,
    modifier: quality.modifier ?? undefined,
    revision: quality.revision,
    group,
    edition,
    languages,
    multi,
    complete,
  };

  if (isTv) {
    const season = parseSeason(parseName);
    if (season !== null) {
      const seasonResult: ParsedTvInfo = {
        seasons: season.seasons,
        episodeNumbers: season.episodeNumbers,
        airDate: season.airDate,
        fullSeason: season.fullSeason,
        isPartialSeason: season.isPartialSeason,
        isMultiSeason: season.isMultiSeason,
        isSeasonExtra: season.isSeasonExtra,
        isSpecial: season.isSpecial,
        seasonPart: season.seasonPart,
      };

      return {
        ...result,
        title: season.seriesTitle ?? title,
        ...seasonResult,
        isTv: true,
      };
    }
  }

  return removeEmpty(result);
}
