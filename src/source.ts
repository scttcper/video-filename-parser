const blurayExp = /(?<bluray>M?BluRay|Blu-Ray|HDDVD|BD|BDISO|BD25|BD50|BR.?DISK)/i;
const webdlExp = /(?<webdl>WEB[-_. ]DL|HDRIP|WEBDL|WebRip|Web-Rip|NETFLIX|AMZN|iTunesHD|WebHD|WEBCap|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p[. ]WEB[. ])/i;
const hdtvExp = /(?<hdtv>HDTV)/i;
const bdripExp = /(?<bdrip>BDRip)/i;
const brripExp = /(?<brrip>BRRip)/i;
const dvdrExp = /(?<dvdr>DVD-R|DVDR)/i;
const dvdExp = /(?<dvd>DVD|DVDRip|NTSC|PAL|xvidvd)/i;
const dsrExp = /(?<dsr>WS[-_. ]DSR|DSR)/i;
const regionalExp = /(?<regional>R[0-9]{1}|REGIONAL)/i;
const ppvExp = /(?<ppv>PPV)/i;
const scrExp = /(?<scr>SCR|SCREENER|DVDSCR|DVD.?SCREENER)/i;
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
    .trim()
    .toLowerCase();

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
