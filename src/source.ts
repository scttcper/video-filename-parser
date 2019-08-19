const blurayExp = /(?<bluray>M?BluRay|Blu-Ray|HDDVD|BD|BDISO|BD25|BD50|BR.?DISK)/i;
const webdlExp = /(?<webdl>WEB[-_. ]DL|HDRIP|WEBDL|WebRip|Web-Rip|iTunesHD|WebHD|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p[. ]WEB[. ])/i;
const hdtvExp = /(?<hdtv>HDTV)/i;
const bdripExp = /(?<bdrip>BDRip)/i;
const brripExp = /(?<brrip>BRRip)/i;
const dvdrExp = /(?<dvdr>DVD-R|DVDR)/i;
const dvdExp = /(?<dvd>DVD|DVDRip|NTSC|PAL|xvidvd)/i;
const dsrExp = /(?<dsr>WS[-_. ]DSR|DSR)/i;
const regionalExp = /(?<regional>R[0-9]{1}|REGIONAL)/i;
const scrExp = /(?<scr>SCR|SCREENER|DVDSCR|DVDSCREENER)/i;
const tsExp = /(?<ts>TS|TELESYNC|HD-TS|HDTS|PDVD|TSRip|HDTSRip)/i;
const tcExp = /(?<tc>TC|TELECINE|HD-TC|HDTC)/i;
const camExp = /(?<cam>CAMRIP|CAM|HDCAM|HD-CAM)/i;
const wpExp = /(?<wp>WORKPRINT|WP)/i;
const pdtvExp = /(?<pdtv>PDTV)/i;
const sdtvExp = /(?<sdtv>SDTV)/i;
const tvripExp = /(?<tvrip>TVRip)/i;

export enum Source {
  BLURAY = 'BLURAY',
  WEBDL = 'WEBDL',
  DVD = 'DVD',
  CAM = 'CAM',
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
    dvdrExp.source,
    dvdExp.source,
    dsrExp.source,
    regionalExp.source,
    scrExp.source,
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
  const normalizedName = title.replace(/_/g, ' ').trim().toLowerCase();

  const result = sourceExp.exec(normalizedName);
  if (!result || !result.groups) {
    return null;
  }

  const groups = result.groups;

  if (groups.bluray || groups.bdrip || groups.brrip) {
    return Source.BLURAY;
  }

  if (groups.webdl) {
    return Source.WEBDL;
  }

  if (groups.pdtv || groups.sdtv || groups.dsr || groups.tvrip) {
    return Source.TV;
  }

  return null;
}
