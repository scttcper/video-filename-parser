import { VideoCodec, parseVideoCodec } from './videoCodec';
import { Edition, parseEdition } from './edition';
import { parseGroup } from './group';
import { Resolution } from './resolution';
import { Source } from './source';
import { parseTitleAndYear } from './title';
import { parseQuality, Revision, QualitySource } from './quality';
import { parseAudioCodec, AudioCodec } from './audioCodec';
import { parseAudioChannels, Channels } from './audioChannels';

export interface ParsedFilename {
  title: string;
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
}

export function filenameParse(name: string): ParsedFilename {
  const { title, year } = parseTitleAndYear(name);
  const edition = parseEdition(name);
  const { codec: videoCodec } = parseVideoCodec(name);
  const { codec: audioCodec } = parseAudioCodec(name);
  const { channels: audioChannels } = parseAudioChannels(name);
  const group = parseGroup(name);
  const quality = parseQuality(name);

  return {
    title,
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
  };
}
