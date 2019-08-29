import { Codec, parseCodec } from './codec';
import { Edition, parseEdition } from './edition';
import { parseGroup } from './group';
import { parseResolution, Resolution } from './resolution';
import { parseSource, Source } from './source';
import { parseTitleAndYear } from './title';

export interface ParsedFilename {
  title: string;
  year: string | null;
  edition: Edition;
  resolution: Resolution | null;
  source: Source | null;
  codec: Codec | null;
  group: string | null;
}

export function filenameParse(name: string): ParsedFilename {
  const { title, year } = parseTitleAndYear(name);
  const edition = parseEdition(name);
  const resolution = parseResolution(name);
  const source = parseSource(name);
  const codec = parseCodec(name);
  const group = parseGroup(name);

  return {
    title,
    year,
    edition,
    resolution,
    source,
    codec,
    group,
  };
}
