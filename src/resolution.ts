import { parseSource, Source } from './source.js';
export enum Resolution {
  R2160P = '2160P',
  R1080P = '1080P',
  R720P = '720P',
  R576P = '576P',
  R540P = '540P',
  R480P = '480P',
  R360P = '360P',
}

const resolutionPatterns: Array<{ resolution: Resolution; regex: RegExp }> = [
  {
    resolution: Resolution.R2160P,
    regex:
      /2160p|3840x2160|4096x2160|4k[-_. ](?:UHD|HEVC|BD|H\.?265)|(?:UHD|HEVC|BD|H\.?265)[-_. ]4k|\b(4k)\b|COMPLETE.UHD|UHD.COMPLETE/i,
  },
  {
    resolution: Resolution.R1080P,
    regex: /(1080(i|p)|1920x1080|1440p|\bFHD\b|4kto1080p)(10bit)?/i,
  },
  { resolution: Resolution.R720P, regex: /(720(i|p)|1280x720|960p)(10bit)?/i },
  { resolution: Resolution.R576P, regex: /576(i|p)/i },
  { resolution: Resolution.R540P, regex: /540(i|p)/i },
  { resolution: Resolution.R480P, regex: /480(i|p)|640x480|848x480/i },
  { resolution: Resolution.R360P, regex: /360p/i },
];

export function parseResolution(
  title: string,
  precomputedSource?: Source[],
): { resolution?: Resolution; source?: string } {
  const parsedResolution = parseResolutionFromTitle(title);
  if (parsedResolution.resolution) {
    return parsedResolution;
  }

  // Fallback to guessing from some sources
  // Make safe assumptions like dvdrip is probably 480p
  const source = precomputedSource ?? parseSource(title);
  if (source.includes(Source.DVD)) {
    return { resolution: Resolution.R480P };
  }

  return {};
}

export function parseResolutionFromTitle(title: string): {
  resolution?: Resolution;
  source?: string;
} {
  for (const { resolution, regex } of resolutionPatterns) {
    const match = regex.exec(title);
    if (match) {
      return {
        resolution,
        source: match[0],
      };
    }
  }

  return {};
}
