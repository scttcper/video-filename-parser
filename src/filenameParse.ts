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
import { parseLanguage, Language } from './language';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ParsedTvInfo = Omit<Season, 'releaseTitle' | 'seriesTitle'>;

export interface ParsedFilename extends ParsedTvInfo {
  title: string;
  year: string | null;
  edition: Edition;
  resolution: Resolution | null;
  sources: Source[];
  videoCodec: VideoCodec | null;
  audioCodec: AudioCodec | null;
  audioChannels: Channels | null;
  group: string | null;
  revision: Revision;
  qualitySource: QualitySource;
  languages: Language[];
  isTv: boolean;
}

const emptySeasonInfo = (): ParsedTvInfo => {
  return {
    seasons: [],
    episodeNumbers: [],
    airDate: null,
    fullSeason: false,
    isPartialSeason: false,
    isMultiSeason: false,
    isSeasonExtra: false,
    isSpecial: false,
    seasonPart: 0,
  };
};

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

  let seasonResult: ParsedTvInfo | null = null;
  if (isTv) {
    const season = parseSeason(name);
    if (season !== null) {
      title = season.seriesTitle;

      seasonResult = {
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
    }
  }

  if (seasonResult === null) {
    seasonResult = emptySeasonInfo();
  }

  const edition = parseEdition(name);
  const { codec: videoCodec } = parseVideoCodec(name);
  const { codec: audioCodec } = parseAudioCodec(name);
  const { channels: audioChannels } = parseAudioChannels(name);
  const group = parseGroup(name);
  const languages = parseLanguage(name);
  const quality = parseQuality(name);

  return {
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
    qualitySource: quality.qualitySource,
    ...seasonResult,
    isTv,
  };
}
