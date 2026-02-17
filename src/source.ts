const blurayExp =
  /\b(?<bluray>M?Blu-?Ray|HDDVD|BD|UHDBD|BDISO|BDMux|BD25|BD50|BR.?DISK|Bluray(1080|720)p?|BD(1080|720)p?)\b/i;
export const webdlExp =
  /\b(?<webdl>WEB[-_. ]DL|HDRIP|WEBDL|WEB-DLMux|NF|APTV|NETFLIX|NetflixU?HD|DSNY|DSNP|HMAX|AMZN|AmazonHD|iTunesHD|MaxdomeHD|WebHD\b|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p[. ]WEB[. ]|\b\s\/\sWEB\s\/\s\b|AMZN[. ]WEB[. ])\b/i;
const webripExp = /\b(?<webrip>WebRip|Web-Rip|WEBCap|WEBMux)\b/i;
const hdtvExp = /\b(?<hdtv>HDTV)\b/i;
const bdripExp = /\b(?<bdrip>BDRip|UHDBDRip|HD[-_. ]?DVDRip)\b/i;
const brripExp = /\b(?<brrip>BRRip)\b/i;
const dvdrExp = /\b(?<dvdr>DVD-R|DVDR)\b/i;
const dvdExp = /\b(?<dvd>DVD9?|DVDRip|NTSC|PAL|xvidvd|DvDivX)\b/i;
const dsrExp = /\b(?<dsr>WS[-_. ]DSR|DSR)\b/i;
const regionalExp = /\b(?<regional>R[0-9]{1}|REGIONAL)\b/i;
const ppvExp = /\b(?<ppv>PPV)\b/i;
const scrExp = /\b(?<scr>SCR|SCREENER|DVDSCR|(DVD|WEB).?SCREENER)\b/i;
const tsExp = /\b(?<ts>TS|TELESYNC|HD-TS|HDTS|PDVD|TSRip|HDTSRip)\b/i;
const tcExp = /\b(?<tc>TC|TELECINE|HD-TC|HDTC)\b/i;
const camExp = /\b(?<cam>CAMRIP|CAM|HDCAM|HD-CAM)\b/i;
const workprintExp = /\b(?<workprint>WORKPRINT|WP)\b/i;
const pdtvExp = /\b(?<pdtv>PDTV)\b/i;
const sdtvExp = /\b(?<sdtv>SDTV)\b/i;
const tvripExp = /\b(?<tvrip>TVRip)\b/i;

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

interface SourceGroups {
  bluray: boolean;
  webdl: boolean;
  webrip: boolean;
  hdtv: boolean;
  bdrip: boolean;
  brrip: boolean;
  scr: boolean;
  dvdr: boolean;
  dvd: boolean;
  dsr: boolean;
  regional: boolean;
  ppv: boolean;
  ts: boolean;
  tc: boolean;
  cam: boolean;
  workprint: boolean;
  pdtv: boolean;
  sdtv: boolean;
  tvrip: boolean;
}

export function parseSourceGroups(title: string): SourceGroups {
  const normalizedName = title.replace(/_/g, ' ').replace(/\[/g, ' ').replace(/\]/g, ' ').trim();

  return {
    bluray: blurayExp.test(normalizedName),
    webdl: webdlExp.test(normalizedName),
    webrip: webripExp.test(normalizedName),
    hdtv: hdtvExp.test(normalizedName),
    bdrip: bdripExp.test(normalizedName),
    brrip: brripExp.test(normalizedName),
    scr: scrExp.test(normalizedName),
    dvdr: dvdrExp.test(normalizedName),
    dvd: dvdExp.test(normalizedName),
    dsr: dsrExp.test(normalizedName),
    regional: regionalExp.test(normalizedName),
    ppv: ppvExp.test(normalizedName),
    ts: tsExp.test(normalizedName),
    tc: tcExp.test(normalizedName),
    cam: camExp.test(normalizedName),
    workprint: workprintExp.test(normalizedName),
    pdtv: pdtvExp.test(normalizedName),
    sdtv: sdtvExp.test(normalizedName),
    tvrip: tvripExp.test(normalizedName),
  };
}

export function parseSource(title: string, groups?: SourceGroups): Source[] {
  groups ??= parseSourceGroups(title);
  const result: Source[] = [];

  if (!groups) {
    return result;
  }

  if (groups.bluray || groups.bdrip || groups.brrip) {
    result.push(Source.BLURAY);
  }

  if (groups.webrip) {
    result.push(Source.WEBRIP);
  }

  if (!groups.webrip && groups.webdl) {
    result.push(Source.WEBDL);
  }

  if (groups.dvdr || (groups.dvd && !groups.scr)) {
    result.push(Source.DVD);
  }

  if (groups.ppv) {
    result.push(Source.PPV);
  }

  if (groups.workprint) {
    result.push(Source.WORKPRINT);
  }

  if (groups.pdtv || groups.sdtv || groups.dsr || groups.tvrip || groups.hdtv) {
    result.push(Source.TV);
  }

  if (groups.cam) {
    result.push(Source.CAM);
  }

  if (groups.ts) {
    result.push(Source.TELESYNC);
  }

  if (groups.tc) {
    result.push(Source.TELECINE);
  }

  if (groups.scr) {
    result.push(Source.SCREENER);
  }

  return result;
}
