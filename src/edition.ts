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
  /**
   * Format tags are rarely real title words, but the title parser can swallow
   * them (e.g. "Warcraft.The.Beginning.3D.HOU.2016"), so search the full name.
   */
  includeTitle?: true;
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
  { flag: 'hdr', regex: /\b(HDR(?:10(?:\+|Plus)?)?)\b/i, includeTitle: true },
  { flag: 'bw', regex: /\b(BW)\b/i, includeTitle: true },
  { flag: 'threeD', regex: /\b(3D)\b/i, includeTitle: true },
  { flag: 'hsbs', regex: /\b(Half-?SBS|HSBS)\b/i, hint: hasSbsMarker, includeTitle: true },
  { flag: 'sbs', regex: /\b((?<!H|HALF-)SBS)\b/i, hint: hasSbsMarker, includeTitle: true },
  { flag: 'hou', regex: /\b(HOU)\b/i, includeTitle: true },
  { flag: 'uhd', regex: /\b(UHD)\b/i, includeTitle: true },
  { flag: 'oar', regex: /\b(OAR)\b/i, includeTitle: true },
  { flag: 'dolbyVision', regex: /\b(DV|DoVi|Dolby[-_. ]?Vision)\b/i, includeTitle: true },
  {
    flag: 'hardcodedSubs',
    regex: /\b((?<hcsub>(\w+(?<!SOFT|MULTI|HORRIBLE)SUBS?))|(?<hc>(HC|SUBBED)))\b/i,
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
  const fullTitle = normalizeSeparators(title).toLowerCase();
  const withoutTitle = getEditionSearchText(title, parsedTitle);

  const result: Edition = {};
  for (const { flag, regex, hint, includeTitle } of editionPatterns) {
    const searchText = includeTitle ? fullTitle : withoutTitle;
    if ((hint === undefined || hint(searchText)) && regex.test(searchText)) {
      result[flag] = true;
    }
  }

  return result;
}

const titleSeparatorExp = /[._]/g;

// Normalize separators on both sides so dotted release names line up with the
// parsed title. Otherwise title words like "Extended" or "Limited" leak through.
function getEditionSearchText(title: string, parsedTitle: string): string {
  return normalizeSeparators(title).replace(normalizeSeparators(parsedTitle), '').toLowerCase();
}

function normalizeSeparators(title: string): string {
  return title.replaceAll(titleSeparatorExp, ' ');
}
