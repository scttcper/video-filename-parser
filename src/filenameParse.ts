import { Channels, parseAudioChannels } from './audioChannels.js';
import { AudioCodec, parseAudioCodec } from './audioCodec.js';
import { isComplete } from './complete.js';
import { Edition, parseEdition } from './edition.js';
import { parseGroup } from './group.js';
import { isMulti, Language, parseLanguage } from './language.js';
import { parseQuality, Revision } from './quality.js';
import { Resolution } from './resolution.js';
import { parseSeason, Season } from './season.js';
import { Source } from './source.js';
import { parseTitleAndYear } from './title.js';
import { removeEmpty } from './utils.js';
import { parseVideoCodec, VideoCodec } from './videoCodec.js';

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
  let title: ParsedFilename['title'] = '';
  let year: ParsedFilename['year'] = null;

  if (!isTv) {
    const titleAndYear = parseTitleAndYear(name);
    title = titleAndYear.title;
    year = titleAndYear.year;
  }

  const edition = parseEdition(name);
  const { codec: videoCodec } = parseVideoCodec(name);
  const { codec: audioCodec } = parseAudioCodec(name);
  const { channels: audioChannels } = parseAudioChannels(name);
  const group = parseGroup(name);
  const languages = parseLanguage(name);
  const quality = parseQuality(name);
  const multi = isMulti(name);
  const complete = isComplete(name);

  const result: BaseParsed = {
    title,
    year,
    resolution: quality.resolution,
    sources: quality.sources,
    videoCodec,
    audioCodec,
    audioChannels,
    revision: quality.revision,
    group,
    edition,
    languages,
    multi,
    complete,
  };

  if (isTv) {
    const season = parseSeason(name);
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
