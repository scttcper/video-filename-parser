const blurayExp = /\b(?<bluray>M?BluRay|Blu-Ray|HDDVD|BD|BDISO|BD25|BD50|BR.?DISK)\b/i;
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

const sourceExp = new RegExp(
  [
    blurayExp.source,
    webdlExp.source,
    hdtvExp.source,
    bdripExp.source,
    brripExp.source,
    scrExp.source,
    dvdrExp.source,
    dvdExp.source,
    dsrExp.source,
    regionalExp.source,
    ppvExp.source,
    tsExp.source,
    tcExp.source,
    camExp.source,
    wpExp.source,
    pdtvExp.source,
    sdtvExp.source,
    tvripExp.source,
  ].join('|'),
  'i',
);

export function parseSource(title: string): Source | null {
  const normalizedName = title
    .replace(/_/g, ' ')
    .trim();

  const result = sourceExp.exec(normalizedName);
  if (!result || !result.groups) {
    return null;
  }

  const { groups } = result;

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
