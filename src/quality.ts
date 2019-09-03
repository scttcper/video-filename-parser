import { parseResolution, Resolution } from './resolution';
import { Source, parseSourceGroups, parseSource } from './source';
import { parseCodec, Codec } from './codec';

const properRegex = /\b(?<proper>proper|repack|rerip)\b/i;
const realRegex = /\b(?<real>REAL)\b/; // not insensitive
const versionExp = /(?<version>v\d\b|\[v\d\])/i;

const hardcodedSubsExp = /\b(?<hcsub>(\w+SUBS?)\b)|(?<hc>(HC|SUBBED))\b/i;
const remuxExp = /\b(?<remux>(BD|UHD)?Remux)\b/i;
const bdiskExp = /\b(COMPLETE|ISO|BDISO|BD25|BD50|BR.?DISK)\b/i;

export enum QualityModifier {
  REMUX = 'REMUX',
  SCREENER = 'SCREENER',
  BRDISK = 'BRDISK',
  REGIONAL = 'REGIONAL',
}

export interface QualityModel {
  name: string;
  source: Source | null;
  modifier: QualityModifier | null;
  resolution: Resolution | null;
  revision: Revision;
}

export interface Revision {
  version: number;
  real: number;
}

export const Quality = {
  // is a "regional" tag necessary?
  // Pre-release
  WORKPRINT: {
    name: 'WORKPRINT',
    source: Source.WORKPRINT,
  },
  CAM: {
    name: 'CAM',
    source: Source.CAM,
  },
  TELESYNC: {
    name: 'TELESYNC',
    source: Source.TELESYNC,
  },
  TELECINE: {
    name: 'TELECINE',
    source: Source.TELECINE,
  },
  DVDSCR: {
    name: 'DVDSCR',
    source: Source.DVD,
    modifier: QualityModifier.SCREENER,
    resolution: Resolution.R480P,
  },

  // SD
  SDTV: {
    name: 'SDTV',
    source: Source.TV,
    resolution: Resolution.R480P,
  },
  DVD: {
    name: 'DVD',
    source: Source.DVD,
    resolution: Resolution.R480P,
  },
  DVDR: {
    name: 'DVD-R',
    source: Source.DVD,
    resolution: Resolution.R480P,
    modifier: QualityModifier.REMUX,
  },

  // HDTV
  HDTV720P: {
    name: 'HDTV-720p',
    source: Source.TV,
    resolution: Resolution.R720P,
  },
  HDTV1080P: {
    name: 'HDTV-1080p',
    source: Source.TV,
    resolution: Resolution.R1080P,
  },
  HDTV2160P: {
    name: 'HDTV-2160p',
    source: Source.TV,
    resolution: Resolution.R2160P,
  },

  // Web-DL
  WEBDL480P: {
    name: 'WEBDL-480p',
    source: Source.WEBDL,
    resolution: Resolution.R480P,
  },
  WEBDL720P: {
    name: 'WEBDL-720p',
    source: Source.WEBDL,
    resolution: Resolution.R720P,
  },
  WEBDL1080P: {
    name: 'WEBDL-1080p',
    source: Source.WEBDL,
    resolution: Resolution.R1080P,
  },
  WEBDL2160P: {
    name: 'WEBDL-2160p',
    source: Source.WEBDL,
    resolution: Resolution.R2160P,
  },

  // Bluray
  BLURAY480P: {
    name: 'BLURAY-480p',
    source: Source.BLURAY,
    resolution: Resolution.R480P,
  },
  BLURAY576P: {
    name: 'BLURAY-576p',
    source: Source.BLURAY,
    resolution: Resolution.R576P,
  },
  BLURAY720P: {
    name: 'BLURAY-720p',
    source: Source.BLURAY,
    resolution: Resolution.R720P,
  },
  BLURAY1080P: {
    name: 'BLURAY-1080p',
    source: Source.BLURAY,
    resolution: Resolution.R1080P,
  },
  BLURAY2160P: {
    name: 'BLURAY-2160p',
    source: Source.BLURAY,
    resolution: Resolution.R2160P,
  },

  // remux
  REMUX1080P: {
    name: 'REMUX-1080p',
    source: Source.BLURAY,
    resolution: Resolution.R1080P,
    modifier: QualityModifier.REMUX,
  },
  REMUX2160P: {
    name: 'REMUX-2160p',
    source: Source.BLURAY,
    resolution: Resolution.R2160P,
    modifier: QualityModifier.REMUX,
  },

  BRDISK: {
    name: 'BR-DISK',
    source: Source.BLURAY,
    modifier: QualityModifier.BRDISK,
  },
} as const;

export function parseQualityModifyers(title: string): Revision {
  const normalizedTitle = title
    .trim()
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase();

  const result: Revision = {
    version: 1,
    real: 0,
  };

  if (properRegex.test(normalizedTitle)) {
    result.version = 2;
  }

  const versionResult = versionExp.exec(normalizedTitle);
  if (versionResult && versionResult.groups) {
    // get numbers from version regex
    const digits = /\d/i.exec(versionResult.groups.version);
    if (digits) {
      const value = parseInt(digits[0], 10);
      if (!Number.isNaN(value)) {
        result.version = value;
      }
    }
  }

  let realCount = 0;
  const realGlobalExp = RegExp(realRegex.source, 'g');
  // use non normalized title to prevent insensitive REAL matching
  while (realGlobalExp.exec(title)) {
    realCount += 1;
  }

  result.real = realCount;

  return result;
}

export function parseQuality(title: string): QualityModel {
  const normalizedTitle = title
    .trim()
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase();

  const revision = parseQualityModifyers(title);
  const resolution = parseResolution(normalizedTitle);
  const sourceGroups = parseSourceGroups(normalizedTitle);
  const source = parseSource(normalizedTitle);
  const codec = parseCodec(title);

  const result: QualityModel = {
    name: '',
    source,
    resolution,
    revision,
    modifier: null,
  };

  if (bdiskExp.test(normalizedTitle) && sourceGroups.bluray) {
    result.modifier = QualityModifier.BRDISK;
    result.source = Source.BLURAY;
  }

  if (remuxExp.test(normalizedTitle) && sourceGroups.webdl && sourceGroups.hdtv) {
    result.modifier = QualityModifier.REMUX;
    result.source = Source.BLURAY;
    return result; // We found remux!
  }

  if (source !== null) {
    if (sourceGroups.bluray) {
      result.source = Source.BLURAY;
      if (codec === Codec.XVID) {
        result.resolution = Resolution.R480P;
        result.source = Source.DVD;
      }

      if (resolution === null) {
        // assume bluray is at least 720p
        result.resolution = Resolution.R720P;
      }

      if (resolution === null && result.modifier === QualityModifier.BRDISK) {
        result.resolution = Resolution.R1080P;
      }

      return result;
    }

    if (sourceGroups.webdl) {
      result.source = Source.WEBDL;
      if (resolution === null) {
        result.resolution = Resolution.R480P;
      }

      if (resolution === null) {
        result.resolution = Resolution.R480P;
      }

      if (resolution === null && title.includes('[WEBDL]')) {
        result.resolution = Resolution.R720P;
      }

      return result;
    }
  }

  return result;
}
