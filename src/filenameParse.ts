import { VideoCodec, parseVideoCodec } from './videoCodec';
import { Edition, parseEdition } from './edition';
import { parseGroup } from './group';
import { Resolution } from './resolution';
import { Source } from './source';
import { parseTitleAndYear } from './title';
import { parseQuality, Revision, QualitySource } from './quality';
import { parseAudioCodec, AudioCodec } from './audioCodec';
import { parseAudioChannels, Channels } from './audioChannels';
import { parseSeason } from './season';

export interface ParsedFilename {
  title: string;
  seasons: number[];
  episodeNumbers: number[] | null;
  year: string | null;
  edition: Edition;
  resolution: Resolution | null;
  source: Source | null;
  videoCodec: VideoCodec | null;
  audioCodec: AudioCodec | null;
  audioChannels: Channels | null;
  group: string | null;
  revision: Revision;
  qualitySource: QualitySource;
  isTv: boolean;
}

/**
 * @param name release / file name
 * @param isTV
 */
export function filenameParse(name: string, isTv = false): ParsedFilename {
  let title: ParsedFilename['title'] = '';
  let year: ParsedFilename['year'] = null;

  if (isTv === false) {
    const titleAndYear = parseTitleAndYear(name);
    title = titleAndYear.title;
    year = titleAndYear.year;
  }

  let seasons: ParsedFilename['seasons'] = [];
  let episodeNumbers: ParsedFilename['episodeNumbers'] = null;
  if (isTv) {
    const seasonResult = parseSeason(name);
    if (seasonResult) {
      title = seasonResult.seriesTitle;
      seasons = seasonResult.seasonNumber;
      episodeNumbers = seasonResult.episodeNumbers;
    }
  }

  const edition = parseEdition(name);
  const { codec: videoCodec } = parseVideoCodec(name);
  const { codec: audioCodec } = parseAudioCodec(name);
  const { channels: audioChannels } = parseAudioChannels(name);
  const group = parseGroup(name);
  const quality = parseQuality(name);

  return {
    title,
    seasons,
    episodeNumbers,
    year,
    resolution: quality.resolution,
    source: quality.source,
    videoCodec,
    audioCodec,
    audioChannels,
    revision: quality.revision,
    group,
    edition,
    qualitySource: quality.qualitySource,
    isTv,
  };
}
