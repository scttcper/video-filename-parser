const blurayExp = /\b(?<bluray>M?BluRay|Blu-Ray|HDDVD|BD|BDISO|BD25|BD50|BR.?DISK|Bluray1080p|BD1080p)\b/i;
const webdlExp = /\b(?<webdl>WEB[-_. ]DL|HDRIP|WEBDL|WebRip|Web-Rip|NETFLIX|AMZN|iTunesHD|WebHD|WEBCap|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p[. ]WEB[. ])\b/i;
const hdtvExp = /\b(?<hdtv>HDTV)\b/i;
const bdripExp = /\b(?<bdrip>BDRip)\b/i;
const brripExp = /\b(?<brrip>BRRip)\b/i;
const dvdrExp = /\b(?<dvdr>DVD-R|DVDR)\b/i;
const dvdExp = /\b(?<dvd>DVD|DVDRip|NTSC|PAL|xvidvd)\b/i;
const dsrExp = /\b(?<dsr>WS[-_. ]DSR|DSR)\b/i;
const regionalExp = /\b(?<regional>R[0-9]{1}|REGIONAL)\b/i;
const ppvExp = /\b(?<ppv>PPV)\b/i;
const scrExp = /\b(?<scr>SCR|SCREENER|DVDSCR|DVD.?SCREENER)\b/i;
const tsExp = /\b(?<ts>TS|TELESYNC|HD-TS|HDTS|PDVD|TSRip|HDTSRip)\b/i;
const tcExp = /\b(?<tc>TC|TELECINE|HD-TC|HDTC)\b/i;
const camExp = /\b(?<cam>CAMRIP|CAM|HDCAM|HD-CAM)\b/i;
const wpExp = /\b(?<wp>WORKPRINT|WP)\b/i;
const pdtvExp = /\b(?<pdtv>PDTV)\b/i;
const sdtvExp = /\b(?<sdtv>SDTV)\b/i;
const tvripExp = /\b(?<tvrip>TVRip)\b/i;

export enum Source {
  BLURAY = 'BLURAY',
  WEBDL = 'WEBDL',
  DVD = 'DVD',
  CAM = 'CAM',
  SCREENER = 'SCREENER',
  PPV = 'PPV',
  TELESYNC = 'TELESYNC',
  TELECINE = 'TELECINE',
  WORKPRINT = 'WORKPRINT',
  TV = 'TV',
}

export function parseSourceGroups(title: string) {
  const normalizedName = title
    .replace(/_/g, ' ')
    .trim();

  return {
    bluray: blurayExp.test(normalizedName),
    webdl: webdlExp.test(normalizedName),
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
    wp: wpExp.test(normalizedName),
    pdtv: pdtvExp.test(normalizedName),
    sdtv: sdtvExp.test(normalizedName),
    tvrip: tvripExp.test(normalizedName),
  };
}

export function parseSource(title: string): Source | null {
  const groups = parseSourceGroups(title);
  if (!groups) {
    return null;
  }

  if (groups.bluray || groups.bdrip || groups.brrip) {
    return Source.BLURAY;
  }

  if (groups.webdl) {
    return Source.WEBDL;
  }

  if (groups.scr) {
    return Source.SCREENER;
  }

  if (groups.ppv) {
    return Source.PPV;
  }

  if (groups.wp) {
    return Source.WORKPRINT;
  }

  if (groups.pdtv || groups.sdtv || groups.dsr || groups.tvrip) {
    return Source.TV;
  }

  if (groups.cam) {
    return Source.CAM;
  }

  return null;
}
