const blurayExp =
  /\b(M?Blu-?Ray|HDDVD|BD|UHDBD|BDISO|BDMux|BD25|BD50|BR.?DISK|Bluray(1080|720)p?|BD(1080|720)p?)\b/i;
export const webdlExp =
  /\b(WEB[-_. ]DL|HDRIP|WEBDL|WEB-DLMux|NF|APTV|NETFLIX|NetflixU?HD|DSNY|DSNP|HMAX|AMZN|AmazonHD|iTunesHD|MaxdomeHD|WebHD\b|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p[. ]WEB[. ]|\b\s\/\sWEB\s\/\s\b|AMZN[. ]WEB[. ])\b/i;

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
  { group: 'hdtv', regex: /\b(HDTV)\b/i },
  { group: 'bdrip', regex: /\b(BDRip|UHDBDRip|HD[-_. ]?DVDRip)\b/i },
  { group: 'brrip', regex: /\b(BRRip)\b/i },
  { group: 'scr', regex: /\b(SCR|SCREENER|DVDSCR|(DVD|WEB).?SCREENER)\b/i },
  { group: 'dvdr', regex: /\b(DVD-R|DVDR)\b/i },
  { group: 'dvd', regex: /\b(DVD9?|DVDRip|NTSC|PAL|xvidvd|DvDivX)\b/i },
  { group: 'dsr', regex: /\b(WS[-_. ]DSR|DSR)\b/i },
  { group: 'regional', regex: /\b(R[0-9]{1}|REGIONAL)\b/i },
  { group: 'ppv', regex: /\b(PPV)\b/i },
  { group: 'ts', regex: /\b(TS|TELESYNC|HD-TS|HDTS|PDVD|TSRip|HDTSRip)\b/i },
  { group: 'tc', regex: /\b(TC|TELECINE|HD-TC|HDTC)\b/i },
  { group: 'cam', regex: /\b(CAMRIP|CAM|HDCAM|HD-CAM)\b/i },
  { group: 'workprint', regex: /\b(WORKPRINT|WP)\b/i },
  { group: 'pdtv', regex: /\b(PDTV)\b/i },
  { group: 'sdtv', regex: /\b(SDTV)\b/i },
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

  return Object.fromEntries(
    sourceGroupPatterns.map(({ group, regex }) => [group, regex.test(normalizedName)]),
  ) as SourceGroups;
}

export function parseSource(title: string, groups?: SourceGroups): Source[] {
  groups ??= parseSourceGroups(title);

  return sourcePolicies.filter(({ matches }) => matches(groups)).map(({ source }) => source);
}
