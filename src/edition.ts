import { parseTitleAndYear } from './title';
import { removeEmpty } from './utils';

const internalExp = /\b(INTERNAL)\b/i;
const remasteredExp = /\b(Remastered|Anniversary|Restored)\b/i;
const imaxExp = /\b(IMAX)\b/i;
const unratedExp = /\b(Uncensored|Unrated)\b/i;
const extendedExp = /\b(Extended|Uncut|Ultimate|Rogue|Collector)\b/i;
const theatricalExp = /\b(Theatrical)\b/i;
const directorsExp = /\b(Directors?)\b/i;
const fanExp = /\b(Despecialized|Fan.?Edit)\b/i;
const limitedExp = /\b(LIMITED)\b/i;
const hdrExp = /\b(HDR)\b/i;
const threeD = /\b(3D)\b/i;
const hsbs = /\b(Half-?SBS|HSBS)\b/i;
const sbs = /\b((?<!H|HALF-)SBS)\b/i;
const hou = /\b(HOU)\b/i;

export interface Edition {
  internal?: boolean;
  limited?: boolean;
  remastered?: boolean;
  extended?: boolean;
  theatrical?: boolean;
  /** Directors cut */
  directors?: boolean;
  unrated?: boolean;
  imax?: boolean;
  fanEdit?: boolean;
  hdr?: boolean;
  /** 3D film */
  threeD?: boolean;
  /** half side by side 3D */
  hsbs?: boolean;
  /** side by side 3D */
  sbs?: boolean;
  /** half over under 3D */
  hou?: boolean;
}

export function parseEdition(title: string): Edition {
  const parsedTitle = parseTitleAndYear(title, true).title;
  const withoutTitle = title.replace('.', ' ').replace(parsedTitle, '').toLowerCase();

  const result: Edition = {
    internal: internalExp.test(withoutTitle) || undefined,
    limited: limitedExp.test(withoutTitle) || undefined,
    remastered: remasteredExp.test(withoutTitle) || undefined,
    extended: extendedExp.test(withoutTitle) || undefined,
    theatrical: theatricalExp.test(withoutTitle) || undefined,
    directors: directorsExp.test(withoutTitle) || undefined,
    unrated: unratedExp.test(withoutTitle) || undefined,
    imax: imaxExp.test(withoutTitle) || undefined,
    fanEdit: fanExp.test(withoutTitle) || undefined,
    hdr: hdrExp.test(withoutTitle) || undefined,
    threeD: threeD.test(withoutTitle) || undefined,
    hsbs: hsbs.test(withoutTitle) || undefined,
    sbs: sbs.test(withoutTitle) || undefined,
    hou: hou.test(withoutTitle) || undefined,
  };

  return removeEmpty(result);
}
