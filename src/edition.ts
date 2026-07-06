import { parseTitleAndYear } from './title/index.js';
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
  /** black and white */
  bw?: boolean;
  /** 3D film */
  threeD?: boolean;
  /** half side by side 3D */
  hsbs?: boolean;
  /** side by side 3D */
  sbs?: boolean;
  /** half over under 3D */
  hou?: boolean;
  /** most 2160p should be UHD but there might be some that aren't? */
  uhd?: boolean;
  /** original aspect ratio */
  oar?: boolean;
  dolbyVision?: boolean;
  hardcodedSubs?: boolean;
  deletedScenes?: boolean;
  bonusContent?: boolean;
}

type EditionFlag = keyof Edition;

interface EditionPattern {
  flag: EditionFlag;
  regex: RegExp;
  hint?: (title: string) => boolean;
}

const hasSbsMarker = (title: string): boolean => title.includes('sbs');
const hasHardcodedSubsMarker = (title: string): boolean =>
  title.includes('sub') || title.includes('hc');

const editionPatterns: EditionPattern[] = [
  { flag: 'internal', regex: /\b(INTERNAL)\b/i },
  { flag: 'limited', regex: /\b(LIMITED)\b/i },
  { flag: 'remastered', regex: /\b(Remastered|Anniversary|Restored)\b/i },
  { flag: 'extended', regex: /\b(Extended|Uncut|Ultimate|Rogue|Collector)\b/i },
  { flag: 'theatrical', regex: /\b(Theatrical)\b/i },
  { flag: 'directors', regex: /\b(Directors?)\b/i },
  { flag: 'unrated', regex: /\b(Uncensored|Unrated)\b/i },
  { flag: 'imax', regex: /\b(IMAX)\b/i },
  { flag: 'fanEdit', regex: /\b(Despecialized|Fan.?Edit)\b/i },
  { flag: 'hdr', regex: /\b(HDR)\b/i },
  { flag: 'bw', regex: /\b(BW)\b/i },
  { flag: 'threeD', regex: /\b(3D)\b/i },
  { flag: 'hsbs', regex: /\b(Half-?SBS|HSBS)\b/i, hint: hasSbsMarker },
  { flag: 'sbs', regex: /\b((?<!H|HALF-)SBS)\b/i, hint: hasSbsMarker },
  { flag: 'hou', regex: /\b(HOU)\b/i },
  { flag: 'uhd', regex: /\b(UHD)\b/i },
  { flag: 'oar', regex: /\b(OAR)\b/i },
  { flag: 'dolbyVision', regex: /\b(DV(\b(HDR10|HLG|SDR))?)\b/i },
  {
    flag: 'hardcodedSubs',
    regex: /\b((?<hcsub>(\w+(?<!SOFT|HORRIBLE)SUBS?))|(?<hc>(HC|SUBBED)))\b/i,
    hint: hasHardcodedSubsMarker,
  },
  { flag: 'deletedScenes', regex: /\b((Bonus.)?Deleted.Scenes)\b/i },
  {
    flag: 'bonusContent',
    regex:
      /\b((Bonus|Extras|Behind.the.Scenes|Making.of|Interviews|Featurettes|Outtakes|Bloopers|Gag.Reel).(?!(Deleted.Scenes)))\b/i,
  },
];

export function parseEdition(title: string, parsedTitle?: string): Edition {
  parsedTitle ??= parseTitleAndYear(title).title;
  const withoutTitle = getEditionSearchText(title, parsedTitle);

  const result: Edition = {};
  for (const { flag, regex, hint } of editionPatterns) {
    if ((hint === undefined || hint(withoutTitle)) && regex.test(withoutTitle)) {
      result[flag] = true;
    }
  }

  return result;
}

function getEditionSearchText(title: string, parsedTitle: string): string {
  return title.replace('.', ' ').replace(parsedTitle, '').toLowerCase();
}
