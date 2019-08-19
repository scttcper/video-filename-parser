// export const sourceExp = new RegExp(`(?:
//   (?<bluray>M?BluRay|Blu-Ray|HDDVD|BD|BDISO|BD25|BD50|BR.?DISK)|
//   (?<webdl>WEB[-_. ]DL|HDRIP|WEBDL|WebRip|Web-Rip|iTunesHD|WebHD|[. ]WEB[. ](?:[xh]26[45]|DD5[. ]1)|\d+0p[. ]WEB[. ])|
//   (?<hdtv>HDTV)|
//   (?<bdrip>BDRip)|(?<brrip>BRRip)|
//   (?<dvdr>DVD-R|DVDR)|
//   (?<dvd>DVD|DVDRip|NTSC|PAL|xvidvd)|
//   (?<dsr>WS[-_. ]DSR|DSR)|
//   (?<regional>R[0-9]{1}|REGIONAL)|
//   (?<scr>SCR|SCREENER|DVDSCR|DVDSCREENER)|
//   (?<ts>TS|TELESYNC|HD-TS|HDTS|PDVD|TSRip|HDTSRip)|
//   (?<tc>TC|TELECINE|HD-TC|HDTC)|
//   (?<cam>CAMRIP|CAM|HDCAM|HD-CAM)|
//   (?<wp>WORKPRINT|WP)|
//   (?<pdtv>PDTV)|
//   (?<sdtv>SDTV)|
//   (?<tvrip>TVRip)
//   )`, 'ixg');

const blurayExp = /M?BluRay|Blu-Ray|HDDVD|BD|BDISO|BD25|BD50|BR.?DISK/i;
const blurayModify = /COMPLETE|ISO|BDISO|BD25|BD50|BR.?DISK/i;



export enum Source {
  CAM,
  TELESYNC,
  TELECINE,
  WORKPRINT,
  DVD,
  TV,
  WEBDL,
  BLURAY,
}

export enum Modifier {
  REGIONAL,
  SCREENER,
  RAWHD,
  BRDISK,
  REMUX,
}

// Resolution

export function getSource(filename: string) {
  const bluray = blurayExp.test(filename);
  return bluray;
}


