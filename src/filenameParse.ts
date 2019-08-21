import { parseEdition } from './edition';
import { parseTitleAndYear } from './title';
import { parseResolution } from './resolution';
import { parseSource } from './source';

export function filenameParse(name: string) {
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
