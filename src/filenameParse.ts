import { parseEdition, Edition } from './edition';
import { parseTitleAndYear } from './title';
import { parseResolution, Resolution } from './resolution';
import { parseSource, Source } from './source';

export interface ParsedFilename {
  title: string;
  year: string | null;
  edition: Edition;
  resolution: Resolution | null;
  source: Source | null;
}

export function filenameParse(name: string): ParsedFilename {
  const { title, year } = parseTitleAndYear(name);
  const edition = parseEdition(name);
  const resolution = parseResolution(name);
  const source = parseSource(name);

  return {
    title,
    year,
    edition,
    resolution,
    source,
  };
}
