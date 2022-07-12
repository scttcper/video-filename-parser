import { parseSource, Source } from './source.js';

export enum Resolution {
  R2160P = '2160P',
  R1080P = '1080P',
  R720P = '720P',
  R576P = '576P',
  R540P = '540P',
  R480P = '480P',
}

const R2160pExp =
  /(?<R2160P>2160p|4k[-_. ](?:UHD|HEVC|BD)|(?:UHD|HEVC|BD)[-_. ]4k|\b(4k)\b|COMPLETE.UHD|UHD.COMPLETE)/i;
const R1080pExp = /(?<R1080P>1080(i|p)|1920x1080)(10bit)?/i;
const R720pExp = /(?<R720P>720(i|p)|1280x720|960p)(10bit)?/i;
const R576pExp = /(?<R576P>576(i|p))/i;
const R540pExp = /(?<R540P>540(i|p))/i;
const R480Exp = /(?<R480P>480(i|p)|640x480|848x480)/i;
const resolutionExp = new RegExp(
  [
    R2160pExp.source,
    R1080pExp.source,
    R720pExp.source,
    R576pExp.source,
    R540pExp.source,
    R480Exp.source,
  ].join('|'),
  'i',
);

export function parseResolution(title: string): { resolution?: Resolution; source?: string } {
  const result = resolutionExp.exec(title);

  if (result?.groups) {
    for (const key of Object.keys(Resolution)) {
      if (result.groups[key] !== undefined) {
        return {
          resolution: Resolution[key as keyof typeof Resolution],
          source: result.groups[key],
        };
      }
    }
  }

  // Fallback to guessing from some sources
  // Make safe assumptions like dvdrip is probably 480p
  const source = parseSource(title);
  if (source.includes(Source.DVD)) {
    return { resolution: Resolution.R480P };
  }

  return {};
}
