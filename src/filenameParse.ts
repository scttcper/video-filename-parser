import { VideoCodec, parseVideoCodec } from './videoCodec';
import { Edition, parseEdition } from './edition';
import { parseGroup } from './group';
import { Resolution } from './resolution';
import { Source } from './source';
import { parseTitleAndYear } from './title';
import { parseQuality, Revision, QualitySource } from './quality';
import { parseAudioCodec, AudioCodec } from './audioCodec';
import { parseAudioChannels, Channels } from './audioChannels';
import { parseSeason, Season } from './season';
import { parseLanguage, Language, isMulti } from './language';

// eslint-disable-next-line @typescript-eslint/ban-types
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
  qualitySource: QualitySource;
  languages: Language[];
  multi?: boolean;
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
    qualitySource: quality.qualitySource,
  };

  if (isTv) {
    const season = parseSeason(name);
    if (season !== null) {
      let seasonResult: ParsedTvInfo = {
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

  return result;
}
