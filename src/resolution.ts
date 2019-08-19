export enum Resolution {
  R2160P = '2160',
  R1080P = '1080',
  R720P = '720',
  R576P = '576',
  R480P = '480',
}

const R2160pExp = /(?<R2160P>2160(i|p)|UHD)/i;
const R1080pExp = /(?<R1080P>1080(i|p)|1920x1080)/i;
const R720pExp = /(?<R720P>720(i|p)|1280x720)/i;
const R576pExp = /(?<R576P>576(i|p))/i;
const R480Exp = /(?<R480P>480(i|p)|640x480|848x480)/i;
const resolutionExp = new RegExp(
  [R2160pExp.source, R1080pExp.source, R720pExp.source, R576pExp.source, R480Exp.source].join('|'),
  'i'
);

export function parseResolution(title: string): Resolution | null {
  const normalizedName = title.replace(/_/g, ' ').trim().toLowerCase();

  const result = resolutionExp.exec(normalizedName);
  if (!result || !result.groups) {
    return null;
  }

  for (const key of Object.keys(Resolution)) {
    if (result.groups[key] !== undefined) {
      return Resolution[key];
    }
  }

  return null;
}
