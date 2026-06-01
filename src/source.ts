const blurayExp =
  /\b(M?Blu[-_. ]?Ray|HD[-_. ]?DVD|BD(?!$)|UHD2?BD|BDISO|BDMux|BD25|BD50|BD[-_. ]?(?:50|66|100)|BR[-_. ]?DISK|Bluray(2160|1080|720)p?|BD(2160|1080|720)p?)\b/i;
export const webdlExp =
  /\b(WEB[-_. ]DL(?:mux)?|HDRIP|WEBDL|NF|DP|APTV|NETFLIX|NetflixU?HD|DSNY|DSNP|DisneyHD|HMAX|HBOMaxHD|AMZN|AmazonHD|AmazonSD|iTunesHD|MaxdomeHD|WebHD\b|[. ]WEB[. ](?:[xh][ .]?26[45]|AVC|HEVC|DDP?5[. ]1)|\d{3,4}0p[-. ](?:Hybrid[-_. ]?)?WEB[-. ]|[-. ]WEB[-. ]\d{3,4}0p|\b\s\/\sWEB\s\/\s\b|(?:AMZN|NF|DP)[. -]WEB[. -](?!Rip))\b/i;

export enum Source {
  BLURAY = 'BLURAY',
  WEBDL = 'WEBDL',
  WEBRIP = 'WEBRIP',
  DVD = 'DVD',
  CAM = 'CAM',
  SCREENER = 'SCREENER',
  PPV = 'PPV',
  TELESYNC = 'TELESYNC',
  TELECINE = 'TELECINE',
  WORKPRINT = 'WORKPRINT',
  TV = 'TV',
}

interface SourceGroupPattern {
  group: SourceGroupKey;
  regex: RegExp;
}

type SourceGroupKey =
  | 'bluray'
  | 'webdl'
  | 'webrip'
  | 'hdtv'
  | 'bdrip'
  | 'brrip'
  | 'scr'
  | 'dvdr'
  | 'dvd'
  | 'dsr'
  | 'regional'
  | 'ppv'
  | 'ts'
  | 'tc'
  | 'cam'
  | 'workprint'
  | 'pdtv'
  | 'sdtv'
  | 'tvrip';

type SourceGroups = Record<SourceGroupKey, boolean>;

type SourcePolicy = {
  source: Source;
  matches: (groups: SourceGroups) => boolean;
};

const sourceGroupPatterns: SourceGroupPattern[] = [
  { group: 'bluray', regex: blurayExp },
  { group: 'webdl', regex: webdlExp },
  { group: 'webrip', regex: /\b(WebRip|Web-Rip|WEBCap|WEBMux)\b/i },
  { group: 'hdtv', regex: /\b(HDTV|HD[-_. ]TV)\b/i },
  { group: 'bdrip', regex: /\b(BDRip|BDLight|UHDBDRip|HD[-_. ]?DVDRip)\b/i },
  { group: 'brrip', regex: /\b(BRRip)\b/i },
  { group: 'scr', regex: /\b(SCR|SCREENER|DVDSCR|(DVD|WEB).?SCREENER)\b/i },
  { group: 'dvdr', regex: /\b(DVD-R|DVDR)\b/i },
  { group: 'dvd', regex: /\b(DVD9?|DVDRip|NTSC|PAL|xvidvd|DvDivX)\b/i },
  { group: 'dsr', regex: /\b(WS[-_. ]DSR|DSR)\b/i },
  { group: 'regional', regex: /\b(R[0-9]{1}|REGIONAL)\b/i },
  { group: 'ppv', regex: /\b(PPV)\b/i },
  { group: 'ts', regex: /\b(TS[-_. ]|TELESYNCH?|HD-TS|HDTS|PDVD|TSRip|HDTSRip)\b/i },
  { group: 'tc', regex: /\b(TC|TELECINE|HD-TC|HDTC)\b/i },
  { group: 'cam', regex: /\b(CAMRIP|(?:NEW)?CAM|HD-?CAM(?:Rip)?|HQCAM)\b/i },
  { group: 'workprint', regex: /\b(WORKPRINT|WP)\b/i },
  { group: 'pdtv', regex: /\b(PDTV)\b/i },
  { group: 'sdtv', regex: /\b(SDTV|SD[-_. ]TV)\b/i },
  { group: 'tvrip', regex: /\b(TVRip)\b/i },
];

const sourcePolicies: SourcePolicy[] = [
  {
    source: Source.BLURAY,
    matches: groups => groups.bluray || groups.bdrip || groups.brrip,
  },
  {
    source: Source.WEBRIP,
    matches: groups => groups.webrip,
  },
  {
    source: Source.WEBDL,
    matches: groups => !groups.webrip && groups.webdl,
  },
  {
    source: Source.DVD,
    matches: groups => groups.dvdr || (groups.dvd && !groups.scr),
  },
  {
    source: Source.PPV,
    matches: groups => groups.ppv,
  },
  {
    source: Source.WORKPRINT,
    matches: groups => groups.workprint,
  },
  {
    source: Source.TV,
    matches: groups => groups.pdtv || groups.sdtv || groups.dsr || groups.tvrip || groups.hdtv,
  },
  {
    source: Source.CAM,
    matches: groups => groups.cam,
  },
  {
    source: Source.TELESYNC,
    matches: groups => groups.ts,
  },
  {
    source: Source.TELECINE,
    matches: groups => groups.tc,
  },
  {
    source: Source.SCREENER,
    matches: groups => groups.scr,
  },
];

export function parseSourceGroups(title: string): SourceGroups {
  const normalizedName = title
    .replaceAll('_', ' ')
    .replaceAll('[', ' ')
    .replaceAll(']', ' ')
    .trim();

  const groups: SourceGroups = {
    bluray: false,
    webdl: false,
    webrip: false,
    hdtv: false,
    bdrip: false,
    brrip: false,
    scr: false,
    dvdr: false,
    dvd: false,
    dsr: false,
    regional: false,
    ppv: false,
    ts: false,
    tc: false,
    cam: false,
    workprint: false,
    pdtv: false,
    sdtv: false,
    tvrip: false,
  };

  for (const { group, regex } of sourceGroupPatterns) {
    groups[group] = regex.test(normalizedName);
  }

  return groups;
}

export function parseSource(title: string, groups?: SourceGroups): Source[] {
  groups ??= parseSourceGroups(title);

  return sourcePolicies.filter(({ matches }) => matches(groups)).map(({ source }) => source);
}
